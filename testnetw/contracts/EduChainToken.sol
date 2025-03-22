// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EduChainToken is ERC20, Ownable {
    constructor() ERC20("EduChainToken", "EDU") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1,000,000 EDU tokens
    }

    function rewardUser(address user, uint256 amount) external onlyOwner {
        _mint(user, amount); // Reward user with EDU tokens
    }
}
