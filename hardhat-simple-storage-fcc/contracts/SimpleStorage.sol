// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; // This sets the version of solidity you want to use, 0.8.7 is quite stable.

/**
 *  This is our contracts file we compile it by running "yarn hardhat compile", all the compilation goes into the artifacts and chache files.
 *  To clean these files we run "yarn hardhat clean"
 *
 */
contract SimpleStorage {
  // This gets initialized to 0.
  uint256 favoriteNumber; //Add public to make the variable viewable

  mapping(string => uint256) public nameToFavoriteNumber;

  struct People {
    uint256 favoriteNumber;
    string name;
  }

  People[] public people; // Creates a people array, dynamic array as size is not specified.

  function store(uint256 _favoriteNumber) public virtual {
    //prefix it with _ to indicate variable is different from global variable.
    favoriteNumber = _favoriteNumber;
    //retrieve(); This will cost gas.
  }

  // view, pure dont use gas, they just read states. Cannot update blockchain with these functions.
  // Only functions that modify blockchain use gas.
  // Calling view functions is free unless called inside a function that uses gas.
  function retrieve() public view returns (uint256) {
    return favoriteNumber;
  }

  // calldata and memory mean that the variable is only going to exist temporarily.
  // storage exists outside the function execution.
  // Why doesn't the uint256 variable have memory after it?
  // String is an array of bytes so we have to indicate where it is stored.
  function addPerson(string memory _name, uint256 _favoriteNumber) public {
    people.push(People(_favoriteNumber, _name));
    nameToFavoriteNumber[_name] = _favoriteNumber;
  }
}
