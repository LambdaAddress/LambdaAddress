import { ethers } from 'ethers'
import { useState, createContext, useEffect } from 'react'
import RegistrarAbi from '../abi/Registrar'
import SafeDeployerAbi from '../abi/SafeDeployer'
import AmbireAccountDeployerAbi from '../abi/AmbireAccountDeployer'
import { useWeb3React } from '@web3-react/core'
import { getNetworkInfo, isChainIdSupported } from '../config/index'

export const MainContext = createContext()
export const MainContextProvider = ({ children }) => {
  const [owner, setOwner] = useState('')
  const [network, setNetwork] = useState()
  const [contracts, setContracts] = useState()
  const [isNetworkSupported, setIsNetworkSupported] = useState(true)
  const { account, chainId, library } = useWeb3React()

  useEffect(() => {
    setOwner(account || '')

    if (chainId !== undefined) {
      if (isChainIdSupported(chainId)) {
        const networkInfo = getNetworkInfo(chainId)
        setContracts({
          registrar: new ethers.Contract(networkInfo.contracts.Registrar, RegistrarAbi.abi, library.getSigner()),
          factories: [],
          safeDeployer: new ethers.Contract(networkInfo.contracts.SafeDeployer, SafeDeployerAbi.abi, library.getSigner()),
          ambireAccountDeployer: new ethers.Contract(networkInfo.contracts.AmbireAccountDeployer, AmbireAccountDeployerAbi.abi, library.getSigner()),
        })
        setNetwork(networkInfo) 
      }
      setIsNetworkSupported(isChainIdSupported(chainId))             
    }
  }, [account, chainId, library])

  return <MainContext.Provider value={{ owner, setOwner, network, isNetworkSupported, contracts }}>{children}</MainContext.Provider>
}
