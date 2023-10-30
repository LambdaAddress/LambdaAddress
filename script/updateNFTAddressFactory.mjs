import hre from "hardhat"
import { create3Deploy, send, getCreate2Deployer } from "../src/core/ethersHelpers.mjs"
import config from "../src/config/config.json" assert { type: "json" }
const { NFTAddressFactorySalt } = config

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'
const REGISTRAR = '0x7db2623064B59Dd273841B661a0F8C5bC550B330'
const OLD_FACTORY = '0x2007E2672Bcde7F865De4C0121D0A9Ad1E4EBa98'

async function main() {
  try {    
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const [owner] = await hre.ethers.getSigners()

    process.stdout.write(`Deploying NFTAddressFactory using salt ${NFTAddressFactorySalt}... `)
    const nftAddressFactorySalt = hre.ethers.BigNumber
      .from(hre.ethers.utils.id('NFTAddressFactory'))
      .add(NFTAddressFactorySalt)

    const nftAddressFactory = await create3Deploy(deployer, NFTAddressFactory, nftAddressFactorySalt, [REGISTRAR])
    console.log(`${nftAddressFactory.address} ✅`)

    const registrar = await Registrar.attach(REGISTRAR)

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
