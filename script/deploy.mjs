import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import exportAbi from '../src/core/exportAbi.mjs'
import { create2Deploy, deploy, send } from '../src/core/ethersHelpers.mjs'

import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'
const SALT = hre.ethers.utils.id('0x0000000001')

/**
 * If running locally, deploy and return a new instance of the Create2Deployer contract,
 * otherwise return the instance at `address`.
 */
async function getCreate2Deployer(address) {
  const Create2DeployerFactory = await hre.ethers.getContractFactory("Create2Deployer")

  if (hre.network.name === 'hardhat' || hre.network.name === 'localhost')  
    return await deploy(Create2DeployerFactory)
  else
    return Create2DeployerFactory.attach(address)
}

async function create3Deploy(create2Deployer, factory, salt, args) {
  const create3DeployerSalt = hre.ethers.utils.id('0x0000000001')
  const Create3Deployer = await hre.ethers.getContractFactory("Create3Deployer")
  const create3DeployerAddress = await create2Deployer.computeAddress(create3DeployerSalt, hre.ethers.utils.keccak256(Create3Deployer.bytecode))

  const code = await hre.ethers.getDefaultProvider().getCode(create3DeployerAddress)
  
  // Check if contract is already deployed
  const create3Deployer = code === '0x' || code === ''
    ? await create2Deploy(create2Deployer, Create3Deployer, create3DeployerSalt)
    : Create3Deployer.attach(create3DeployerAddress)

  if (create3Deployer.address !== create3DeployerAddress) {
    throw "Wrong Create3Deployer address."
  }

  const initcode = factory.getDeployTransaction(...args)

  const computedContractAddress = await create3Deployer.computeAddress(salt)
  await create3Deployer.deploy(0, salt, initcode.data)

  return factory.attach(computedContractAddress)
}


async function main() {
  try {
    // const MINT_PRICE = '10000000000000000'
    const MINT_PRICE = '0'
    const ROYALTIES = '500' // 5%
    const ROYALTIES_RECIPIENT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    const MetaData = await hre.ethers.getContractFactory("MetaData")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy")
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory")
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)
    const [owner] = await hre.ethers.getSigners()

    process.stdout.write('Deploying MetaData... ')
    const metaData = await create2Deploy(deployer, MetaData, SALT)
    console.log(`${metaData.address} ✅`)
      
    process.stdout.write('Deploying Registrar... ')
    const registrar = await create2Deploy(deployer, Registrar, SALT)
    console.log(`${registrar.address} ✅`)

    process.stdout.write(`Deploying RegistrarProxy(${registrar.address})... `)
    
    const utx = await registrar.populateTransaction.initialize(
      MINT_PRICE, 
      ROYALTIES, 
      ROYALTIES_RECIPIENT, 
      metaData.address, 
      owner.address
    )
    
    const proxy = await create3Deploy(deployer, RegistrarProxy, SALT, [registrar.address, utx.data])
    console.log(`${proxy.address} ✅`)

    process.stdout.write('Deploying NFTAddressFactory... ')
    const nftAddressFactory = await create2Deploy(deployer, NFTAddressFactory, SALT, [proxy.address])
    console.log(`${nftAddressFactory.address} ✅`)

    const registrarProxy = Registrar.attach(proxy.address)

    process.stdout.write(`RegistrarProxy.allowFactory(${nftAddressFactory.address}, true)... `)
    await send(registrarProxy.allowFactory(nftAddressFactory.address, true))
    console.log('✅')

    process.stdout.write('Creating config file... ')
    createConfig({
      network: hre.network.name, 
      config: {
        RegistrarImplementation: registrar.address,
        Registrar: proxy.address,
        NFTAddressFactory: nftAddressFactory.address
      }
    })
    console.log('✅')

    process.stdout.write('Exporting ABIs... ')
    exportAbi({
      Registrar: RegistrarAbi.abi,
      RegistrarProxy: RegistrarProxyAbi.abi,
      NFTAddressFactory: NFTAddressFactoryAbi.abi,
    })
    console.log('✅')

    console.log(`Deployment successful on ${hre.network.name} network ✅`)
  } catch(err) {
    console.log('❌')
    console.log(err)
    process.exitCode = 1;
  }
}


main()
