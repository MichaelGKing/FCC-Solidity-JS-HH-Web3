// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FallbackExample {
    uint256 public result;

    // This function is triggered as soon as the contract is sent a transaction.
    receive() external payable {
        //dont have "function" before "receive()" because solidity knows this is a special function
        result = 1;
    }

    fallback() external payable {
        result = 2;
    }
}
