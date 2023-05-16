import styled from '@emotion/styled'

export default function AdvancedOptions({ isOpen = false, ...props }) {
  return (
    <div {...props}>
      {isOpen && (
        <div>
          <Label>Coming soon</Label>
        </div>
      )}
    </div>
  )
}

const Label = styled.div({
  color: 'white',
  fontSize: '1rem',
})
