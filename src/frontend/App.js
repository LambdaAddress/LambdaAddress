import { MainContextProvider } from './MainContext'
import { lazy, useEffect, Suspense } from 'react'
import ReactGA from "react-ga"
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Mint = lazy(() => import('./pages/Mint'))
const AddressList = lazy(() => import('./pages/AddressList'))
const LambdaAddressSvg = lazy(() => import('./pages/LambdaAddressSvg'))

ReactGA.initialize("G-EPF5R5CCES")

export default function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <MainContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RouteLoading page={<Home />} />} />
          <Route path="/mint" element={<RouteLoading page={<Mint />} />} />
          <Route path="/addresses" element={<RouteLoading page={<AddressList />} />} />
          <Route path="/svg" element={<RouteLoading page={<LambdaAddressSvg />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </MainContextProvider>
  )
}

function RouteLoading({ page }) {
  return <Suspense fallback={<div>Loading...</div>}>{page}</Suspense>
}