import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useWeb3React } from '@web3-react/core'
import { getSupportedNetworks, getUnsupportedNetwork } from '../../config/index'
import { useMemo, useState } from 'react'

export default function NetworkMenu({ isSmall = false, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { active, chainId, library } = useWeb3React()
  const supportedNetworks = useMemo(() => getSupportedNetworks(), [])
  const unsupportedNetwork = getUnsupportedNetwork()
  const currentNetwork = useMemo(() => {
    return supportedNetworks.find(network => network.chainId === chainId) || unsupportedNetwork
  }, [chainId, supportedNetworks, unsupportedNetwork])


  const switchNetwork = async (chainId) => {
    const network = supportedNetworks.find(network => network.chainId === chainId)

    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      })
    } catch (switchError) {
      // 4902 error code indicates the chain is missing on the wallet
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${network.chainId.toString(16)}`,
                rpcUrls: network.rpcUrls,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: network.blockExplorerUrls
              }
            ]
          })
        } catch (error) {
           console.error(error)
        }
      }
      else if (switchError.code === 4001) {
        // User rejected network change. Nothing to do.
      }
      else {
        console.error('Switch network error: ', switchError)
      }
    }
  }

  const handleButtonClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleSelect = chainId => {
    if (chainId === undefined || chainId === currentNetwork.chainId)
      return

    switchNetwork(chainId)
    setAnchorEl(null)
  }

  const handleCLose = () => {
    setAnchorEl(null)
  }

  return (
    <Main {...props}>
      { active && 
      <>        
        <MenuButton onClick={handleButtonClick} small={isSmall ? 1 : 0}>
          <Icon src={`images/networks/${currentNetwork.chainId}.svg`} /> 
          {!isSmall && <CurrentNetwork>{currentNetwork.name}</CurrentNetwork>}
        </MenuButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCLose}
          placement="bottom-start"
        >
          { supportedNetworks.filter(network => network.chainId !== chainId).map(network => 
            <Item 
              key={network.chainId} 
              onClick={() => handleSelect(network.chainId)}>
              <Icon src={`images/networks/${network.chainId}.svg?j=1`} />
              {network.name}
            </Item>
          )}
        </Menu>
      </>}
    </Main>
  )
}

const Main = styled.div({

})

const MenuButton = styled(Button)(({ small }) => ({
  border: '1px solid rgba(30,30,30,0.2)',
  boxShadow: 'none',
  color: 'white !important',
  backgroundColor: 'rgba(255,255,255,0.1)',
  textTransform: 'none',
  minWidth: 4,
  
  padding: small 
    ? '10px 4px 10px 12px'
    : '10px 16px 10px 12px',

  ':hover, :active, :focus': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    boxShadow: 'none',
    color: 'white'
  },
}))

const CurrentNetwork = styled.div({
  display: 'inline-block',
  paddingTop: 3
})

const Item = styled(MenuItem)({
  color: '#000000',
  padding: `4.8px 12px`,
})

const Icon = styled.img({
  width: 22,
  marginRight: 10
})