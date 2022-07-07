// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

// "is SimpleStorage" causes ExtraStorage to inherit all the functionality of SimpleStorage. Considered a child of SimpleStorage.
contract ExtraStorage is SimpleStorage {
    // To manipulate an inherited function we need to add the "virtual" to the end of it in the inherited doc, and "override" to the end of the function mutating it.
    function store(uint256 _favoriteNumber) public override {
        // This will cause the store function to now add 5 to the number being stored.
        favoriteNumber = _favoriteNumber + 5;
    }
}
