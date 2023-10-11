/**
 * Page used for internal purposes only.
 * 
 * Usage: http://localhost:3000/#/svg?address=&isImg
 * Params:
 * 
 * address (required): Lambda Address in hex. E.g.: 0x00000000741c852cfa4ff05d1b0feb92fa7678d0
 * isImg: Renders the svg as an `img` element with a base64 url src 
 * 
 */
import AddressCardSvg from '../components/AddressCardSvg'
import { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { useLocation } from 'react-router-dom'


export default function LambdaAddressSvg() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const address = searchParams.get('address')
    const isImg = searchParams.get('isImg')
    const { hostname } = window.location
    const svgString = renderToString(<AddressCardSvg address={{ address }} />)
    const dataURI = `data:image/svg+xml;base64,${btoa(svgString)}`


    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return <div>This page can only be accessed locally</div>
    }
    
    return (
    <div>
        {isImg 
            ? <img src={dataURI} />
            : <AddressCardSvg address={{ address }} />
        }
    </div>
    )
}