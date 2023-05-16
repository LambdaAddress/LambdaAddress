import { useState, useEffect } from 'react'

const STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

export default function useTransactionSender(transaction) {
  const [state, setState] = useState({
    status: null,
    response: null,
    receipt: null,
    error: null,
  })

  useEffect(() => {
    const fn = async () => {
      if (!transaction) {
        setState({})
        return
      }

      setState({ status: STATUS.PENDING })
      try {
        const response = await transaction
        setState({
          response: await transaction,
        })

        const receipt = await response.wait()
        setState({
          receipt,
          status: STATUS.SUCCESS,
        })
      } catch (error) {
        setState({
          error,
          status: STATUS.ERROR,
        })
      }
    }

    fn()
  }, [transaction])

  return state
}
