import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import { MainContextProvider } from './MainContext'

import Home from './pages/Home'
import Mint from './pages/Mint'
import AddressList from './pages/AddressList'

export default function App() {
  return (
    <MainContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/addresses" element={<AddressList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </MainContextProvider>
  )
}
