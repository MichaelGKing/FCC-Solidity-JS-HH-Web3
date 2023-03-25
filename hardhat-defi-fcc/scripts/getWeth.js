// This script will interact with our deployed contract.

const { getNamedAccounts, ethers, network } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    // Gets an account to interact with the contract.
    const { deployer } = await getNamedAccounts()
    // Now need to call the "deposit" function on the weth contract. (need abi and contract address)
    // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    // Deposits our ETH
    const tx = await iWeth.deposit({ value: AMOUNT })

    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWeth, AMOUNT }
