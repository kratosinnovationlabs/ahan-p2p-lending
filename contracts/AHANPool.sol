// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LiquidBUSD.sol";

/**
 * @title AHAN Pool
 * @notice Main lending pool for P2P lenders to deposit BUSDT and receive lqBUSD
 * @dev Handles deposits, withdrawals, and interest distribution
 */
contract AHANPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Official BUSDT contract on BSC Testnet
    IERC20 public immutable BUSDT;
    LiquidBUSD public immutable lqBUSD;
    
    // Pool metrics
    uint256 public totalDeposits;
    uint256 public totalBorrowed;
    uint256 public totalInterestEarned;
    
    // Lender tracking
    mapping(address => uint256) public lenderDeposits;
    mapping(address => uint256) public lenderDepositTime;
    
    // Events
    event Deposited(address indexed lender, uint256 amount, uint256 lqBUSDMinted);
    event Withdrawn(address indexed lender, uint256 amount, uint256 lqBUSDBurned);
    event InterestClaimed(address indexed lender, uint256 amount);
    
    constructor(address _busdtAddress, address _lqBUSDAddress) Ownable(msg.sender) {
        require(_busdtAddress != address(0), "Invalid BUSDT address");
        require(_lqBUSDAddress != address(0), "Invalid lqBUSD address");
        
        BUSDT = IERC20(_busdtAddress);
        lqBUSD = LiquidBUSD(_lqBUSDAddress);
    }
    
    /**
     * @notice Deposit BUSDT and receive lqBUSD tokens (1:1 ratio)
     * @param amount Amount of BUSDT to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer BUSDT from lender to pool
        BUSDT.safeTransferFrom(msg.sender, address(this), amount);
        
        // Mint lqBUSD tokens to lender (1:1 ratio)
        lqBUSD.mint(msg.sender, amount);
        
        // Update tracking
        lenderDeposits[msg.sender] += amount;
        lenderDepositTime[msg.sender] = block.timestamp;
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount, amount);
    }
    
    /**
     * @notice Withdraw BUSDT by burning lqBUSD tokens
     * @param amount Amount of lqBUSD to burn (receives equivalent BUSDT)
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(lqBUSD.balanceOf(msg.sender) >= amount, "Insufficient lqBUSD balance");
        require(BUSDT.balanceOf(address(this)) >= amount, "Insufficient pool liquidity");
        
        // Burn lqBUSD tokens
        lqBUSD.burn(msg.sender, amount);
        
        // Transfer BUSDT back to lender
        BUSDT.safeTransfer(msg.sender, amount);
        
        // Update tracking
        lenderDeposits[msg.sender] -= amount;
        totalDeposits -= amount;
        
        emit Withdrawn(msg.sender, amount, amount);
    }
    
    /**
     * @notice Get lender's current position
     * @param lender Address of the lender
     */
    function getLenderPosition(address lender) external view returns (
        uint256 depositedAmount,
        uint256 lqBUSDBalance,
        uint256 depositTimestamp
    ) {
        return (
            lenderDeposits[lender],
            lqBUSD.balanceOf(lender),
            lenderDepositTime[lender]
        );
    }
    
    /**
     * @notice Get pool statistics
     */
    function getPoolStats() external view returns (
        uint256 deposits,
        uint256 borrowed,
        uint256 available,
        uint256 utilization
    ) {
        uint256 availableLiquidity = BUSDT.balanceOf(address(this));
        uint256 utilizationRate = totalDeposits > 0 
            ? (totalBorrowed * 10000) / totalDeposits 
            : 0;
        
        return (
            totalDeposits,
            totalBorrowed,
            availableLiquidity,
            utilizationRate
        );
    }
}
