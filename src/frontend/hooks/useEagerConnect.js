import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

export default function useEagerConnect(connector) {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)

  useEffect(() => {
    connector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(connector, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [activate, connector])

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}
