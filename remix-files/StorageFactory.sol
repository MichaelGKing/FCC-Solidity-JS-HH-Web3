/** Program that creates  **/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// We need to import any contracts we wish to use in new .sol files. This will import the files of SimpleStorage.sol as if they were copy pasted in the file line.
import "./SimpleStorage.sol";

// import will automatically bring in the abi for the contract.

// Smart contract for creating SimpleStorage smart contracts
contract StorageFactory {
    // Global variable simpleStorageArray for storing SimpleStorage contracts. It stores the address for the contract.
    SimpleStorage[] public simpleStorageArray;

    // This function creates a SimpleStorage contract and pushes it to an array of SimpleStorage's.
    function createSimpleStorageContract() public {
        // "new" keyword is used to create a contract.
        SimpleStorage simpleStorage = new SimpleStorage();
        // Pushes this new contract to our SimpleStorage array.
        simpleStorageArray.push(simpleStorage);
    }

    // Function allows StorageFactory contract to use store function from the SimpleStorage contract.
    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber)
        public
    {
        // Calls the store function on the SimpleStorage contract stored at the specified array.
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    // Function returns the favoriteNumber stored.
    function sfGet(uint256 _simpleStorageIndex) public view returns (uint256) {
        // Returns the favoriteNumber using the retrieve function in the SimpleStorage contract.
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}

// When we store values, are these being stored in our contract?
// We send our contract to be stored on the blockchain as a transaction, which succeeds with enough gas and is then stored on it permanently.
// Do we then modify that contract which is stored on the blockchain when we use the store function through its transaction?

// We deploy the smart contract on the blockchain. It exists there immutably.
// When we call our function store, it uses the abi and address of the contract to store a number on the blockchain, in a different block?
// How then does it know when we go to retrieve favoriteNumber, which one to retrieve, if each is immutably stored on a different block?
