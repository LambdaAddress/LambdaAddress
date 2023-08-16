import colors from '../../base/colors'
import pxToRem from '../../functions/pxToRem'

const { transparent } = colors

export default {
  styleOverrides: {
    select: {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },

    icon: {
      fill: 'white',
    }
    /*
    select: {
      display: 'grid',
      alignItems: 'center',
      padding: `0 ${pxToRem(12)} !important`,

      '& .Mui-selected': {
        backgroundColor: transparent.main,
      },
    },

    selectMenu: {
      background: 'none',
      height: 'none',
      minHeight: 'none',
      overflow: 'unset',
    },

    icon: {
      display: 'none',
    },*/
  },
}
