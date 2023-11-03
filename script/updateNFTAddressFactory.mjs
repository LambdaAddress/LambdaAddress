import hre from "hardhat"
import { create3Deploy, send, getCreate2Deployer } from "../src/core/ethersHelpers.mjs"
import config from "../src/config/config.json" assert { type: "json" }
const { NFTAddressFactorySalt } = config

const REGISTRAR = '0x83Ba1110e1fBC9aB84102B7DF0d909e367Fad785'
const OLD_FACTORY = '0xC7CF3B442038741932c69B7c3212C3527D11f05C'

async function main() {
  try {    
    const [signer] = await hre.ethers.getSigners()
    const deployer = await getCreate2Deployer(signer)
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const registrar = await Registrar.attach(REGISTRAR)

    process.stdout.write(`Deploying NFTAddressFactory using salt ${NFTAddressFactorySalt}... `)
    const nftAddressFactorySalt = hre.ethers.BigNumber
      .from(hre.ethers.utils.id('NFTAddressFactory'))
      .add(NFTAddressFactorySalt)

    const nftAddressFactory = await create3Deploy(deployer, NFTAddressFactory, nftAddressFactorySalt, [REGISTRAR])
    console.log(`${nftAddressFactory.address} ✅`)

    process.stdout.write(`Executing Registrar.allowFactory(${nftAddressFactory.address}, true)... `)
    await send(registrar.allowFactory(nftAddressFactory.address, true))
    console.log('✅')

    process.stdout.write(`Executing Registrar.allowFactory(${OLD_FACTORY}, false)... `)
    await send(registrar.allowFactory(OLD_FACTORY, false))
    console.log('✅')

    console.log(`Update successful on ${hre.network.name} network ✅`)
  } catch(err) {
    console.log('❌')
    console.log(err)
    process.exitCode = 1;
  }
}


main()
