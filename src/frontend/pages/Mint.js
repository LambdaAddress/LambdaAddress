import styled from '@emotion/styled'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useCallback, useContext, useMemo, useState } from 'react'
import CountUp from 'react-countup'

import config from '../config'
import { injected } from '../connectors'
import breakpoints from '../breakpoints'
import AdvancedOptions from '../components/AdvancedOptions'
import AddressCard from '../components/AddressCard'
import DifficultySelector from '../components/DifficultySelector'
import DifficultyTag from '../components/DifficultyTag'
import Header from '../components/Header'
import HighlightedAddress from '../components/HighlightedAddress'
import MKBox from '../components/MKBox'
import MKButton from '../components/MKButton'
import MKTypography from '../components/MKTypography'
import Spinner, { SpinnerStatus } from '../components/Spinner'
import useAddressGenerator from '../hooks/useAddressGenerator'
import useEagerConnect from '../hooks/useEagerConnect'
import { MainContext } from '../MainContext'


const SEARCH_STATUS = {
  PRE_SEARCH: 'PRE_SEARCH',
  SEARCHING: 'SEARCHING',
  POST_SEARCH: 'POST_SEARCH',
  ADDRESS_FOUND: 'ADDRESS_FOUND',
  ADDRESS_MINTED: 'ADDRESS_CREATED',
  TRANSACTION_PENDING: 'TRANSACTION_PENDING',
  ERROR: 'ERROR',
}

const ERROR = {
  USER_CANCEL: 'USER_CANCEL',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  UNKNOWN: 'UNKNOWN',
}

function searchStatus({
  isStarted,
  generatedAddress,
  isCreated,
  sendingTransaction,
  error,
  tryAgain,
}) {
  if (error) return SEARCH_STATUS.ERROR
  else if (sendingTransaction) return SEARCH_STATUS.TRANSACTION_PENDING
  else if (tryAgain || (!isStarted && !generatedAddress)) return SEARCH_STATUS.PRE_SEARCH
  else if (isStarted) return SEARCH_STATUS.SEARCHING
  else if (generatedAddress && !isStarted && !isCreated) return SEARCH_STATUS.ADDRESS_FOUND
  else if (generatedAddress && isCreated) return SEARCH_STATUS.ADDRESS_MINTED
}

export default function Mint() {
  const { activate, active } = useWeb3React()

  useEagerConnect(injected)

  // Is the searching process started?
  const [isStarted, setIsStarted] = useState(false)
  // Difficlty of the address we're looking for (number of consecutive characters)
  const [difficulty, setDifficulty] = useState(8)
  // Is the address created?
  const [isCreated, setIsCreated] = useState(false)
  // Address of the owner for the NftAddress and network info
  const { owner, network, contracts } = useContext(MainContext)
  // Contract addresses
  const { NFTAddressFactory, Registrar } = network?.contracts || {}
  // Is a transaction pending?
  const [sendingTransaction, setSendingTransaction] = useState(false)
  // Only search for addresses starting with pattern
  const [matchStartOfAddress, setMatchStartOfAddress] = useState(false) 
  // Advanced options visibility
  const [isAdvancedOptionsVisible, setIsAdvancedOptionsVisible] = useState(false)
  // Display warning message or not
  const [isWarningVisible, setIsWarningVisible] = useState(true) 

  const [tryAgain, setTryAgain] = useState(false)
  // Current error
  const [error, setError] = useState()

  const { generatedAddress, iterations, salt } = useAddressGenerator(
    NFTAddressFactory,
    owner,
    difficulty,
    isStarted,
    matchStartOfAddress
  )

  const status = useMemo(
    () =>
      searchStatus({
        isStarted,
        isCreated,
        generatedAddress,
        error,
        sendingTransaction,
        tryAgain,
      }),
    [isStarted, isCreated, generatedAddress, error, sendingTransaction, tryAgain]
  )

  const connect = useCallback(async () => {
    await activate(injected)
  }, [activate])

  const onCreateClick = useCallback(
    async (owner, salt) => {
      if (!active) await connect()

      try {
        setSendingTransaction(true)
        const tx = await contracts.registrar.mint(NFTAddressFactory, salt, {
          value: config.mintPrice,
          from: owner,
        })
        await tx.wait()
        setSendingTransaction(false)
        setIsCreated(true)
      } catch (err) {
        setSendingTransaction(false)
        if (err?.code === 4001) setError(ERROR.USER_CANCEL)
        else setError(ERROR.TRANSACTION_FAILED)
      }
    },
    [active, connect, contracts, NFTAddressFactory]
  )

  const startSearch = () => {
    setIsStarted(true)
    setTimeout(() => setTryAgain(false), 1)
  }

  const reset = () => {
    setIsStarted(false)
    setIsCreated(false)
    setSendingTransaction(false)
    setError(undefined)
    setTryAgain(true)
  }

  // Reset `isStarted` when address is found
  if (!tryAgain && isStarted && generatedAddress) setIsStarted(false)

  return (
    <MainPage>
      <Header />
      
      <AlertBox
        style={{ display: isWarningVisible ? 'flex' : 'none' }} 
        onClose={() => setIsWarningVisible(false)}>
          This app is in beta and has not been audited yet.
      </AlertBox>
      <MainBox>
        <TitleContainer>
          <MKTypography variant="body1" color="white">
            Address difficulty
          </MKTypography>
          <DifficultyTag difficulty={difficulty} matchStartOfAddress={matchStartOfAddress} />
        </TitleContainer>

        {status === SEARCH_STATUS.PRE_SEARCH && (
          <DifficultySelectorContainer>
            <DifficultySelector 
              value={difficulty} 
              onValueChange={setDifficulty} 
              matchStartOfAddress={matchStartOfAddress}
            />
            <Label 
              checked={matchStartOfAddress}
              onChange={(e, v) => setMatchStartOfAddress(v)}
              style={{ marginTop: '25px' }} 
              control={<Switch color='white'/>} 
              label="Match start of address only" 
            />
            <Label 
              checked={isAdvancedOptionsVisible}
              onChange={(e, v) => setIsAdvancedOptionsVisible(v)}            
              control={<Switch color='white'/>} 
              label="Advanced options" />
            <AdvancedOptions isOpen={isAdvancedOptionsVisible} style={{ marginTop: '25px' }} />
            <ButtonContainer style={{ marginTop: '35px' }}>
              {active ? (
                <MKButton onClick={startSearch}>Find address</MKButton>
              ) : (
                <MKButton onClick={connect}>Connect</MKButton>
              )}
            </ButtonContainer>
          </DifficultySelectorContainer>
        )}

        {[
          SEARCH_STATUS.SEARCHING, 
          SEARCH_STATUS.TRANSACTION_PENDING, 
          SEARCH_STATUS.ADDRESS_FOUND, 
          SEARCH_STATUS.ADDRESS_MINTED, 
          SEARCH_STATUS.ERROR].includes(status) && (
          <SpinnerContainer>
            <ProgressBox className={status === SEARCH_STATUS.SEARCHING && 'show'}>
              <MessageContainer>
                <div style={{ marginTop: 60 }}>
                  <Spinner
                    status={(() => {
                      switch (status) {
                        case SEARCH_STATUS.SEARCHING:
                          return SpinnerStatus.loading
                        case SEARCH_STATUS.TRANSACTION_PENDING:
                          return SpinnerStatus.loading
                        case SEARCH_STATUS.ADDRESS_FOUND:
                          return SpinnerStatus.success
                        case SEARCH_STATUS.ADDRESS_MINTED:
                          return SpinnerStatus.success
                        case SEARCH_STATUS.ERROR:
                          return SpinnerStatus.fail
                      }
                    })()}
                  />
                </div>
              </MessageContainer>

              <MessageContainer style={{ marginTop: 20 }}>
                <>
                  <p>Calculating...</p>
                  <p>
                    <CountUp
                      end={parseInt(iterations.toString())}
                      duration={1}
                      preserveValue={true}
                    />{' '}
                    iterations
                  </p>
                </>
              </MessageContainer>
            </ProgressBox>

            <AddressCardPreview
              minted={status === SEARCH_STATUS.ADDRESS_MINTED}
              className={[
                SEARCH_STATUS.ADDRESS_FOUND, 
                SEARCH_STATUS.TRANSACTION_PENDING,
                SEARCH_STATUS.ADDRESS_MINTED, 
                SEARCH_STATUS.ERROR].includes(status) && 'show'}
              address={{ address: generatedAddress }}
              highlightAddress
            />
          </SpinnerContainer>
        )}
        <MessageContainer style={{ marginTop: 20 }}>
          {status === SEARCH_STATUS.ADDRESS_FOUND && (
            <>
              <ButtonContainer>
                <MKButton onClick={() => onCreateClick(owner, salt)}>Mint address</MKButton>
                <ResetButton onClick={() => reset()}>Try again</ResetButton>
              </ButtonContainer>
            </>
          )}

          {[
            SEARCH_STATUS.TRANSACTION_PENDING,
            SEARCH_STATUS.ADDRESS_MINTED,
            SEARCH_STATUS.ERROR,
          ].includes(status) && (
            <>
              <MintingStatus>
                <Spinner
                  size={3}
                  style={{ flex: '0 0 60px' }}
                  status={(() => {
                    switch (status) {
                      case SEARCH_STATUS.TRANSACTION_PENDING:
                        return SpinnerStatus.loading
                      case SEARCH_STATUS.ADDRESS_MINTED:
                        return SpinnerStatus.success
                      case SEARCH_STATUS.ERROR:
                        return SpinnerStatus.fail
                    }
                  })()}
                />

                {status === SEARCH_STATUS.TRANSACTION_PENDING && (
                  <StatusText>Minting address...</StatusText>
                )}

                {status === SEARCH_STATUS.ADDRESS_MINTED && (
                  <StatusText>Address successfully minted. </StatusText>
                )}        

                {status === SEARCH_STATUS.ERROR && (
                  <StatusText>Error: Unable to generate address.</StatusText>
                )}       
              </MintingStatus>
              {status === SEARCH_STATUS.ERROR && (
                <ButtonContainer style={{ marginTop: 10 }}>
                  <MKButton
                    onClick={() => {
                      setError()
                      onCreateClick(owner, salt)
                    }}
                  >
                    Try again
                  </MKButton>
                </ButtonContainer>
                )}    
            </>
          )}

        </MessageContainer>
      </MainBox>
    </MainPage>
  )
}


const AlertBox = styled(Alert)({
  margin: 'auto',
  marginTop: 80,
  [`@media ${breakpoints.up.xs}`]: {
    width: 'calc(100% - 40px)',
    marginBottom: -58,
  },
  [`@media ${breakpoints.up.sm}`]: {
    width: 460,
    marginBottom: -48,
  },
})
AlertBox.defaultProps = { severity: 'warning' }

const MainPage = styled(MKBox)({
  backgroundImage: 'linear-gradient(135deg, #6f5eef, #20123c)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  position: 'relative',
  justifyContent: 'center',
  display: 'flow-root',
})

const TitleContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [`@media ${breakpoints.up.xs}`]: {
    marginBottom: 14
  },
  [`@media ${breakpoints.up.sm}`]: {
    marginBottom: 20
  },
})

const MainBox = styled(Stack)({
  [`@media ${breakpoints.up.xs}`]: {
    width: '90%',
    padding: '20px 20px',
    maxWidth: '400px'
  },
  [`@media ${breakpoints.up.sm}`]: {
    width: '400px',
    padding: '40px',
    maxWidth: 'initial'
  },
  [`@media ${breakpoints.up.md}`]: {
    width: '600px',
  },
  borderRadius: '20px',
  background: 'rgba(35,35,35,0.4)',
  boxShadow: '2px 1px 7px 0px rgb(0, 0, 0, 0.5)',
  margin: 'auto',
  marginTop: '80px',
  marginBottom: '80px',
  color: 'white',
})

const DifficultySelectorContainer = styled.div({
  marginTop: 30,
})

const ProgressBox = styled.div({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  transition: 'opacity 2.5s ease-out 0.8s',
  opacity: 0,

  '&.show': {
    opacity: 1,
  },
})

const Label = styled(FormControlLabel)({
  '> .MuiFormControlLabel-label': {
    color: 'white'
  }
})

const MintingStatus = styled.div({ 
  [`@media ${breakpoints.up.xs}`]: {
    marginTop: 0
  },  
  [`@media ${breakpoints.up.sm}`]: {
    marginTop: 20
  },
  height: 70, 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center' 
})

const StatusText = styled.span({
  marginLeft: '16px',
  fontSize: '16px'
})

const SpinnerContainer = styled.div({
  [`@media ${breakpoints.down.md}`]: {
    aspectRatio: '350 / 434',
    width: '100%',
    maxWidth: 350,
  },
  position: 'relative',
  [`@media ${breakpoints.up.md}`]: {
    aspectRatio: 'initial',
    width: '100%',
    height: 400
  },
})


const AddressCardPreview = styled(AddressCard)({
  position: 'absolute',
  transform: 'translateX(calc(-50% - 24px))',
  transition: 'opacity 3.5s ease-in 0.8s',
  opacity: 0,
  width: '100%',
  maxWidth: '350px !important',
  height: 'auto',
  [`@media ${breakpoints.up.xs}`]: {
    left: 'calc(50% + 32px)',
  },
  [`@media ${breakpoints.up.sm}`]: {
    left: 'calc(50% + 8px)',
  },

  '&.show': {
    opacity: 1,
  },
})

const AddressText = styled(HighlightedAddress)({
  [`@media ${breakpoints.up.xs}`]: {
    marginTop: 0
  }, 
  [`@media ${breakpoints.up.sm}`]: {
    marginTop: 30
  }, 
  [`@media ${breakpoints.up.md}`]: {
    marginTop: 50
  }, 
})

const ButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  [`@media ${breakpoints.up.xs}`]: {
    marginTop: 14
  }, 
  [`@media ${breakpoints.up.sm}`]: {
    marginTop: 40
  }, 
})

const ResetButton = styled(MKButton)({
  marginLeft: 10,
  backgroundColor: '#aaa',

  ':hover': {
    backgroundColor: '#bbb',
  },
})

const MessageContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center',
})

const Link = styled.a({
  color: 'white',
  textDecoration: 'underline !important',
  '&.alink': {
    textDecoration: 'underline !important',
  },
})

// Debugging info
console.debug('NODE_ENV: ', process.env.NODE_ENV)
console.debug('BUILD_ENV', process.env.REACT_APP_BUILD_ENV)
//console.debug('Registrar address: ', Registrar)
