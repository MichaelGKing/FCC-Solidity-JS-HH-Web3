// All our components and pages run through this app, considered entry point for our entire application.
import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

function MyApp({ Component, pageProps }) {
  return (
    // having moralisprovider wrapped around our notificationprovider and component means we don't have to pass parameters around our components
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp
