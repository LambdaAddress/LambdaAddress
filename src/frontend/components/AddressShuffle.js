import breakpoints from '../breakpoints'
import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

const animationDuration = 800
const animationInterval = 20

export default function({ ...props }) {
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationAddresses, setAnimationAddresses] = useState([])

  const addresses = [
    <span>0x<B>00000000000000</B>f6f4ce6ab8827279cfffb92266</span>,
    <span>0x<B>ba5ed</B>4aaf54267db7d7c367839aaf71a00a2c6a65</span>,
    <span>0x<B>00000000000000</B>f6f4ce6ab8827279cfffb92266</span>,
    <span>0x70997970c5181<B>aaaaaaaaaaaaaa</B>50e0d17dc79c8</span>, 
    <span>0x3c44cdddb6a900fa2b585dd2<B>0000000000000000</B></span>, 
    <span>0x90f79<B>22222222222222222222</B>82e1f101e93b906</span>,
  ]

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
        setCurrentAddressIndex((currentIndex) => (currentIndex + 1) % addresses.length)
      }, animationDuration)
    }, 3000)

    return () => {
      clearInterval(intervalId)
    }
  }, [addresses.length])

  useEffect(() => {
    if (isAnimating) {
      const animationIntervalId = setInterval(() => {
        setAnimationAddresses((addresses) => {
          const newAddresses = [...addresses]
          newAddresses.shift()
          newAddresses.push(generateRandomAddress())
          return newAddresses
        })
      }, animationInterval)

      setTimeout(() => {
        clearInterval(animationIntervalId)
        setAnimationAddresses([])
      }, animationDuration - animationInterval)
    } else {
      setAnimationAddresses([])
    }
  }, [isAnimating])

  const currentAddress = addresses[currentAddressIndex]

  return (
    <AddressShuffle {...props}>
      <Eg>e.g.:</Eg>
      <AddressContainer>
        {isAnimating ? (
          animationAddresses.map((address) => <div key={address}>{address}</div>)
        ) : (
          <div>{currentAddress}</div>
        )}
      </AddressContainer>
    </AddressShuffle>
  )
}

const generateRandomAddress = () => {
  const characters = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += characters[Math.floor(Math.random() * characters.length)]
  }
  return address
}


const AddressShuffle = styled.div({
  color: 'white',
  textAlign: 'center'
})

const AddressContainer = styled.div({
  fontFamily: "'Sofia Sans Extra Condensed', sans-serif",
  height: 40,
  fontSize: 32,
  fontWeight: 300,
  fontStyle: 'normal',
  textShadow: '1px 1px 2px rgba(0,0,0,0.4)',

  [`@media ${breakpoints.down.lg}`]: {
    fontSize: '19px'
  }
})

const Eg = styled.div({
  [`@media ${breakpoints.down.md}`]: {
    fontSize: '19px'
  }
})

const B = styled.strong({
    fontWeight: 400,
    margin: '0 2px'
})
