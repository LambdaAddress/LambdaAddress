import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import MKButtonRoot from './MKButtonRoot'

const MKButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => (
    <MKButtonRoot
      {...rest}
      ref={ref}
      color="primary"
      variant={variant === 'gradient' ? 'contained' : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
    >
      {children}
    </MKButtonRoot>
  )
)

// Setting default values for the props of MKButton
MKButton.defaultProps = {
  size: 'medium',
  variant: 'contained',
  color: 'white',
  circular: false,
  iconOnly: false,
}

// Typechecking props for the MKButton
MKButton.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['text', 'contained', 'outlined', 'gradient']),
  color: PropTypes.oneOf([
    'default',
    'white',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default MKButton
