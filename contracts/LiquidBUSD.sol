// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LiquidBUSD (lqBUSD)
 * @notice Liquid staking token representing deposited BUSDT in AHAN pool
 * @dev 1:1 ratio with BUSDT, accrues interest over time
 */
contract LiquidBUSD is ERC20, Ownable {
    address public poolContract;
    
    event PoolContractUpdated(address indexed newPool);
    
    constructor() ERC20("Liquid BUSDT", "lqBUSD") Ownable(msg.sender) {}
    
    modifier onlyPool() {
        require(msg.sender == poolContract, "Only pool can mint/burn");
        _;
    }
    
    function setPoolContract(address _pool) external onlyOwner {
        require(_pool != address(0), "Invalid pool address");
        poolContract = _pool;
        emit PoolContractUpdated(_pool);
    }
    
    function mint(address to, uint256 amount) external onlyPool {
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyPool {
        _burn(from, amount);
    }
}
