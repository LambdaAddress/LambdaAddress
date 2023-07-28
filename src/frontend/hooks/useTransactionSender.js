import { useState, useEffect } from 'react'

const STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

export default function useTransactionSender() {
  const [state, setState] = useState({
    status: null,
    response: null,
    receipt: null,
    error: null,
    transaction: null
  })

  const setTransaction = transaction => {
    setState({
      transaction
    })
  }

  useEffect(() => {
    const fn = async () => {
      if (!state.transaction) {
        setState({})
        return
      }

      setState({ status: STATUS.PENDING })
      try {
        const response = await state.transaction
        setState({
          response: await state.transaction,
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
  }, [state.transaction])

  return [state, setTransaction]
}
