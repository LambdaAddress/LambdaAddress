import styled from '@emotion/styled'
import Stack from '@mui/material/Stack'
import { useWeb3React } from '@web3-react/core'
import breakpoints from '../breakpoints'
import AddressCard from '../components/AddressCard'
import Spinner from '../components/Spinner'
import Header from '../components/Header'
import MKBox from '../components/MKBox'
import { injected } from '../connectors'
import { MainContext } from '../MainContext'
import DeployerType from '../components/deployers/DeployerType'
import DeployerModal from '../components/deployers/DeployerModal'
import useAddresses from '../hooks/useAddresses'
import useEagerConnect from '../hooks/useEagerConnect'
import { useState, useContext } from 'react'



export default function AddressList() {
  const { account } = useWeb3React()
  const { contracts, network } = useContext(MainContext)
  const { registrar } = contracts || {}
  
  useEagerConnect(injected)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState()
  const [selectedDeployer, setSelectedDeployer] = useState(DeployerType.NONE)
  
  const { addressList, isLoading } = useAddresses(account, registrar, network)
  
  const clearState = () => {
    setSelectedAddress(undefined)
    setSelectedDeployer(DeployerType.NONE)
  }

  const closeDeployModal = () => {
    clearState()
    setIsModalOpen(false)
  }

  const showDeployModal = async (address, deployerType) => {
    setImmediate(async () => {      
      setIsModalOpen(true)
      setSelectedDeployer(deployerType)
      setSelectedAddress(address)
      //const factoryAddress = await registrar.getFactory(address.address)
      //setSelectedAddress({ ...address, factoryAddress })
    })
  }


  return (
    <>
      <AddressListPage modal={isModalOpen ? 'true' : 'false'} onClick={closeDeployModal}>
        <Header />

        <MainBox>
          <TitleContainer>
            <Title>My Addresses {isLoading && <Loading />}</Title>
          </TitleContainer>         

          <AddressContainer>
            {addressList.map((addr) => (
              <AddressCard key={addr.address} address={addr} onMenuItemClick={showDeployModal} />
            ))}
          </AddressContainer>
        </MainBox>
      </AddressListPage>

      <DeployerModal 
        isOpen={isModalOpen} 
        address={selectedAddress?.address} 
        deployerType={selectedDeployer} 
        onClose={closeDeployModal}
      />
    </>
  )
}

const AddressListPage = styled(MKBox)`
  background-image: linear-gradient(135deg, #6f5eef, #20123c);
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  position: relative;
  justify-content: center;
  display: flow-root;
  transition: filter 0.3s ease-out;
  filter: ${({ modal }) => (modal === 'true' ? 'blur(10px)' : 'none')};
`

const TitleContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '40px',
  alignItems: 'center',
})

const MainBox = styled(Stack)({
  [`@media ${breakpoints.up.xs}`]: {
    width: '100%',
    padding: '10px',
  },
  [`@media ${breakpoints.up.sm}`]: {
    width: '400px',
  },
  [`@media ${breakpoints.up.md}`]: {
    width: '90%',
  },
  margin: 'auto',
  marginTop: '80px',
  color: 'white',
  textAlign: 'center',
})

const Title = styled.h1({
  fontWeight: '400',
  fontSize: 32,
  margin: 'auto',
})

const Loading = styled(Spinner)({
  marginLeft: 8,
  marginTop: 10
})
Loading.defaultProps = { 
  size: 1 
}

const AddressContainer = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
})


const EditBytecodeModal = styled(Stack)(({ open }) => ({
  [`@media ${breakpoints.up.xs}`]: {
    width: '90%',
  },
  [`@media ${breakpoints.up.sm}`]: {
    width: '400px',
  },
  [`@media ${breakpoints.up.md}`]: {
    width: '600px',
  },
  borderRadius: '20px',
  background: 'rgba(39,25,76,0.85)',
  boxShadow: '2px 1px 7px 0px rgb(0, 0, 0, 0.5)',
  margin: 'auto',
  color: 'white',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'block',
  minHeight: 350,
  zIndex: open ? 100 : -1,
  opacity: open ? 1 : 0,
  transition: 'opacity 0.3s ease-out',
  padding: 20,
}))


