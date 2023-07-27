import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import MKButton from '../MKButton'
import { useState } from 'react'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'

const initializer = '0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009cf33ca0a779171d82f33203e6601be925c7d3ea0000000000000000000000000000000000000000000000000000000000000000'

export default function GnosisSafeDeployer({ nftAddress, contracts, deployer, registrar, ...props }) {
  const [owners, setOwners] = useState([''])

  const onAddOwnerClick = () => {
    setOwners([...owners, ''])
  }

  const onApproveClick = () => {
    registrar.approveDeployer(deployer.address, nftAddress)
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

  return (
    <div {...props}>
      {nftAddress}
      <div style={{ marginTop: 10}}>
        {owners.map((owner, i) => 
          <OwnerLine>
          <Input key={i} label={`Owner #${i+1}`} value={owner} onChange={e => onOwnerValueChange(i, e)} />
            {i > 0 && <DeleteIcon onClick={() => onDeleteOwnerClick(i)} fontSize='large'/>}
          </OwnerLine>
        )}
      </div>
      <MKButton onClick={onAddOwnerClick}>Add owner</MKButton>
      <div>
        <MKButton onClick={onApproveClick}>Approve deployer</MKButton><br />
        <MKButton onClick={onDeployClick}>Deploy</MKButton>
      </div>
    </div>
  )
}

const Label = styled.div({
  color: 'white',
  fontSize: '1rem',
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

const OwnerLine = styled.div({
  marginTop: 10,
  marginBottom: 4
})

const DeleteIcon = styled(DeleteForeverRoundedIcon)({
  cursor: 'pointer',
  marginTop: 4
})