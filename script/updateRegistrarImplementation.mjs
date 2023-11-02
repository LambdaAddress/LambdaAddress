import hre from "hardhat"
import { create2Deploy, send, getCreate2Deployer } from "../src/core/ethersHelpers.mjs"
import config from "../src/config/config.json" assert { type: "json" }
const { RegistrarImplementationSalt } = config

const REGISTRAR_PROXY = '0x83Ba1110e1fBC9aB84102B7DF0d909e367Fad785'
const SALT = RegistrarImplementationSalt

async function main() {
  try {    
    const [signer] = await hre.ethers.getSigners()
    const deployer = await getCreate2Deployer(signer)
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy")

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
