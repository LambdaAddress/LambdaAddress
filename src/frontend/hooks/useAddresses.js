import { useState, useEffect } from 'react'
import fetchNftAddresses from '../fetchNftAddresses'

export default function useAddresses(owner, registrar, network) {
  const [addressList, setAddressList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (owner && registrar) {
      fetchNftAddresses(owner, registrar, network).subscribe({
          next(result) {
            console.log('fetchNftAddresses: ', result)
            setAddressList(result || [])
          },
          error(err) {
            console.error('something wrong occurred: ' + err);
          },
          complete() {
            console.log('done')
            setIsLoading(false)
          },
      })  
    }
  }, [owner, registrar])

  return { addressList, isLoading }
}
