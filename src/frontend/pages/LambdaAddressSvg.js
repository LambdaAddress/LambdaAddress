/**
 * Page used for internal purposes only.
 * 
 * Usage: http://localhost:3000/#/svg?address=
 * Params:
 * 
 * address (required): Lambda Address in hex. E.g.: 0x00000000741c852cfa4ff05d1b0feb92fa7678d0
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AddressCardSvg from '../components/AddressCardSvg'


export default function LambdaAddressSvg() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const address = searchParams.get('address')
    const { hostname } = window.location

    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return <div>This page can only be accessed locally</div>
    }
    
    return (<AddressCardSvg address={{ address }} />)
}