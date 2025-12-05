// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestBUSDT is ERC20, Ownable {
    constructor() ERC20("Test Binance USD", "BUSDT") {
        // Mint 1 million test tokens to deployer
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }
    
    // Allow anyone to mint test tokens
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    // Faucet function - get 1000 BUSDT per request
    function faucet() external {
        _mint(msg.sender, 1000 * 10**decimals());
    }
}
