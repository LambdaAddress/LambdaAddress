import styled from '@emotion/styled'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'

import breakpoints from '../breakpoints'
import AccountButton from './AccountButton'
import MKBox from './MKBox'
import MKTypography from './MKTypography'
import logo from '../images/logo.svg'
import NetworkMenu from './NetworkMenu'
import MobileMenu from './MobileMenu'

export default function Header() {
  const { account, active } = useWeb3React()
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumOrLargeScreen = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <MKBox component="nav" position="absolute" top="0.5rem" width="100%">
      <Container>
        <Grid container flexDirection="row" alignItems="center">
          <MKTypography
            component={Link}
            href="#/"
            variant="button"
            color="white"
            fontWeight="regular"
            py={0.8125}
            mr={2}
          >
            <Logo src={logo} />
          </MKTypography>

          <MKBox component="ul" display="flex" p={0} my={0} mx="auto" sx={{ listStyle: 'none' }}>
            <div></div>
          </MKBox>
          <MKBox component="ul" display="flex" p={0} m={0} sx={{ listStyle: 'none' }}>
            { isMediumOrLargeScreen && 
            <>
              <MenuLink href="#/mint" className={location?.pathname === '/mint' && 'active'}>Mint</MenuLink>
              <MenuLink href="#/addresses" className={location?.pathname === '/addresses' && 'active'}>My Addresses</MenuLink>
            </>}
            {active && <NetworkMenu isSmall={isXSmallScreen} style={{paddingRight: 4}} />}
            <AccountButton address={account} />
            {isSmallScreen &&
              <IconButton size="medium" color="white" onClick={() => setIsMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            }
          </MKBox>
        </Grid>
      </Container>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </MKBox>
  )
}

const Logo = styled.img({
  width: 42,
  height: 'auto',
})

const MenuLink = styled.a({
  color: 'white',
  opacity: 0.85,
  lineHeight: '36px',
  paddingTop: 3,
  transition: 'opacity 0.25s ease-out',

  [`@media ${breakpoints.up.xs}`]: {
    marginRight: 10,
    fontSize: '17px',
  },
  [`@media ${breakpoints.up.sm}`]: {
    marginRight: 30,
    fontSize: '18px',
  },

  ':hover, :active, &.active': {
    opacity: 1,
  },
})
