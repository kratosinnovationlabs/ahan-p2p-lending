// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ILiquidBUSD {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function transferOwnership(address newOwner) external;
}

/**
 * @title LendingPool
 * @notice Main lending pool for AHAN DeFi. Handles deposits, withdrawals, and lqBUSD minting.
 */
contract LendingPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable busdt;
    ILiquidBUSD public immutable lqBUSD;

    struct LenderPosition {
        uint256 depositedAmount;
        uint256 lqBUSDBalance;
        uint256 depositTimestamp;
    }

    mapping(address => LenderPosition) public lenderPositions;
    
    uint256 public totalDeposits;
    uint256 public totalBorrowed;

    event Deposited(address indexed lender, uint256 amount, uint256 lqBUSDMinted);
    event Withdrawn(address indexed lender, uint256 amount, uint256 lqBUSDBurned);
    event Borrowed(address indexed borrower, uint256 amount);

    constructor(address _busdt, address _lqBUSD) Ownable(msg.sender) {
        require(_busdt != address(0), "Invalid BUSDT address");
        require(_lqBUSD != address(0), "Invalid lqBUSD address");
        
        busdt = IERC20(_busdt);
        lqBUSD = ILiquidBUSD(_lqBUSD);
    }

    /**
     * @notice Deposit BUSDT and receive lqBUSD tokens (1:1 ratio)
     * @param amount Amount of BUSDT to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer BUSDT from lender to pool using SafeERC20
        busdt.safeTransferFrom(msg.sender, address(this), amount);
        
        // Mint lqBUSD tokens 1:1
        lqBUSD.mint(msg.sender, amount);
        
        // Update lender position
        LenderPosition storage position = lenderPositions[msg.sender];
        position.depositedAmount += amount;
        position.lqBUSDBalance += amount;
        position.depositTimestamp = block.timestamp;
        
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount, amount);
    }

    /**
     * @notice Withdraw BUSDT by burning lqBUSD tokens
     * @param amount Amount of lqBUSD to burn (receives equivalent BUSDT)
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        LenderPosition storage position = lenderPositions[msg.sender];
        require(position.lqBUSDBalance >= amount, "Insufficient lqBUSD balance");
        
        uint256 availableLiquidity = busdt.balanceOf(address(this));
        require(availableLiquidity >= amount, "Insufficient pool liquidity");
        
        // Burn lqBUSD tokens
        lqBUSD.burn(msg.sender, amount);
        
        // Transfer BUSDT back to lender using SafeERC20
        busdt.safeTransfer(msg.sender, amount);
        
        // Update lender position
        position.depositedAmount -= amount;
        position.lqBUSDBalance -= amount;
        
        totalDeposits -= amount;
        
        emit Withdrawn(msg.sender, amount, amount);
    }

    /**
     * @notice Borrow BUSDT from the pool (Unsecured for Demo)
     * @param amount Amount of BUSDT to borrow
     */
    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 availableLiquidity = busdt.balanceOf(address(this));
        require(availableLiquidity >= amount, "Insufficient pool liquidity");
        
        // Transfer BUSDT to borrower
        busdt.safeTransfer(msg.sender, amount);
        
        totalBorrowed += amount;
        
        emit Borrowed(msg.sender, amount);
    }

    function getLenderPosition(address lender) external view returns (
        uint256 depositedAmount,
        uint256 lqBUSDBalance,
        uint256 depositTimestamp
    ) {
        LenderPosition memory position = lenderPositions[lender];
        return (
            position.depositedAmount,
            position.lqBUSDBalance,
            position.depositTimestamp
        );
    }

    function getPoolStats() external view returns (
        uint256 deposits,
        uint256 borrowed,
        uint256 available,
        uint256 utilization
    ) {
        uint256 availableLiquidity = busdt.balanceOf(address(this));
        uint256 util = totalDeposits > 0 ? (totalBorrowed * 10000) / totalDeposits : 0;
        
        return (totalDeposits, totalBorrowed, availableLiquidity, util);
    }
}
