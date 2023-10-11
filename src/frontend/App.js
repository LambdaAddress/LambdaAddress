import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import { MainContextProvider } from './MainContext'

import AddressList from './pages/AddressList'
import Home from './pages/Home'
import LambdaAddressSvg from './pages/LambdaAddressSvg'
import Mint from './pages/Mint'

export default function App() {
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
