import styled from '@emotion/styled'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors'
import MKButton from './MKButton'
import { useState } from 'react'
import Jazzicon from 'react-jazzicon'

export default function AccountButton({ address }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { active, activate, deactivate } = useWeb3React()

  const handleAccountClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleConnectClick = () => {
    activate(injected)
  }

  const handleDisconnect = () => {
    deactivate()
    setAnchorEl(null)
  }

  const handleCLose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      {active 
        ? (
          <ButtonStyle title={address} onClick={handleAccountClick}>
            <Jazzicon diameter={20} seed={getSeedForAddress(address)} paperStyles={{ marginRight: 8 }} />
            <Address>{formatAddress(address)}</Address>
          </ButtonStyle>
        )
        : <ConnectButton onClick={handleConnectClick}>Connect</ConnectButton>
      }
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCLose}
        placement="bottom-start"
      >
        <Item  
          onClick={handleDisconnect}>
          Disconnect
        </Item>
      </Menu>
    </>
  )
}

// Metamask algorithm
function getSeedForAddress(address) {
  const addr = address.slice(2, 10)
  const seed = parseInt(addr, 16)
  return seed
}

function formatAddress(address) {
  return `${address.substring(0, 6)}..${address.slice(-4)}`
}

const ButtonStyle = styled(MKButton)({
  paddingLeft: 16,
  border: '1px solid rgba(30,30,30,0.2)',
  boxShadow: 'none',
  color: 'white',
  backgroundColor: 'rgba(255,255,255,0.1)',
  textTransform: 'none',

  ':hover, :active': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    boxShadow: 'none',
  },
})

const ConnectButton = styled(MKButton)({
  border: '1px solid rgba(30,30,30,0.2)',
  boxShadow: 'none',
  color: 'white',
  backgroundColor: 'rgba(255,255,255,0.1)',

  ':hover, :active': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    boxShadow: 'none',
  },
})

const Item = styled(MenuItem)({
  color: '#000000',
  padding: `4.8px 12px`,
})

const Address = styled.div({
  display: 'inline-block',
  paddingTop: 3,
  marginLeft: 4
})

