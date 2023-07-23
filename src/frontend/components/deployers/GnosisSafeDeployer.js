import MKButton from '../MKButton'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'

const initializer = '0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009cf33ca0a779171d82f33203e6601be925c7d3ea0000000000000000000000000000000000000000000000000000000000000000'

export default function GnosisSafeDeployer({ nftAddress, contracts, deployer, registrar, ...props }) {
  const onApproveClick = () => {
    registrar.approveDeployer(deployer.address, nftAddress)
  }

  const onDeployClick = () => {
    deployer.deploy(nftAddress, contracts.GnosisSafeImpl, initializer)
  }

  return (
    <div {...props}>
      <Label>Gnosis Safe Deployment</Label>
      <div>{nftAddress}</div>
      <div>Deployer: {deployer.address}</div>
      <div>
        <TextField label="Outlined" variant="outlined"  />
      </div>
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
