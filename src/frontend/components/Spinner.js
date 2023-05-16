import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const BRAND_SUCCESS = '#5cb85c'
const SIZE = '7em'
const WIDTH = `calc(${SIZE} / 4)`
const HEIGHT = `calc(${SIZE} / 2)`
const CHECK_LEFT = `calc(${SIZE} / 6 + ${SIZE} / 12)`
const CHECK_THICKNESS = '3px'
const CHECK_COLOR = BRAND_SUCCESS

export const SpinnerStatus = {
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

export default function Spinner({ status, ...props }) {
  return (
    <CircleLoader status={status} {...props}>
      <CheckMark className="check draw" />
      <FailMark className="fail">
        <X>⨉</X>
      </FailMark>
    </CircleLoader>
  )
}

const loaderSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const checkmarkAnimation = keyframes`
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: ${WIDTH};
    opacity: 1;
  }
  40% {
    height: ${HEIGHT};
    width: ${WIDTH};
    opacity: 1;
  }
  100% {
    height: ${HEIGHT};
    width: ${WIDTH};
    opacity: 1;
  }
`

const CircleLoader = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-left-color: ${CHECK_COLOR};
  animation: ${loaderSpin} 1.2s infinite linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: ${SIZE};
  height: ${SIZE};

  ${({ status }) =>
    status === SpinnerStatus.success &&
    `
        -webkit-animation: none;
        animation: none;
        border-color: ${CHECK_COLOR};
        transition: border 500ms ease-out;

        & .check {
            display: block;
        }   
    `}

  ${({ status }) =>
    status === SpinnerStatus.fail &&
    `
        -webkit-animation: none;
        animation: none;
        border-color: red;
        transition: border 500ms ease-out;

        & .fail {
            opacity: 1;
        }   
    `}
`

const CheckMark = styled.div`
  display: none;

  &.draw:after {
    animation-duration: 800ms;
    animation-timing-function: ease;
    animation-name: ${checkmarkAnimation};
    transform: scaleX(-1) rotate(135deg);
  }

  &:after {
    opacity: 1;
    height: ${HEIGHT};
    width: ${WIDTH};
    transform-origin: left top;
    border-right: ${CHECK_THICKNESS} solid ${CHECK_COLOR};
    border-top: ${CHECK_THICKNESS} solid ${CHECK_COLOR};
    content: '';
    left: ${CHECK_LEFT};
    top: ${HEIGHT};
    position: absolute;
  }
`

const FailMark = styled.div({
  opacity: 0,

  color: 'red',
  textAlign: 'center',
  height: '100%',
  width: '100%',
  transition: 'opacity 800ms ease',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const X = styled.div({
  color: 'red',
  fontSize: '60px',
  display: 'flex',
  fontWeight: '200',
  height: '58px',
  lineHeight: '50px',
  cursor: 'default',
})
