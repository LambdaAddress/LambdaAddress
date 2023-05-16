import { useState, useEffect, useCallback, useRef } from 'react'

import AddressFinder from '../../core/AddressFinder.mjs'

export default function useAddressGenerator(factory, owner, difficulty, startWorker, matchStart) {
  const [state, setState] = useState({
    finder: null,
    generatedAddress: '',
    iterations: 0n,
    salt: ''
  })

  // Keeps state in sync at all time
  const stateRef = useRef()
  stateRef.current = state

  const onSuccess = useCallback(() => {
    clearInterval(stateRef.current.timer)
    stateRef.current.finder.stop()

    setState({
      ...stateRef.current,
      iterations: stateRef.current.finder.getIterations(),
      generatedAddress: stateRef.current.finder.getGeneratedAddress(),
      salt: stateRef.current.finder.getSalt(),
    })
  }, [])

  useEffect(() => {
    if (startWorker) {
      const addressFinder = new AddressFinder({ factory, owner, difficulty, onSuccess, matchStart })
      const startTime = performance.now()
      addressFinder.start()

      const timer = setInterval(() => {
        if (stateRef.current.finder) {
          const iterations = stateRef.current.finder.getIterations()
          const time = performance.now() - startTime
          console.debug(
            `Total: ${iterations / window.BigInt(parseInt(time / 1000))} iterations/sec`
          )
          setState({ ...stateRef.current, iterations })
        }
      }, 2500)

      setState({
        finder: addressFinder,
        timer,
        generatedAddress: '',
        salt: '',
        iterations: 0n,
      })
    }

    return () => {
      clearInterval(state.timer)
      state.finder && state.finder.stop()
    }
  }, [factory, owner, difficulty, startWorker, onSuccess])

  return state
}
