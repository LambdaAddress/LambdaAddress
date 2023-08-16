import Spinner, { SpinnerStatus } from './Spinner'
import MKButton from './MKButton'
import { useMemo } from 'react'
import styled from '@emotion/styled'

export default function TransactionButton({ transaction, children, ...props }) {
  const status = useMemo(() => {
    if (!transaction)
      return ''

    switch (transaction.status) {
      case 'PENDING_USER': return SpinnerStatus.loading
      case 'PENDING': return SpinnerStatus.loading
      case 'SUCCESS': return SpinnerStatus.success
      case 'ERROR': return SpinnerStatus.fail
    }
  }, [transaction, transaction?.status])

  return (
    <Main status={status} disabled={status === SpinnerStatus.loading ? true : false} {...props}>
      {children}
      <Status>
        { transaction?.status && <Spinner size={2} status={status} /> }
      </Status>
    </Main>
  )
}

const Main = styled(MKButton)(({ status }) => ({
  cursor: status === SpinnerStatus.loading ? 'progress' : 'pointer'
}))

const Status = styled.div({
  display: 'inline-block',
  marginLeft: 8,
  marginRight: -4
})

