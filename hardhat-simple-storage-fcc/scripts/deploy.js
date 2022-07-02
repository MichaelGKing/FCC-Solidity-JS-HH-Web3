/**
 * Imports a whole bunch of things including tasks from hardhat in our scripts.
 * @param run allows us to run any hardhat tasks
 * @param ethers
 */
const { ethers, run, network } = require("hardhat")

/**
 * This grabs the contract and deploys the contract
 */
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  console.log(`Deployed contract to: ${simpleStorage.address}`)

  // Tests if we are deploying the contract on rinkeby and if an API key exists, then verifies on etherscan if this is true.
  // This piece of code programmatically verifies our contract.
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waitng for block txes...")
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  /**
   * This interacts with the contract. I.e. sets and retrieves favorite values.
   */
  const currentValue = await simpleStorage.retrieve()
  console.log(`Current value is ${currentValue}`)
  // Updates the current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Update value is ${updatedValue}`)
}

/**
 * This function automatically verifies our code for us on the etherscan.
 * @param contractAddress The address of the contract.
 * @param args Arguments for the contract. Blank since we have no constructor.
 */
async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  // Sometimes verification won't work so good to catch these errors.
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
