import hre from "hardhat"
import { create2Deploy, create3Deploy, deploy, send } from './ethersHelpers.mjs'

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'

export default async function deployContracts({ salt, mintPrice, royalties, royaltiesRecipient, owner, verbose = false, local = false}) {
    const MetaData = await hre.ethers.getContractFactory("MetaData")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy")
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory")
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)
  
    verbose && process.stdout.write('Deploying MetaData... ')

    // Workaround for the hardhat gas estimate problem
    const metaData = local 
        ? await create2Deploy(deployer, MetaData, salt, [], { gasLimit: 30000000 })
        : await create2Deploy(deployer, MetaData, salt)

    verbose && console.log(`${metaData.address} ✅`)
      
    verbose && process.stdout.write('Deploying Registrar... ')
    const registrar = await create2Deploy(deployer, Registrar, salt)
    verbose && console.log(`${registrar.address} ✅`)
  
    verbose && console.log(`Deploying RegistrarProxy(${registrar.address})`)
    verbose && console.log(' Initialization params:', {
      mintPrice,
      royalties,
      royaltiesRecipient,
      metaData: metaData.address,
      owner
    })
    verbose && process.stdout.write('... ')
      
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
    await send(registrarProxy.allowFactory(nftAddressFactory.address, true, { gasLimit: 55000 }))
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
  
