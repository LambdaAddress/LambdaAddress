import hre from "hardhat"
import { create2Deploy, deploy, send } from './ethersHelpers.mjs'

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'

export default async function deployContracts({ salt, mintPrice, royalties, royaltiesRecipient, owner, verbose = false}) {
    const MetaData = await hre.ethers.getContractFactory("MetaData")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy")
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory")
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)
  
    verbose && process.stdout.write('Deploying MetaData... ')
    const metaData = await create2Deploy(deployer, MetaData, salt)
    verbose && console.log(`${metaData.address} ✅`)
      
    verbose && process.stdout.write('Deploying Registrar... ')
    const registrar = await create2Deploy(deployer, Registrar, salt)
    verbose && console.log(`${registrar.address} ✅`)
  
    verbose && process.stdout.write(`Deploying RegistrarProxy(${registrar.address})... `)
      
    const utx = await registrar.populateTransaction.initialize(
      mintPrice, 
      royalties, 
      royaltiesRecipient, 
      metaData.address, 
      owner
    )
    
    const registrarSalt = hre.ethers.BigNumber
      .from(hre.ethers.utils.id('RegistrarProxy'))
      .add(salt)
    
    const proxy = await create3Deploy(deployer, RegistrarProxy, registrarSalt, [registrar.address, utx.data])
    verbose && console.log(`${proxy.address} ✅`)
  
  
    verbose && process.stdout.write('Deploying NFTAddressFactory... ')
  
    const nftAddressFactorySalt = hre.ethers.BigNumber
      .from(hre.ethers.utils.id('NFTAddressFactory'))
      .add(salt)
  
    const nftAddressFactory = await create3Deploy(deployer, NFTAddressFactory, nftAddressFactorySalt, [proxy.address])
    verbose && console.log(`${nftAddressFactory.address} ✅`)
  
    const registrarProxy = Registrar.attach(proxy.address)
  
    verbose && process.stdout.write(`RegistrarProxy.allowFactory(${nftAddressFactory.address}, true)... `)
    await send(registrarProxy.allowFactory(nftAddressFactory.address, true))
    verbose && console.log('✅')
  
    return {
      registrar, proxy, nftAddressFactory, metaData
    }
}

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
    const create3DeployerSalt = hre.ethers.utils.id('Create3Deployer')
    const Create3Deployer = await hre.ethers.getContractFactory("Create3Deployer")
    const create3DeployerAddress = await create2Deployer.computeAddress(create3DeployerSalt, hre.ethers.utils.keccak256(Create3Deployer.bytecode))
  
    const code = await hre.ethers.provider.getCode(create3DeployerAddress)
    
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