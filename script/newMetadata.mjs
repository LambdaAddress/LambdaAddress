import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import exportAbi from '../src/core/exportAbi.mjs'
import { create2Deploy, deploy, send } from '../src/core/ethersHelpers.mjs'

import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'
const SALT = hre.ethers.utils.id('0x0000000001')

async function getDeployer() {
  const Create2DeployerFactory = await hre.ethers.getContractFactory("Create2Deployer")

  if (hre.network.name === 'hardhat' || hre.network.name === 'localhost')  
    return await deploy(Create2DeployerFactory)
  else
    return Create2DeployerFactory.attach(CREATE2_DEPLOYER_ADDRESS)
}

async function main() {
  try {

    const REGISTRAR = '0xa3678169DB0a7D0e5326205636bc08c7687c8291'
    const MetaData = await hre.ethers.getContractFactory("MetaData")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const deployer = await getDeployer()
    const [owner] = await hre.ethers.getSigners()

    const registrarProxy = Registrar.attach(REGISTRAR)

    process.stdout.write('Deploying MetaData... ')
    const metaData = await create2Deploy(deployer, MetaData, SALT)
    console.log(`${metaData.address} ✅`)

    process.stdout.write(`RegistrarProxy.setMetaData(${metaData.address})... `)
    await send(registrarProxy.setMetaData(metaData.address))
    console.log('✅')


    console.log(`Deployment successful on ${hre.network.name} network ✅`)
  } catch(err) {
    console.log('❌')
    console.log(err)
    process.exitCode = 1;
  }
}


main()
