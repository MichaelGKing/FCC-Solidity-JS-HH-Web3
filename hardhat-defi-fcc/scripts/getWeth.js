// This loads in the hardhat module
const { getNamedAccounts } = require("hardhat")

/**
 * This script will swap our ETH token for WETH.
 */
async function getWeth() {
  const { deployer } = await getNamedAccounts()
}

module.exports = { getWeth }
