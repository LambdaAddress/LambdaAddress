import deployerConfig from './config'
import CancelButton from '../../CancelButton'
import { downloadJson, getMetadata, getExportData, sendWalletCreationRequest } from './utils'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import { getProxyDeployBytecode } from './IdentityProxyDeploy'
import MKButton from '../../MKButton'
import Spinner, { SpinnerStatus } from '../../Spinner'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import TransactionButton from '../../TransactionButton'
import { useEffect, useMemo, useState } from 'react'
import useTransactionSender from '../../../hooks/useTransactionSender'
import { useWeb3React } from '@web3-react/core'


export default function AmbireDeployer({ nftAddress, contracts, deployer, registrar, network, onClose, ...props }) {
  const { account } = useWeb3React()
  const [owners, setOwners] = useState([account])

  // Address of the currently approved deployer, if any
  const [approvedDeployer, setApprovedDeployer] = useState('')
  const isDeployerApproved = approvedDeployer.toLowerCase() === deployer?.address?.toLowerCase()
  
  // Deployment process consists of 2 steps:
  // 1. Execute transaction to approve the Ambire deployer
  const [approveDeployerTx, setApproveDeployerTx] = useTransactionSender() 
  // 2. Send creation request to the Ambire relayer proxy
  const [relayerResponse, setRelayerResponse] = useState()

  // Deployment transaction
  const [deployTx, setDeployTx] = useTransactionSender()

  // Status of the deployment transaction
  const deployTxStatus = useMemo(() => {
    switch(deployTx?.status) {
      case 'PENDING_USER': return SpinnerStatus.loading
      case 'PENDING': return SpinnerStatus.loading
      case 'SUCCESS': return SpinnerStatus.success
      case 'ERROR': return SpinnerStatus.fail
      default: return undefined
    }
  }, [deployTx, deployTx?.status])

  // Status for the 2 steps of the deployment:
  // 1. Executing the deploy transaction on-chain
  // 2. Posting the creation request on the Ambire Relayer proxy
  const deployStatus = useMemo(() => {
    // Deployment not initiated
    if (!deployTxStatus)
      return undefined

    if (deployTxStatus === SpinnerStatus.loading || !relayerResponse) {
      return SpinnerStatus.loading
    }

    if (deployTxStatus === SpinnerStatus.fail || (relayerResponse && !relayerResponse.success)) {
      return SpinnerStatus.fail
    }

    if (deployTxStatus === SpinnerStatus.success && relayerResponse?.success === true) {
      return SpinnerStatus.success
    }

    return undefined
  }, [relayerResponse, deployTxStatus])

  const config = useMemo(() => deployerConfig[network.chainId.toString()], [network])

  const onAddOwnerClick = () => {
    setOwners([...owners, ''])
  }

  const onApproveClick = async () => {
    setApproveDeployerTx(registrar.approveDeployer(deployer.address, nftAddress))
  }

  const onDeleteOwnerClick = (ownerIndex) => {
    const newOwners = [...owners]
    newOwners.splice(ownerIndex, 1)
    setOwners(newOwners)
  }

  const onDeployClick = async () => {
    try {
      const privLevels = owners.map(owner => [owner, '0x0000000000000000000000000000000000000000000000000000000000000001'])
      const implementation = config['AmbireAccountImplementation']
      const calldata = getProxyDeployBytecode(implementation, privLevels)
      setDeployTx(deployer.deploy(calldata, nftAddress))

      const response = await sendWalletCreationRequest(
        nftAddress, 
        config.relayerUrl, 
        getMetadata(nftAddress, deployer.address, config.AmbireAccountImplementation, owners[0])
      )

      console.log('Relayer response: ', response)

      if (response.success !== true)
        console.error('Error creating wallet on the relayer: ', response)

      setRelayerResponse(response)
    } catch(error) {
      console.log('Error while deploying: ', error)
      setRelayerResponse({})
    }
  }

  const downloadWallet = () => {
    const implementation = config['AmbireAccountImplementation']
    const json = getExportData(nftAddress, deployer.address, implementation, owners[0])
    downloadJson(json, `ambire-wallet-${nftAddress}.json`)
  }

  const onOwnerValueChange = (event) => {
    const newOwners = [...owners]
    newOwners[0] = event.target.value
    setOwners(newOwners)
  }

  useEffect(async () => {
    if (registrar && nftAddress) {
      setApprovedDeployer(await registrar.getApprovedDeployer(nftAddress))
    }
  }, [registrar, deployer, approveDeployerTx])


  return (
    <Main {...props}>
      {nftAddress}
      {deployStatus
        ? <Loading status={deployStatus} />
        : <>
            <div style={{ marginTop: 10}}>
              <AddressInput  label={`Owner`} value={owners[0]} onChange={e => onOwnerValueChange(0, e)} />
            </div>
          </>
      }
      <ButtonsContainer>
        {deployTxStatus !== SpinnerStatus.success &&
          <>
          {isDeployerApproved
            ? <MKButton onClick={onDeployClick}>Deploy</MKButton>
            : <TransactionButton transaction={approveDeployerTx} onClick={onApproveClick}>Approve deployer</TransactionButton>
          } 
          </> 
        }
        {deployStatus === SpinnerStatus.success
          ? <MKButton onClick={onClose}>Close</MKButton>
          : <CancelButton onClick={onClose}>Cancel</CancelButton>
        }      
      </ButtonsContainer>
    </Main>
  )
}

const Main = styled.div({
  marginBottom: 68
})

const Loading = styled(Spinner)({
  display: 'block',
  margin: 'auto',
  marginTop: 40
})

const Input = styled(TextField)({
  '& input': {
    borderRadius: '8px',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  '& label': {
    color: 'white',
  }
})

const AddressInput = styled(Input)({
  width: 'calc(100% - 40px)',
  maxWidth: 400
})

const OwnerLine = styled.div({
  marginTop: 10,
  marginBottom: 16,
  height: 42
})

const DeleteIcon = styled(DeleteForeverRoundedIcon)({
  cursor: 'pointer',
  marginTop: 4,
  display: 'inline-block'
})

const ButtonsContainer = styled.div({
  marginTop: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'absolute',
  bottom: 24,
  left: 0,
  right: 0,

  '& button': {
    margin: '0 4px',
    minWidth: 160
  }
})