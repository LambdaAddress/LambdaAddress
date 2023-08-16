import config from './config'
import CancelButton from '../../CancelButton'
import { ethers } from 'ethers'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import MenuItem from '@mui/material/MenuItem'
import MKButton from '../../MKButton'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Spinner, { SpinnerStatus } from '../../Spinner'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import TransactionButton from '../../TransactionButton'
import { useEffect, useMemo, useState } from 'react'
import useTransactionSender, { TransactionStatus } from '../../../hooks/useTransactionSender'
import GnosisSafeAbi from './GnosisSafeAbi'

const gnosisSafe = new ethers.utils.Interface(GnosisSafeAbi.abi)
const setupFunctionFragment = gnosisSafe.getFunction('0xb63e800d') 

export default function GnosisSafeDeployer({ nftAddress, contracts, deployer, registrar, network, onClose, ...props }) {
  const [owners, setOwners] = useState([''])
  const [threshold, setThreshold] = useState('')
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
    const calldata = gnosisSafe.encodeFunctionData(setupFunctionFragment, [
      owners, 
      threshold, 
      '0x0000000000000000000000000000000000000000',
      '0x',
      config.contracts[network.chainId.toString()]['GnosisSafeImplementation'],
      '0x0000000000000000000000000000000000000000',
      '0',
      '0x0000000000000000000000000000000000000000'
    ])
    setDeployTx(deployer.deploy(nftAddress, contracts.GnosisSafeImpl, calldata))
  }

  const onOwnerValueChange = (ownerIndex, event) => {
    const newOwners = [...owners]
    newOwners[ownerIndex] = event.target.value
    setOwners(newOwners)
  }

  const onThresholdChange = event => {
    setThreshold(event.target.value)
  }

  useEffect(async () => {
    if (registrar && nftAddress) {
      setApprovedDeployer(await registrar.getApprovedDeployer(nftAddress))
    }
  }, [registrar, deployer, approveDeployerTx])

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
            <MKButton onClick={onAddOwnerClick}>Add owner</MKButton>

            <SelectForm>
              <InputLabel>Threshold</InputLabel>
              <Select
                  value={threshold}
                  label="Threshold"
                  onChange={onThresholdChange}
                >
                  {owners.map((owner, i) => 
                    <MenuItem key={`threshold${i+1}`} value={i+1}>{i + 1}</MenuItem>            
                  )}
              </Select>
            </SelectForm>
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

const SelectForm = styled(FormControl)({
  display: 'flex',
  width: 200,
  marginTop: 20
})

const AddressInput = styled(Input)({
  width: 400
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