import styled from '@emotion/styled'
import getAddressDifficulty from '../../core/getAddressDifficulty.mjs'

export default function HighlightedAddress({ address, ...props }) {
  address = address.toLowerCase()
  const difficulty = getAddressDifficulty(address)
  const startIndex = findIndex(address, difficulty)
  const endIndex = startIndex + difficulty

  return (
    <Main {...props}>
      {address.slice(0, startIndex)}
      <strong style={{ margin: '0 3px' }}>{address.slice(startIndex, endIndex)}</strong>
      {address.slice(endIndex)}
    </Main>
  )
}

function findIndex(address, repetitions) {
  const pattern = new RegExp(`(.)\\1{${repetitions - 1}}`)
  const match = address.match(pattern)
  return match ? address.indexOf(match[0]) : -1
}


const Main = styled.div({
  fontFamily: "'Sofia Sans Extra Condensed', sans-serif",
})