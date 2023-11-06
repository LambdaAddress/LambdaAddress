// Beta version deployment script

import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import exportAbi from '../src/core/exportAbi.mjs'
import config from '../src/config/config.json' assert { type: "json" }
import deployContracts from "../src/core/deployContracts.mjs"

import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }
import SafeDeployerAbi from '../artifacts/src/contracts/deployers/SafeDeployer.sol/SafeDeployer.json' assert { type: "json" }
import AmbireAccountDeployerAbi from '../artifacts/src/contracts/deployers/AmbireAccountDeployer/AmbireAccountDeployer.sol/AmbireAccountDeployer.json' assert { type: "json" }

const { NFTAddressFactorySalt, RegistrarSalt} = config
const LOCAL_SIGNER = "0x2F0cBd07f01862981b031eC7e0DC5A51109053aB"
const MINT_PRICE = '40000000000000000' // 0.04 ETH

async function main() {
  try {    
    const network = hre.network.name
    let signer

    if (network === 'hardhat' || network === 'localhost') {
      console.log('Running locally with signer: ', LOCAL_SIGNER)
      await hre.network.provider.send("hardhat_setBalance", [LOCAL_SIGNER, "0x1000000000000000000000000000000"])    
      await hre.network.provider.send("hardhat_impersonateAccount", [LOCAL_SIGNER])
      signer = await ethers.getSigner(LOCAL_SIGNER)
    }
    else {
      [signer] = await hre.ethers.getSigners()
    }

    const { registrar, proxy, nftAddressFactory, metaData } = await deployContracts({
      registrarSalt: RegistrarSalt, 
      nftAddressFactorySalt: NFTAddressFactorySalt,
      mintPrice: MINT_PRICE, 
      owner: signer.address,
      signer,
      verbose: true
    })

    process.stdout.write('Creating config file... ')
    createConfig({
      network: `${hre.network.name}_beta`, 
      config: {
        Registrar: proxy.address,
        RegistrarImplementation: registrar.address,
        NFTAddressFactory: nftAddressFactory.address,
        MetaData: metaData.address,
        mintPrice: MINT_PRICE
      }
    })
    console.log('✅')

    process.stdout.write('Exporting ABIs... ')
    exportAbi({
      Registrar: RegistrarAbi.abi,
      RegistrarProxy: RegistrarProxyAbi.abi,
      NFTAddressFactory: NFTAddressFactoryAbi.abi,
      SafeDeployer: SafeDeployerAbi.abi,
      AmbireAccountDeployer: AmbireAccountDeployerAbi.abi
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
