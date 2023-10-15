import boxShadows from '../../base/boxShadows'
import typography from '../../base/typography'
import colors from '../../base/colors'
import borders from '../../base/borders'
import pxToRem from '../../functions/pxToRem'

const { lg } = boxShadows
const { size } = typography
const { white } = colors
const { borderRadius } = borders

export default {
  defaultProps: {
    disableAutoFocusItem: true,
  },

  styleOverrides: {
    paper: {
      minWidth: pxToRem(160),
      boxShadow: lg,
      padding: `${pxToRem(16)} ${pxToRem(8)}`,
      fontSize: size.sm,
      color: white,
      textAlign: 'left',
      backgroundColor: `rgba(40,26,78,0.7) !important`,
      borderRadius: borderRadius.md,
    },
  },
}
