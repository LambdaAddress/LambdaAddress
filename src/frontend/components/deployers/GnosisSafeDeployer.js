import CancelButton from '../CancelButton'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import MenuItem from '@mui/material/MenuItem'
import MKButton from '../MKButton'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import useTransactionSender from '../../hooks/useTransactionSender'

const initializer = '0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009cf33ca0a779171d82f33203e6601be925c7d3ea0000000000000000000000000000000000000000000000000000000000000000'

export default function GnosisSafeDeployer({ nftAddress, contracts, deployer, registrar, onClose, ...props }) {
  const [owners, setOwners] = useState([''])
  const [threshold, setThreshold] = useState('')
  const [approvedDeployer, setApprovedDeployer] = useState('')
  const isDeployerApproved = approvedDeployer.toLowerCase() === deployer?.address?.toLowerCase()
  const [approveDeployerTx, setApproveDeployerTx] = useTransactionSender() 

  const onAddOwnerClick = () => {
    setOwners([...owners, ''])
  }

  const onApproveClick = async () => {
    setApproveDeployerTx(await registrar.approveDeployer(deployer.address, nftAddress))
  }

  const onDeleteOwnerClick = (ownerIndex) => {
    const newOwners = [...owners]
    newOwners.splice(ownerIndex, 1)
    setOwners(newOwners)
  }

  const onDeployClick = () => {
    deployer.deploy(nftAddress, contracts.GnosisSafeImpl, initializer)
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
      <div style={{ marginTop: 10}}>
        {owners.map((owner, i) => 
          <OwnerLine key={`owner${i}`}>
            <AddressInput  label={`Owner #${i+1}`} value={owner} onChange={e => onOwnerValueChange(i, e)} />
            {i > 0 && <DeleteIcon onClick={() => onDeleteOwnerClick(i)} fontSize='large'/>}
          </OwnerLine>
        )}
      </div>
      <MKButton onClick={onAddOwnerClick}>Add owner</MKButton>
      <br /><br />
      <FormControl fullWidth>
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
      </FormControl>
      <ButtonsContainer>
        {isDeployerApproved
          ? <MKButton onClick={onDeployClick}>Deploy</MKButton>
          : <MKButton onClick={onApproveClick}>Approve deployer</MKButton>
        }        
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </ButtonsContainer>
    </Main>
  )
}

const Main = styled.div({
  marginBottom: 30
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