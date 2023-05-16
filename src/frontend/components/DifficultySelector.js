import breakpoints from '../breakpoints'
import styled from '@emotion/styled'
import Slider from '@mui/material/Slider'

export default function DifficultySelector({ value, onValueChange, matchStartOfAddress = false }) {
  const [ min, max ] = matchStartOfAddress
    ? [ 4, 13 ]
    : [ 6, 15 ]

  const values = populateArray(min, max)
  const marks = values.map((v) => ({ value: v, label: v.toString() }))

  return (
    <div>
      <AddressExample>
        <Eg>e.g.:</Eg>
        {matchStartOfAddress
          ? addressExampleStartsWithPattern(value)
          : addressExample(value)
        }
      </AddressExample>
      <Gauge></Gauge>
      <DifficultySlider
        size="small"
        min={min}
        max={max}
        marks={marks}
        defaultValue={value}
        value={value}
        aria-label="Small"
        onChange={(e, v) => onValueChange(v)}
      />
    </div>
  )
}

function addressExample(difficulty = 0, char = '0') {
  return `0x${genRandomHex(4)}..${char.repeat(difficulty)}..${genRandomHex(4)}`
}

function addressExampleStartsWithPattern(difficulty = 0, char = '0') {
  return `0x${char.repeat(difficulty)}${genRandomHex(4)}..${genRandomHex(4)}`
}

// Doesn't include 0s
function genRandomHex(size = 0) {
  return [...Array(size)].map(() => (Math.floor(Math.random() * 15) + 1).toString(16)).join('')
}

function populateArray(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const DifficultySlider = styled(Slider)({
  marginTop: '-15px',
  color: '#52af77',
  padding: '13px 0 !important',
  '& .MuiSlider-markLabel': {
    color: 'white',
    top: '30px !important',
  },
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    marginTop: '-4px',
  },
  '& .MuiSlider-track': {
    background: 'white',
  },
})

const Eg = styled.span({
  [`@media ${breakpoints.up.xs}`]: {
    fontSize: '19px',
    left: '-2px'
  },

  position: 'absolute',
  left: '4px',
  color: 'rgba(255,255,255,0.5)',
  fontStyle: 'italic',
  fontFamily: 'initial',
  fontSize: '20px'
})

const AddressExample = styled.div({
  position: 'relative',
  letterSpacing: '2px',
  color: 'white',
  textAlign: 'center',
  marginBottom: '16px',
  fontFamily: "'Sofia Sans Extra Condensed', sans-serif",
  fontSize: '19px',
  lineHeight: '19px',

  [`@media ${breakpoints.up.md}`]: {
    fontSize: '20px',
    lineHeight: '20px'
  },
  [`@media ${breakpoints.up.lg}`]: {
    fontSize: '22px'
  }
})

const Gauge = styled.div({
  display: 'flex',
  height: '12px',
  marginLeft: '-4px',
  width: 'calc(100% + 7px)',
  borderRadius: '6px',
  background: 'linear-gradient(90deg, #317c64 0%, #98ab48 50%, #991439 100%)',
})
