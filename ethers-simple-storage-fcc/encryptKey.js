const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

/**
 * Encrypts our private keys so they aren't lying around in plain text if we get hacked.
 */
async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
