import { useState, useMemo, useRef } from 'react'
import { Menu, MenuItem } from '@mui/material'
import styled from '@emotion/styled'

import breakpoints from '../../breakpoints'
import MenuIcon from '../../images/menu-icon.svg'
import AddressCardSvg from '../AddressCardSvg'
import DeployerType from '../deployers/DeployerType'
import Spinner, { SpinnerStatus } from '../Spinner'

export default function AddressCard({ address, onMenuItemClick, ...attr }) {
  const menuButton = useRef(null)
  const [open, setOpen] = useState(false)
  const handleMenuClick = () => {
    setOpen(true)
  }
  const handleMenuClose = () => {
    setOpen(false)
  }

  const menu = useMemo(() => {
    const deployMenu = [
      {
        text: 'Deploy custom bytecode',
        onClick: () => {
          onMenuItemClick(address, DeployerType.CUSTOM_BYTECODE)
        },
      }
    ]

    if (process.env.REACT_APP_BUILD_ENV !== 'production') {
      deployMenu.push({
        text: 'Deploy an Ambire Wallet',
        onClick: () => {
          onMenuItemClick(address, DeployerType.AMBIRE)
        },
      },
      {
        text: 'Deploy Gnosis Safe',
        onClick: () => {
          onMenuItemClick(address, DeployerType.GNOSIS_SAFE)
        },
      })
    }

    return address.isDeployed
      ? undefined
      : deployMenu
  }, [address])

  return (
    <NftAddress {...attr}>
      <AddressSvg
        address={address}
        highlightAddress
      />
      { address?.isDeployed && <DeployedCheckmark /> }
      {menu && <MenuIconStyled src={MenuIcon} onClick={handleMenuClick} ref={menuButton} /> }
      {menu && (
        <Menu
          anchorEl={menuButton.current}
          open={open}
          onClose={() => handleMenuClose()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'center', horizontal: 'center' }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {menu.map((menuItem) => (
            <MenuItem
              key={menuItem.text}
              onClick={() => {
                handleMenuClose()
                menuItem.onClick()
              }}
            >
              {menuItem.text}
            </MenuItem>
          ))}
        </Menu>
      )}
    </NftAddress>
  )
}

const NftAddress = styled.div({
  [`@media ${breakpoints.up.xs}`]: {
    margin: '16px 0',
    marginLeft: 0,
    width: '100%',
    maxWidth: 400,
    height: 'auto'
  },
  [`@media ${breakpoints.up.sm}`]: {
    margin: '12px 18px',
    marginLeft: 0,
    width: 'auto',
    height: 500,
  },
  aspectRatio: '350 / 434',
  position: 'relative',
  height: 500,
  borderRadius: 20,
  transform: 'scale(1)',
  transition: 'transform 0.25s ease-out',
  overflow: 'visible',

  ':hover': {
    transform: 'scale(1.05)',
    zIndex: 100,
  },
})

const AddressSvg = styled(AddressCardSvg)({
  position: 'absolute', left: -12, top: -12, 
  [`@media ${breakpoints.up.xs}`]: {
    width: '100%',
    maxWidth: 400,
    height: 'auto'
  },
  [`@media ${breakpoints.up.sm}`]: {
    margin: '12px 18px',
    width: 'auto',
    height: 500,
  },
})

const DeployedCheckmark = styled(Spinner)({
  position: 'absolute',
  bottom: 32,
  right: 24
})
DeployedCheckmark.defaultProps = {
  size: 2.5,
  status: SpinnerStatus.success,
  title: 'Deployed'
}

const MenuIconStyled = styled.img({
  position: 'absolute',
  width: 80,
  cursor: 'pointer',
  opacity: 0.9,
  transition: 'opacity 0.3s ease-out',

  [`@media ${breakpoints.up.xs}`]: {
    top: '7%',
    right: 16,
  },
  [`@media ${breakpoints.up.sm}`]: {
    top: 48,
    right: 2
  },

  ':hover': {
    opacity: 1,
  },
})
