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
  const [approvedDeployer, setApprovedDeployer] = useState('')
  const isDeployerApproved = approvedDeployer.toLowerCase() === deployer?.address?.toLowerCase()
  const [approveDeployerTx, setApproveDeployerTx] = useTransactionSender() 
  const [deployTx, setDeployTx] = useTransactionSender()
  const deployTxStatus = useMemo(() => {
    switch(deployTx?.status) {
      case 'PENDING_USER': return SpinnerStatus.loading
      case 'PENDING': return SpinnerStatus.loading
      case 'SUCCESS': return SpinnerStatus.success
      case 'ERROR': return SpinnerStatus.fail
    }
  }, [deployTx, deployTx?.status])

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

  const onDeployClick = () => {
    const privLevels = owners.map(owner => [owner, '0x0000000000000000000000000000000000000000000000000000000000000001'])
    const implementation = config['AmbireAccountImplementation']
    const calldata = getProxyDeployBytecode(implementation, privLevels)
    //setDeployTx(deployer.deploy(calldata, nftAddress))
    sendWalletCreationRequest(
      nftAddress, 
      config.relayerUrl, 
      getMetadata(nftAddress, deployer.address, config.AmbireAccountImplementation, owners[0])
    )
  }

  const downloadWallet = () => {
    const implementation = config['AmbireAccountImplementation']
    const json = getExportData(nftAddress, deployer.address, implementation, owners[0])
    downloadJson(json, `ambire-wallet-${nftAddress}.json`)
  }

  const onOwnerValueChange = (ownerIndex, event) => {
    const newOwners = [...owners]
    newOwners[ownerIndex] = event.target.value
    setOwners(newOwners)
  }

  useEffect(async () => {
    if (registrar && nftAddress) {
      setApprovedDeployer(await registrar.getApprovedDeployer(nftAddress))
    }
  }, [registrar, deployer, approveDeployerTx])

  useEffect(() => {
    if (deployTxStatus === SpinnerStatus.success) {
      sendWalletCreationRequest(
        nftAddress, 
        config.relayerUrl, 
        getMetadata(nftAddress, deployer.address, config.AmbireAccountImplementation, owners[0])
      )
    }
  }, [deployTxStatus])


  return (
    <Main {...props}>
      {nftAddress}
      {deployTx?.status
        ? <Loading status={deployTxStatus} />
        : <>
            <div style={{ marginTop: 10}}>
              {owners.map((owner, i) => 
                <OwnerLine key={`owner${i}`}>
                  <AddressInput  label={`Owner #${i+1}`} value={owner} onChange={e => onOwnerValueChange(i, e)} />
                  {i > 0 && <DeleteIcon onClick={() => onDeleteOwnerClick(i)} fontSize='large'/>}
                </OwnerLine>
              )}
            </div>
            {/*<MKButton onClick={onAddOwnerClick}>Add owner</MKButton>*/}
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
        {deployTxStatus === SpinnerStatus.success
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