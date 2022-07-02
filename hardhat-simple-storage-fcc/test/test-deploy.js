const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

/**
 * File performs tests on our deployment code. VERY IMPORTANT
 */
describe("SimpleStorage", function () {
  let simpleStorageFactory, simpleStorage
  // This deploys the simplyStorage contract before we run the tests.
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"
    assert.equal(currentValue.toString(), expectedValue)
  })

  it("Should update when we call store", async function () {
    const expectedValue = "7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
})
