import ethers from 'ethers'
import getDeployCode from './getDeployCode.mjs'

const { getCreate2Address, keccak256, getContractAddress } = ethers.utils


export default function generateNFTAddress(factory, initialOwner, salt) {
    const proxyAddress = getCreate2Address(factory, salt, keccak256(getDeployCode(initialOwner)))
    return getContractAddress({ from: proxyAddress, nonce: "1"})
}

