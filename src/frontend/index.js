import React from 'react'
import ReactDOM from 'react-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { providers } from 'ethers'
const { Web3Provider } = providers

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
