import hre from "hardhat"
import { create2Deploy, create3Deploy, deploy, getCreate2Deployer, send } from './ethersHelpers.mjs'


export default async function deployContracts({ registrarSalt, nftAddressFactorySalt, mintPrice, owner, signer, verbose = false, local = false, deployers = false}) {
    if (!signer)
      signer = (await hre.ethers.getSigners())[0]
    
    const MetaData = await hre.ethers.getContractFactory("MetaData", signer)
    const Registrar = await hre.ethers.getContractFactory("Registrar", signer)
    const RegistrarProxy = await hre.ethers.getContractFactory("RegistrarProxy", signer)
    const NFTAddressFactory = await hre.ethers.getContractFactory("NFTAddressFactory", signer)

    const SafeDeployer = await hre.ethers.getContractFactory("SafeDeployer", signer)
    const AmbireAccountDeployer = await hre.ethers.getContractFactory("AmbireAccountDeployer", signer)
    const deployer = await getCreate2Deployer(signer)
  
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
 
    let safeDeployer, ambireAccountDeployer

    if (deployers) {
      verbose && process.stdout.write('Deploying SafeDeployer... ')
      safeDeployer = await create2Deploy(deployer, SafeDeployer, registrarSalt, [proxy.address])
      verbose && console.log(`${safeDeployer.address} ✅`)

      verbose && process.stdout.write('Deploying AmbireAccountDeployer... ')
      ambireAccountDeployer = await create2Deploy(deployer, AmbireAccountDeployer, registrarSalt, [proxy.address])
      verbose && console.log(`${ambireAccountDeployer.address} ✅`)
    }
  
    return {
      registrar, proxy, nftAddressFactory, metaData, safeDeployer, ambireAccountDeployer
    }
}