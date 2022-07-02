//solidity is synchronous programming (line by line)
//JS can be asynchronous which means we can have code run at the same time.

const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

// We will use async functions instead of normal functions in this course.
async function main() {
  // Two methods to compile, compile them in our code or compile them seperately.
  // http://127.0.0.1:7545
  /**
   * We can connect to any blockchain we want using an RPC_URL
   */
  const provider = new ethers.providers.JsonRpcBatchProvider(
    process.env.RPC_URL
  )
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider) // We are able to connect our provider to a wallet or private key in ethers using this.
  // ethers is a package that makes our lives a lot easier to interact with the blockchain in JS.

  /**
   * Runs scripts from our encrypted keys.
   */
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // )
  // wallet = await wallet.connect(provider)

  /**
   * Gets our abi
   */
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  /**
   * Gets our binary to deploy to the blockchain
   */
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )
  /**
   * This deploys our contracts to the blockchain programatically..
   */
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")
  const contract = await contractFactory.deploy() // can only use "await" keyword in async function
  await contract.deployTransaction.wait(1) // Transaction receipt is what you get when you wait for a block confirmation. Transaction response is what you get when you create your transaction.

  /**
   * Interacts with our contracts programatically.
   */
  console.log(`Contract Addresss: ${contract.address}`)
  // Get Number
  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)
  const transactionResponse = await contract.store("7") // We pass variables to contract functions as strings because sometimes the numbers are too big for js.
  const transactionReceipt = await transactionResponse.wait(1)
  const updatedFavoriteNumber = await contract.retrieve()
  console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)
}

// When we call the main function this is some other syntax we are waiting to finish and then printing any errors
// it gets. This calls the main function.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
