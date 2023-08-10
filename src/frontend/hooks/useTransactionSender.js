import { useState, useEffect } from 'react'

const STATUS = {
  PENDING_USER: 'PENDING_USER',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

export default function useTransactionSender() {
  const DEFAULT_STATE = {
    status: null,
    receipt: null,
    error: null,
    transaction: null
  }

  const [state, setState] = useState(DEFAULT_STATE)

  const setTransaction = transaction => {
    setState({
      ...state,
      transaction
    })
  }

  useEffect(async () => {
      if (!state.transaction) {
        setState(DEFAULT_STATE)
        return
      }

      setState({ ...state, status: STATUS.PENDING_USER })
      try {
        const response = await state.transaction
        setState({
          ...state,
          status: STATUS.PENDING
        })

        const receipt = await response.wait()
        setState({
          ...state,
          receipt,
          status: STATUS.SUCCESS,
        })
      } catch (error) {
        setState({
          ...state,
          error,
          status: STATUS.ERROR,
        })
      }
  }, [state.transaction])

  return [state, setTransaction]
}
