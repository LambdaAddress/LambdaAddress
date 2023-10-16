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
    <div style={{ margin: 20 }}>
        {isImg 
            ? <img alt="" src={dataURI} />
            : <AddressCardSvg address={{ address }} />
        }
        <code style={{ margin: '30px 10px', display: 'block', fontSize: 12, whiteSpace: 'pre-wrap'    }}>{getMetadataImageSource(svgString)}</code>
    </div>
    )
}


function getMetadataImageSource(svgString) {
    svgString = svgString
        .replaceAll('&#x27;', "\\'")
        .replaceAll('\n', '')
        .replace(' data-reactroot=""', '')
    const firstBlockPos = svgString.indexOf('class="badge">') + 14
    const secondBlockPos = svgString.indexOf('class="address">') + 16

    return `
function getImage(uint256 tokenId, Registrar registrar) public pure returns (string memory) {
    return
        string(
            abi.encodePacked(
                '${svgString.substring(0, firstBlockPos)}',
                Strings.toString(registrar.getAddressDifficulty(tokenId)),
                '${svgString.substring(firstBlockPos + 1, secondBlockPos)}',
                Strings.toHexString(address(uint160(tokenId))),
                "</text></svg></g></svg>"
            )
        );
}
    `
}