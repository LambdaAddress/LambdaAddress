const DIRECTION = { up: 'up', down: 'down' }

function breakpoints(direction) {
  const prefix = direction === DIRECTION.down ? 'max' : 'min'

  return {
    xs: `(${prefix}-width: 0px)`,
    sm: `(${prefix}-width: 576px)`,
    md: `(${prefix}-width: 768px)`,
    lg: `(${prefix}-width: 992px)`,
    xl: `(${prefix}-width: 1200px)`,
    xxl: `(${prefix}-width: 1400px)`,
  }
}

export default {
  up: breakpoints('up'),
  down: breakpoints('down'),
  ...breakpoints('up'),
}
