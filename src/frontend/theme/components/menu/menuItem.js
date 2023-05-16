import colors from '../../base/colors'
import borders from '../../base/borders'
import typography from '../../base/typography'
import pxToRem from '../../functions/pxToRem'

const { white } = colors
const { borderRadius } = borders
const { size } = typography

export default {
  styleOverrides: {
    root: {
      minWidth: pxToRem(160),
      minHeight: 'unset',
      padding: `${pxToRem(4.8)} ${pxToRem(16)}`,
      borderRadius: borderRadius.md,
      fontSize: size.sm,
      color: 'white !important',
      transition: 'background-color 300ms ease, color 300ms ease',

      '&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: white,
      },
    },
  },
}
