import hre from "hardhat"
import { create2Deploy, send, getCreate2Deployer } from "../src/core/ethersHelpers.mjs"
import config from "../src/config/config.json" assert { type: "json" }
const { RegistrarImplementationSalt } = config

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'
const REGISTRAR_PROXY = '0x83Ba1110e1fBC9aB84102B7DF0d909e367Fad785'
const SALT = RegistrarImplementationSalt

async function main() {
  try {    
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy")
    const [owner] = await hre.ethers.getSigners()

    process.stdout.write('Deploying Registrar... ')
    const registrar = await create2Deploy(deployer, Registrar, SALT)
    console.log(`${registrar.address} ✅`)

    process.stdout.write(`Executing RegistrarProxy.upgradeTo(${registrar.address})... `)
    const registrarProxy = await RegistrarProxy.attach(REGISTRAR_PROXY)
    await send(registrarProxy.upgradeTo(registrar.address))
    console.log('✅')

    console.log(`Update successful on ${hre.network.name} network ✅`)
  } catch(err) {
    console.log('❌')
    console.log(err)
    process.exitCode = 1;
  }
}


main()
