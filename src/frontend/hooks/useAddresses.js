import { useState, useEffect } from 'react'
import fetchNftAddresses from '../fetchNftAddresses'

export default function useAddresses(owner, registrar, network) {
  const [addressList, setAddressList] = useState([])

  useEffect(() => {
    if (owner && registrar) {
      fetchNftAddresses(owner, registrar, network).then(setAddressList).catch(console.error)
    }
  }, [owner, registrar])

  return addressList
}
