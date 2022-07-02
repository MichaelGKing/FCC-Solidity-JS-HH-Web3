import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
// Hooks such as useEffect and useState allow our website to rerender when things change. Allows our components to communicate with each other about the state of the blockchain.
import { useEffect, useState } from "react"
import { ethers } from "ethers"
// useNotification hook
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
  // This returns the chainId in hex. User parseInt() to get actual number.
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

  // useState hook, entranceFee is the variable we call to get the entrance fee, setEntranceFee is the function we call to update or set the entranceFee
  // useState is similar to saying let variable = x, but it also comes with re-rendering ability and other stuff.
  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  // This dispatch is a little popup that useNotification will give us.
  const dispatch = useNotification()

  // This calls different contract functions using Moralis.
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify network id
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  // Moralis smart enough to know this is calling a view function.
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify network id
    functionName: "getEntranceFee",
    params: {},
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify network id
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, //specify network id
    functionName: "getRecentWinner",
    params: {},
  })

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString()
    const numPlayersFromCall = (await getNumberOfPlayers()).toString()
    const recentWinnerFromCall = await getRecentWinner()
    setEntranceFee(entranceFeeFromCall)
    setNumPlayers(numPlayersFromCall)
    setRecentWinner(recentWinnerFromCall)
  }

  //useEffect is a very popular hook, where if we do not have a dependency array, our function inside our useEffect will run every time something re-renders.
  useEffect(() => {
    if (isWeb3Enabled) {
      // try to read the raffle entrance fee.

      updateUI()
    }
    // This is the dependency array, if no dependency array our function above will run any time something re-renders. A blank
    // dependency array will run once on load. If there is something inside it it will run anytime one of the variables in that
    // dependency array change.
  }, [isWeb3Enabled])

  const handleSuccess = async function (tx) {
    // This waits for the actual transaction to be confirmed.
    await tx.wait(1)
    // Adds a pop up for notifications.
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = function () {
    // This launches one of the web3uikit notifications
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    })
  }

  return (
    <div className="p-5">
      Hi from lottery entrance!
      {raffleAddress ? (
        <div>
          {/* Button for entering Raffle */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                // onsuccess checks to see if a transaction is successfully sent to metamask
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
            //Prevents button from being pressed when loading or fetching from metamask
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH!</div>
          <div>Number Of Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  )
}
