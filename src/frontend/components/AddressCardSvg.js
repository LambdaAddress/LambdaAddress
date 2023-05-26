import getAddressDifficulty from '../../core/getAddressDifficulty.mjs'

export default function AddressCardSvg({ address, className, highlightAddress = false, ...style }) {
  const addressText = address?.address.toLowerCase() || ''
  const difficulty = getAddressDifficulty(addressText)
  const startIndex = findIndex(addressText, difficulty)
  const endIndex = startIndex + difficulty

  return (
    <svg
      {...style}
      className={`nft-address ${className}`}
      width="424"
      height="524"
      viewBox="0 0 424 524"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
                @font-face { font-family: 'Sofia Sans Extra Condensed'; src: url(https://fonts.gstatic.com/s/sofiasansextracondensed/v2/raxoHjafvdAIOju4GcIfJH0i7zi50X3zRtuLNiMS0fSuJk4.woff2) format('woff2'); }
                .badge { font-size: 38px; font-weight: bold; }
                .address { font-family: 'Sofia Sans Extra Condensed', sans-serif; font-size: 22px; font-weight: 300; text-transform: lowercase; filter: drop-shadow(2px 1px 3px rgb(0,0,0,0.75)); }
                .logo { filter: drop-shadow(1px 3px 2px rgb(0,0,0,0.75)); }
                .nft-address { filter: drop-shadow(2px 1px 7px rgb(0, 0, 0, 0.5)) }
      `}</style>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="74%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(86,111,149,1)' }} />
          <stop offset="48%" style={{ stopColor: 'rgba(35,67,116,1)' }} />
          <stop offset="100%" style={{ stopColor: 'rgba(35,67,116,1) ' }} />
        </linearGradient>
        <linearGradient id="badge" x1="0%" y1="0%" x2="74%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(86,111,149,1)' }} />
          <stop offset="48%" style={{ stopColor: 'rgba(35,67,116,1)' }} />
          <stop offset="100%" style={{ stopColor: 'rgba(35,67,116,1) ' }} />
        </linearGradient>
      </defs>
      <rect x="24" y="24" width="400" height="500" rx="20" fill="white" className="anim" />
      <rect x="34" y="34" width="380" height="480" rx="20" fill="url(#grad1)" />
      <circle cx="40" cy="40" r="40" fill="white" />
      <circle cx="40" cy="40" r="34" fill="url(#badge)"></circle>
      <text
        x="40"
        y="44"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        className="badge"
      >
        {address && getAddressDifficulty(address.address)}
      </text>
      <g className="logo">
        <svg
          x="175"
          y="25%"
          width="97.35"
          height="154.8"
          viewBox="0 0 115 182"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M57.5054 181V135.84L1.64064 103.171L57.5054 181Z"
            fill="#88AAF1"
            stroke="#1616B4"
            strokeLinejoin="round"
          />
          <path
            d="M57.6906 181V135.84L113.555 103.171L57.6906 181Z"
            fill="#b0d5fb"
            stroke="#1616B4"
            strokeLinejoin="round"
          />
          <path
            d="M57.5055 124.615V66.9786L1 92.2811L57.5055 124.615Z"
            fill="#B8FAF6"
            stroke="#1616B4"
            strokeLinejoin="round"
          />
          <path
            d="M57.6903 124.615V66.9786L114.196 92.2811L57.6903 124.615Z"
            fill="#b0d5fb"
            stroke="#1616B4"
            strokeLinejoin="round"
          />
          <path
            d="M1.00006 92.2811L57.5054 1V66.9786L1.00006 92.2811Z"
            fill="#88AAF1"
            stroke="#1616B4"
            strokeLinejoin="round"
          />
          <path
            d="M114.196 92.2811L57.6906 1V66.9786L114.196 92.2811Z"
            fill="#B8FAF6"
            stroke="#1616B4"
            strokeLinejoin="round"
          />
        </svg>
      </g>
      <text
        x="50%"
        y="404"
        transform="translate(12 0)"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        className="address"
      > {highlightAddress 
        ? <>{addressText.slice(0, startIndex)}<tspan style={{ fontWeight: 400, margin: '0 3px' }}>{addressText.slice(startIndex, endIndex)}</tspan>{addressText.slice(endIndex)}</>
        : address?.address
        }
        
      </text>
    </svg>
  )
}


function findIndex(address, repetitions) {
  const pattern = new RegExp(`(.)\\1{${repetitions - 1}}`)
  const match = address.match(pattern)
  return match ? address.indexOf(match[0]) : -1
}