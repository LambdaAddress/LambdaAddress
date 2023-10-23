import { MainContextProvider } from './MainContext'
import { lazy, useEffect, Suspense } from 'react'
import ReactGA from "react-ga4"
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import Spinner from './components/Spinner'
import styled from '@emotion/styled'

const Home = lazy(() => import('./pages/Home'))
const Mint = lazy(() => import('./pages/Mint'))
const AddressList = lazy(() => import('./pages/AddressList'))
const LambdaAddressSvg = lazy(() => import('./pages/LambdaAddressSvg'))

ReactGA.initialize("G-EPF5R5CCES")

export default function App() {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search })
  }, [])

  return (
    <Main>
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
    </Main>
  )
}

function RouteLoading({ page }) {
  return <Suspense fallback={<LoadingIcon size={2} />}>{page}</Suspense>
}

const Main = styled.div({
  background: 'linear-gradient(135deg, rgb(111, 94, 239), rgb(32, 18, 60)) center center / cover transparent',
  minHeight: '100vh'
})

const LoadingIcon = styled(Spinner)({
  display: 'block',
  position: 'absolute',
  left: 'calc(50% - 20px)',
  top: 'calc(50% - 40px)'
})