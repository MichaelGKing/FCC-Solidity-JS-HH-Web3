// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// library can't have state variables or send ether, all functions are internal
library PriceConverter {
    function getPrice() internal view returns (uint256) {
        // Sets priceFeed variable to point to the AggregatorV3Interface contract at the inputted address.
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        // Gets the price parameter from the latestRoundData function in the AgrregatorV3Interface.sol file on chainlink's github.
        (, int256 price, , , ) = priceFeed.latestRoundData(); //Price of ETH in terms of USD.
        // Price returns in USD with 8 decimals. ie. 1000.00000000 (without .), must convert this to have 18 decimals so we * by 1e10.
        return uint256(price * 1e10); // msg.value is a uint256 so we have to convert it to one from int256 by type casting.
    }

    function getVersion() internal view returns (uint256) {
        // Sets priceFeed variable to point to the AggregatorV3Interface contract at the inputted address.
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        // Calls the version function on the contract.
        return priceFeed.version();
    }

    /** Function takes an eth amount and returns its value in USD. */
    function getConversionRate(uint256 ethAmount)
        internal
        view
        returns (uint256)
    {
        // Gets the current price of eth in terms of USD in solidity number format. Eg. 1000.00 = 1000_000000000000000000
        uint256 ethPrice = getPrice();
        // Multiplies the price by the amount. Say ethAmount is 1 then it is actually 1_000000000000000000. Must divide by 1e18 due to solidity number format.
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        // Returns the amount in Usd.
        return ethAmountInUsd;
    }
}
