/**
 * Running "hardhat deploy" will call a function specified in this script.
 */

/** EXAMPLE FUNCTION */
// async function deployFunc(hre) {
//   console.log("Hi!")
// }
// This exports the function deployFunc as the default function for hardhat deploy to look for.
// module.exports.default = deployFunc

/** EXAMPLE 2 FUNCTION */
// This function is the same as the example function above, however it is anonymous (no name).
// module.exports = async (hre) => {
//   const { getNamedAccounts, deployments } = hre
//   // Above line is same as writing:
//   //  hre.getNamedAccounts
//   //  hre.deployments
// }

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
// The above line's syntax is the same as:
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

// if statement depending on chainId

// if the contract doesn't exist, we deploy a minimal version of it for our local testing.

// Using syntactic sugar we can reduce example 2 to the following:
// The function is an asyncronous nameless function using arrow notation.
// The function contains two object variable parameters, getNamedAccounts and deployments.
module.exports = async ({ getNamedAccounts, deployments }) => {
  // Deployments object gets us two functions, deploy and log.
  const { deploy, log } = deployments
  // Gets a deployer account from getNamedAccounts() function. It gets us a named account based of a number from the accounts section in the network in the hardhat.config.js
  const { deployer } = await getNamedAccounts()
  // Gets a chainId to be used for deployment.
  const chainId = network.config.chainId
  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  // Tests if the name of the network isn't a development chain we want to verify
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
  log("------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
