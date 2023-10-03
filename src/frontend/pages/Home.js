import styled from '@emotion/styled'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRef } from 'react'

import breakpoints from '../breakpoints.js'
import AddressShuffle from '../components/AddressShuffle'
import MKBox from '../components/MKBox'
import MKButton from '../components/MKButton'
import MKTypography from '../components/MKTypography'
import config from '../config'
import logo from '../images/logo.svg'
import mobileImg from '../images/phone-tilted.png'
import underTheHoodImg from '../images/under-the-hood.svg'
import royaltiesImg from '../images/royalties.svg'

export default function Home() {
  const pageRef = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ]

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleScrollClick = page => {
    window.scrollTo({
      top: pageRef[page].current.offsetTop,
      behavior: "smooth",
    })
  }

  return (
    <Main>
      <Header>
        <Container>
          <HeaderWrap>
            <LogoContainer href="#/">
              <Logo src={logo} />
            </LogoContainer>
            <HeaderLinks>
              <MKBox component="li">
                <HeaderLink href="https://twitter.com/LambdaAddress" target="_blank">
                  <HeaderLinkIcon className="fab fa-twitter" />
                </HeaderLink>
              </MKBox>
              <MKBox component="li">
                <HeaderLink href="https://github.com/LambdaAddress" target="_blank">
                  <HeaderLinkIcon className="fab fa-github" />
                </HeaderLink>
              </MKBox>
              <MKBox component="li">
                <HeaderLink href="https://discord.gg/KGywyWNqtp" target="_blank">
                  <HeaderLinkIcon className="fab fa-discord" />
                </HeaderLink>
              </MKBox>
            </HeaderLinks>
          </HeaderWrap>
        </Container>
      </Header>

      <Page ref={pageRef[0]}>
        <PageWrap>
          <LeftSection>
            <SectionH1>Lambda Address</SectionH1>
            <SectionH4>Collectible Ethereum addresses.</SectionH4>
            <ButtonsContainer>
              <WhiteButton href="#/mint">Get Started</WhiteButton>
              <TextButton onClick={() => handleScrollClick(1)}>Read more</TextButton>
            </ButtonsContainer>
          </LeftSection>
          <MobileContainer>
            <MobileImg src={mobileImg} />
          </MobileContainer>
        </PageWrap>
      </Page>
      <Page ref={pageRef[1]}>
        <PageWrap>
          <LeftSection>
            <SectionH2>An Ethereum address as an NFT</SectionH2>
            <p>Addresses are the identifiers of Ethereum. Each wallet and smart contract has its own.</p>
            <p>While every address is unique, some are more valuable than others. Like an address containing 10 consecutive "a".</p>
            <p>A Lambda Address is an NFT representing a <strong>reservation for an Ethereum address.</strong> Deploy any dapp on it, create a smart contract wallet or sell it and earn royalties on each subsequent sale.</p>
            {isSmallScreen &&
              <AddressShuffle style={{ margin: '10px 0 28px 0' }} />
            }
            <ButtonsContainer>
              <WhiteButton href="#/mint">Get Started</WhiteButton>
              <TextButton onClick={() => handleScrollClick(2)}>Keep reading</TextButton>
            </ButtonsContainer>

          </LeftSection>
          <RightSection>
            {!isSmallScreen &&
              <AddressShuffle style={{ marginTop: '-40px'}} />
            }
          </RightSection>
        </PageWrap>
      </Page>
      <Page ref={pageRef[2]}>
        <PageWrap>
          <LeftSection>
            <SectionH2>Under the hood</SectionH2>
            <p>Alpha Address uses Solmate's <a href="https://github.com/transmissions11/solmate/blob/main/src/utils/CREATE3.sol">CREATE3</a> under the hood. Therefore letting you deploy any smart contract at your address seemlessly.</p>
            <p>Since EOA accounts require a private key, they are not supported.</p>
            <p><a href={config.docUrl} target="_blank">Learn more</a></p>
            <ButtonsContainer>
              <WhiteButton href="#/mint">Get Started</WhiteButton>
              <TextButton onClick={() => handleScrollClick(3)}>Keep reading</TextButton>
            </ButtonsContainer>
          </LeftSection>
          <RightSection>
            <UnderTheHoodImg />
          </RightSection>
        </PageWrap>
      </Page>
    </Main>
  )
}

const Main = styled(MKBox)({
  backgroundImage: 'linear-gradient(135deg, #6f5eef, #20123c)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flow-root',
  position: 'relative',
  color: 'white',

  '& p': {
    margin: '10px 0',
    textAlign: 'justify',

    [`@media ${breakpoints.down.sm}`]: {
      fontSize: '18px'
    }
  }
})
Main.defaultProps = { component: 'header' }

const Header = styled(MKBox)({})
Header.defaultProps = {
  component: 'nav',
  position: 'absolute',
  top: '0.5rem',
  width: '100%',
}

const HeaderWrap = styled(Grid)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
HeaderWrap.defaultProps = {
  container: true,
}

const LogoContainer = styled(MKTypography)({})
LogoContainer.defaultProps = {
  component: Link,
  variant: 'button',
  py: 0.8125,
  mr: 2,
}

const HeaderLinks = styled(MKBox)({
  listStyle: 'none',
})
HeaderLinks.defaultProps = {
  component: 'ul',
  display: 'flex',
  p: 0,
  m: 0,
}

const HeaderLink = styled(MKTypography)({})
HeaderLink.defaultProps = {
  component: Link,
  variant: 'button',
  p: 1
}

const HeaderLinkIcon = styled(MKBox)({})
HeaderLinkIcon.defaultProps = {
  component: 'i',
  color: 'white',
}

const Page = styled(Container)({
  marginTop: '80px',
  position: 'relative',
  boxSizing: 'border-box',

  '& p > a': {
    color: 'white',
    textDecoration: 'underline !important'
  }
})

const PageWrap = styled(Grid)({
  minHeight: 'calc(100vh - 80px)',
  flexDirection: 'row',
})
PageWrap.defaultProps = { container: true }

const LeftSection = styled(Grid)({
  flexDirection: 'column',
  justifyContent: 'center',
})
LeftSection.defaultProps = {
  container: true,
  item: true,
  xs: 12,
  md: 6,
  boxSizing: 'border-box',

  sx: ({ breakpoints }) => ({
    [breakpoints.down('md')]: {
      justifyContent: 'start',
      padding: '0 18px'
    },
    [breakpoints.up('md')]: {
      marginTop: '-40px',
    },
  }),
}

const RightSection = styled(Grid)({
  textAlign: 'right',
  alignItems: 'center',
  alignContent: 'center',
  overflowX: 'visible',
  justifyContent: 'center',
})
RightSection.defaultProps = {
  container: true,
  item: true,
  xs: 12,
  md: 6,
  sx: ({ breakpoints }) => ({
    [breakpoints.down('sm')]: {
      justifyContent: 'center',
      alignContent: 'start'
    }
  })
}

const SectionH1 = styled(MKTypography)({})
SectionH1.defaultProps = {
  variant: 'h1',
  color: 'white',
  mb: 3,
  sx: ({ breakpoints, typography: { size } }) => ({
    [breakpoints.down('md')]: {
      textAlign: 'center',
      fontSize: size['3xl'],
      margin: '20px 40px',
    },
    [breakpoints.down('lg')]: {
      fontSize: size['2xl'],
    },
  }),
}

const SectionH2 = styled(MKTypography)({
  fontSize: '2rem'
})
SectionH2.defaultProps = {
  variant: 'h1',
  color: 'white',
  mb: 3,
  sx: ({ breakpoints, typography: { size } }) => ({
    [breakpoints.down('sm')]: {

    },
    [breakpoints.down('md')]: {
      textAlign: 'center',
      fontSize: size['3xl'],
      margin: '20px 40px',
    },
    [breakpoints.down('lg')]: {
      fontSize: size['2xl'],
    },
  }),
}

const SectionH4 = styled(MKTypography)({})
SectionH4.defaultProps = {
  variant: 'div',
  color: 'white',
  opacity: 0.8,
  pr: 6,
  mr: 6,
  sx: ({ breakpoints }) => ({
    [breakpoints.down('sm')]: {
      margin: 0,
    },
    [breakpoints.down('md')]: {
      padding: 0,
      textAlign: 'center',
      margin: '0 40px',
    },
  }),
}

const ButtonsContainer = styled(Stack)({})
ButtonsContainer.defaultProps = {
  direction: 'row',
  spacing: 1,
  mt: 3,
  sx: ({ breakpoints }) => ({
    [breakpoints.down('sm')]: {

    },
    [breakpoints.down('md')]: {
      justifyContent: 'center',
      margin: '30px 40px 60px 40px',
    },
  }),
}

const WhiteButton = styled(MKButton)({})
WhiteButton.defaultProps = {
  color: 'white',
}

const TextButton = styled(MKButton)({})
TextButton.defaultProps = {
  variant: 'text',
  color: 'white',
}

const MobileContainer = styled(Grid)({
  textAlign: 'right',
  alignItems: 'center',
  alignContent: 'center',
  overflowX: 'visible',
  justifyContent: 'right',
})
MobileContainer.defaultProps = {
  container: true,
  item: true,
  xs: 12,
  md: 6,
  sx: ({ breakpoints }) => ({
    [breakpoints.down('md')]: {
      justifyContent: 'center',
      alignContent: 'start',
      marginTop: '-60px'
    }
  })
}

const MobileImg = styled.img`
  @media ${breakpoints.up.xs} {
    width: 100%;
    height: auto;
    margin-right: -20px;
  }

  @media ${breakpoints.up.sm} {
    margin-right: -44px;
  }

  @media ${breakpoints.up.xl} {
    height: calc(100vh - 80px);
    max-height: 762px;
    width: auto;
  }
  
`

const RoyaltiesImg = styled.img({
  width: '100%',
  maxWidth: 620
})



const UnderTheHoodImg = styled.img({
  width: '80%',

  [`@media ${breakpoints.down.sm}`]: {
    marginTop: '-60px'
  }
})
UnderTheHoodImg.defaultProps = {
  src: underTheHoodImg
}

const Logo = styled.img({
  width: 42,
  height: 'auto',
})
