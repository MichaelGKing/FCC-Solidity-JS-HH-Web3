// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; // This sets the version of solidity you want to use, 0.8.7 is quite stable.

/**
 *  This is our contracts file we compile it by running "yarn hardhat compile", all the compilation goes into the artifacts and chache files.
 *  To clean these files we run "yarn hardhat clean"
 */
contract SimpleStorage {
  // If we don't give a variable a number it sets it to a default value, for a uint256 it is 0.
  uint256 public favoriteNumber; // Adding the public keyword creates a getter function for the variable.

  // This mapping variable enables us to access the favoriteNumber associated to a name. Remember "public" keyword automatically adds a getter function.
  mapping(string => uint256) public nameToFavoriteNumber;

  // This creates a People object
  struct People {
    uint256 favoriteNumber;
    string name;
  }

  // Creates a dynamic array called people. For storing people from the addPerson function.
  People[] public people;

  // "memory" is specified because solidity needs to know where the string variable will be stored, it does not need to know where the uint256 variable will be stored.
  function addPerson(string memory _name, uint256 _favoriteNumber) public {
    // Calls a push function onto our people array to push a People object
    people.push(People(_favoriteNumber, _name));
    // Adds a key value pair to our nameToFavoriteNumber mapping.
    nameToFavoriteNumber[_name] = _favoriteNumber;
  }

  /**
   *   The function store will change favoriteNumber variable to a new number.
   *   _favoriteNumber function paramter (local variable indicated by _) that will be our new favoriteNumber (global variable) value.
   *   Whenever we execute this function we are sending a transaction.
   */
  function store(uint256 _favoriteNumber) public virtual {
    //prefix it with _ to indicate variable is different from global variable.
    favoriteNumber = _favoriteNumber;
    //retrieve(); This will cost gas.
  }

  // View functions do not use gas since they do not modify the blockchain, unless they are called inside a function that uses gas.
  function retrieve() public view returns (uint256) {c
    return favoriteNumber;
  }
}
