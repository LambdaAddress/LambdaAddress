import MKButton from '../MKButton'
import { useState } from 'react'
import Spinner, { SpinnerStatus } from '../Spinner'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import useTransactionSender from '../../hooks/useTransactionSender'


export default function CustomBytecode({ nftAddress, contracts, deployer, registrar, onClose, ...props }) {
  const [editedBytecode, setBytecode] = useState()
  const [transaction, setTransaction] = useTransactionSender() 

  const onDeployClick = () => {
    setTransaction(registrar.deploy(nftAddress, editedBytecode))
  }

  return (
    <div {...props}>
      {nftAddress}
      <Form>
        {!transaction.status ? (
          <>
            <Label>Deployment bytecode:</Label>
            <BytecodeInput
              placeholder="0x123456789a..."
              multiline
              rows={5}
              value={editedBytecode}
              onChange={(e) => setBytecode(e.target.value)}
            />
            <ButtonContainer>
              <DeployButton onClick={onDeployClick}>Deploy</DeployButton>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
            </ButtonContainer>
          </>
        ) : (
          <Spinner
            status={(() => {
              switch (transaction.status) {
                case 'PENDING':
                  return SpinnerStatus.loading
                case 'ERROR':
                  return SpinnerStatus.fail
                case 'SUCCESS':
                  return SpinnerStatus.success
              }
            })()}
            style={{ margin: 'auto' }}
          />
        )}

        {transaction.status === 'ERROR' && (
          <ButtonContainer>
            <DeployButton onClick={onDeployClick}>Retry</DeployButton>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
          </ButtonContainer>
        )}

        {transaction.status === 'SUCCESS' && (
          <ButtonContainer>
            <CancelButton onClick={onClose}>Close</CancelButton>
          </ButtonContainer>
        )}
      </Form>
    </div>
  )
}

const Label = styled.div({
  color: 'white',
  fontSize: '1rem',
})


const Form = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: 40,
})

const BytecodeInput = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-notchedOutline': {
    color: '#344767',
  },
  '& .MuiInputBase-input': {
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#344767',
  },
})

const ButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 40,
})

const DeployButton = styled(MKButton)({
  width: 160,
  margin: '0 10px',
})

const CancelButton = styled(MKButton)({
  width: 160,
  margin: '0 10px',
  backgroundColor: '#aaa',

  ':hover': {
    backgroundColor: '#bbb',
  },
})


