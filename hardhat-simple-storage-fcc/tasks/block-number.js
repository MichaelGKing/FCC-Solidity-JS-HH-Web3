/**
 * This is a task and is similar to a script.
 */

const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
  // When we run tasks we automatically pass our anonymous functions the task arguments (none here) and a hre argument.
  // hre can access a lot of the same properties our hardhat package can.
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Current block number: ${blockNumber}`)
  }
)

module.exports = {}
