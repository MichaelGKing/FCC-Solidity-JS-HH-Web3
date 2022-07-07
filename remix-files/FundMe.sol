// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error NotOwner();

// FundMe contract that allows users to send tokens to the contract, and for the contract owner to then withdraw them.
contract FundMe {
    // Allows us to attach functions in our PriceConverter library to uint256 variables.
    using PriceConverter for uint256;

    // "constant" keyword reduces the gas price of setting the variable.
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    // Stores all the addresses that send the contract money.
    address[] public funders;

    // Maps the amount of money to the address that sent it.
    mapping(address => uint256) public addressToAmountFunded;

    // Variable to store the owner of the contract for withdrawing the funds.
    address public immutable i_owner; // variables we set one time on a different line we can set as immutable. Very similar gas savings to constant.

    // Constructor function is used to execute code we want executed as soon as the contract is deployed.
    constructor() {
        // Sets the owner variable to be equal to the address that deployed the contract.
        i_owner = msg.sender;
    }

    // Function allows users to send a minimum ETH amount to the contract. To allow it to do this we need to add the keyword "payable".
    function fund() public payable {
        // Tests if the value field of our transaction is greater than the minimum value we have set.
        // "require" keyword, will revert the transaction and send back any remaining gas if condition is not met. Reversing any code before it.
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didn't send enough eth!"
        );
        // Pushes the address of the funder to the funders array.
        funders.push(msg.sender);
        // Maps the value of transaction to the address that sent it.
        addressToAmountFunded[msg.sender] += msg.value;
    }

    // Function allows contract owner to withdraw the funds sent to the contract.
    function withdraw() public onlyOwner {
        //onlyOwner makes the function call onlyOwner before doing the code in the function.
        // Loop and resets our mapping values to 0, since we withdrew all the money.
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // Resets our funders array to blank new array.
        funders = new address[](0);

        // This will send the contracts funds to the contracts owner.
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }(""); //returns two variables
        require(callSuccess, "Call failed");
    }

    // This modifier checks if the msg.sender in withdraw function is the same as the owner, then allows it
    modifier onlyOwner() {
        // First the modifier tests if the sender is the owner.
        if (msg.sender != i_owner) {
            revert NotOwner();
        } // more gas efficient way for error messages.
        _; // then the modifier executes the rest of the code in the function.
    }

    // What happens if someone sends this contract ETH without calling the fund function?
    // Two special functions receive() and fallback() provide solution.
    // Receive function is triggered when something is sent to the contract with no calldata without using fund function.
    receive() external payable {
        // Sends them to the fund function.
        fund();
    }

    // fallback function is triggered when something is sent to the contract with calldata without using fund function.
    fallback() external payable {
        // Sends them to the fund function.
        fund();
    }
}
