import { useState, useRef } from 'react'
import { Menu, MenuItem } from '@mui/material'
import styled from '@emotion/styled'

import breakpoints from '../../breakpoints'
import MenuIcon from '../../images/menu-icon.svg'
import AddressCardSvg from '../AddressCardSvg'

export default function AddressCard({ address, menu, ...attr }) {
  const menuButton = useRef(null)
  const [open, setOpen] = useState(false)
  const handleMenuClick = () => {
    setOpen(true)
  }
  const handleMenuClose = () => {
    setOpen(false)
  }

  return (
    <NftAddress {...attr}>
      <AddressSvg
        address={address}
        highlightAddress
      />
      <MenuIconStyled src={MenuIcon} onClick={handleMenuClick} ref={menuButton} />
      {menu && (
        <Menu
          id="basic-menu"
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
    //width: 345,
    //height: 450,
    width: '100%',
    maxWidth: 400,
    height: 'auto'
  },
  [`@media ${breakpoints.up.sm}`]: {
    margin: '12px 18px',
    //width: 400,
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

const MenuIconStyled = styled.img({
  position: 'absolute',
  width: 80,
  cursor: 'pointer',
  opacity: 0.9,
  transition: 'opacity 0.3s ease-out',

  [`@media ${breakpoints.up.xs}`]: {
    top: '6%',
    right: 4,
  },
  [`@media ${breakpoints.up.sm}`]: {
    top: 40,
    right: 2
  },

  ':hover': {
    opacity: 1,
  },
})
