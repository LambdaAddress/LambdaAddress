import { MainContextProvider } from './MainContext'
import { useEffect } from 'react'
import ReactGA from "react-ga"
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'

import AddressList from './pages/AddressList'
import Home from './pages/Home'
import LambdaAddressSvg from './pages/LambdaAddressSvg'
import Mint from './pages/Mint'

ReactGA.initialize("G-EPF5R5CCES")

export default function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <MainContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/addresses" element={<AddressList />} />
          <Route path="/svg" element={<LambdaAddressSvg />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </MainContextProvider>
  )
}
