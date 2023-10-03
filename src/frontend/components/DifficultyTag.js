import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Tooltip from '@mui/material/Tooltip'

export default function DifficultyTag({ difficulty, matchStartOfAddress = false }) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [tooltipTimer, setTooltipTimer] = useState()
  const { color, content } = getTagParams(difficulty, matchStartOfAddress)

  const handleMouseOver = () => {
    clearTimeout(tooltipTimer)
    setTooltipOpen(true)
  }

  useEffect(() => {
    // Don't display tooltip at first
    if (tooltipTimer !== undefined) {
      clearTimeout(tooltipTimer)
      setTooltipOpen(true)
      setTooltipTimer(setTimeout(() => setTooltipOpen(false), 4000))
    }
    else
      setTooltipTimer(0)

  }, [difficulty, matchStartOfAddress])

  return (
    <LightTooltip
      open={tooltipOpen}
      onClose={() => setTooltipOpen(false)}
      placement="left"
      title={
        <>
          On average <strong>{getDifficultyIterations(difficulty, matchStartOfAddress)} iterations</strong> are needed to
          generate an address.
        </>
      }
    >
      <Tag
        onMouseEnter={handleMouseOver}
        onClick={handleMouseOver}
        style={{ backgroundColor: color }}
      >
        {content}
      </Tag>
    </LightTooltip>
  )
}

function getDifficultyIterations(difficulty, matchStartOfAddress) {
  return matchStartOfAddress
    ? ITERATIONS_START[difficulty]
    : ITERATIONS[difficulty]
}

function getTagParams(diff, matchStartOfAddress = false) {
  const easy = matchStartOfAddress ? 8 : 10
  const moderate = matchStartOfAddress ? 10 : 12

  if (diff < easy) return { color: '#317c64', content: 'EASY' }
  else if (diff < moderate) return { color: '#98ab48', content: 'MODERATE' }
  else return { color: '#991439', content: 'DIFFICULT' }
}

const Tag = styled.div({
  display: 'flex',
  height: '25px',
  flexBasis: 'auto',
  color: 'white',
  background: 'rgb(19,94,56)',
  borderRadius: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '1px 1px 1px 0px rgba(0, 0, 0, 0)',
  fontSize: '0.8rem',
  fontWeight: '600',
  transition: 'background 0.35s ease-out',
  padding: '2px 15px 0 15px',
  cursor: 'pointer',
})

const ITERATIONS = {
  4: '113',
  5: '1900',
  6: '31 000',
  7: '500 000',
  8: '8.4 million',
  9: '139 million',
  10: '2.3 billion',
  11: '38 billion',
  12: '628 billion',
  13: '10.4 trillion',
  14: '173 trillion',
  15: '2.9 quadrillion',
  16: '48 quadrillion',
  17: '802 quadrillion',
  18: '13.4 quintillion',
  19: '225 quintillion',
  20: '3.8 sextillion' 
}

const ITERATIONS_START = {
  4: '65 000',
  5: '1 million',
  6: '16.8 million',
  7: '268 million',
  8: '4.3 billion',
  9: '68.7 billion',
  10: '1.1 trillion',
  11: '17.6 trillion',
  12: '281 trillion',
  13: '4.5 quadrillion',
  14: '72 quadrillion',
  15: '1.15 quintillion',
  16: '18.4 quintillion',
  17: '295 quintillion'
}

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    width: '400px',
  },
  '& .MuiTooltip-arrow': {
    color: 'white',
  },
}))
