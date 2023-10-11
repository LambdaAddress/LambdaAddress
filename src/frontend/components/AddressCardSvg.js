import getAddressDifficulty from '../../core/getAddressDifficulty.mjs'
const base64Font = 'data:application/font-woff2;charset=utf-8;base64,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'

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
                @font-face { font-family: 'Sofia Sans Extra Condensed'; font-style: normal; src: url(${base64Font}) format('woff2'); }
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