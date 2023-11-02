import hre from "hardhat"
import { create2Deploy, create3Deploy, deploy, getCreate2Deployer, send } from './ethersHelpers.mjs'

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'

export default async function deployContracts({ registrarSalt, nftAddressFactorySalt, mintPrice, owner, verbose = false, local = false}) {
    const MetaData = await hre.ethers.getContractFactory("MetaData")
    const Registrar = await hre.ethers.getContractFactory("Registrar")
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy")
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory")

    const SafeDeployer = await hre.ethers.getContractFactory("SafeDeployer")
    const AmbireAccountDeployer = await hre.ethers.getContractFactory("AmbireAccountDeployer")
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)
  
    verbose && process.stdout.write('Deploying MetaData... ')

    // Workaround for the hardhat gas estimate problem
    const metaData = await deploy(MetaData)

    verbose && console.log(`${metaData.address} ✅`)
      
    verbose && process.stdout.write('Deploying Registrar... ')
    const registrar = await create2Deploy(deployer, Registrar, registrarSalt)
    verbose && console.log(`${registrar.address} ✅`)
  
    verbose && console.log(`Deploying RegistrarProxy(${registrar.address})`)
    verbose && console.log(' Initialization params:', {
      mintPrice,
      metaData: metaData.address,
      owner
    })
    verbose && process.stdout.write('... ')
      
    const utx = await registrar.populateTransaction.initialize(
      mintPrice, 
      metaData.address, 
      owner
    )
    
    const registrarSaltc = hre.ethers.BigNumber
      .from(hre.ethers.utils.id('RegistrarProxy'))
      .add(registrarSalt)
    
    const proxy = await create3Deploy(deployer, RegistrarProxy, registrarSaltc, [registrar.address, utx.data])
    verbose && console.log(`${proxy.address} ✅`)
  
  
    verbose && process.stdout.write('Deploying NFTAddressFactory... ')
  
    const nftAddressFactorySaltc = hre.ethers.BigNumber
      .from(hre.ethers.utils.id('NFTAddressFactory'))
      .add(nftAddressFactorySalt)
  
    const nftAddressFactory = await create3Deploy(deployer, NFTAddressFactory, nftAddressFactorySaltc, [proxy.address])
    verbose && console.log(`${nftAddressFactory.address} ✅`)
  
    const registrarProxy = Registrar.attach(proxy.address)
  
    verbose && process.stdout.write(`RegistrarProxy.allowFactory(${nftAddressFactory.address}, true)... `)
    await send(registrarProxy.allowFactory(nftAddressFactory.address, true, { gasLimit: 55000 }))
    verbose && console.log('✅')

    verbose && process.stdout.write('Deploying SafeDeployer... ')
    const safeDeployer = await create2Deploy(deployer, SafeDeployer, registrarSalt, [proxy.address])
    verbose && console.log(`${safeDeployer.address} ✅`)

    verbose && process.stdout.write('Deploying AmbireAccountDeployer... ')
    const ambireAccountDeployer = await create2Deploy(deployer, AmbireAccountDeployer, registrarSalt, [proxy.address])
    verbose && console.log(`${ambireAccountDeployer.address} ✅`)
  
    return {
      registrar, proxy, nftAddressFactory, metaData, safeDeployer, ambireAccountDeployer
    }
}