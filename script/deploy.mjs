import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import config from '../src/config/config.json' assert { type: "json" }
import exportAbi from '../src/core/exportAbi.mjs'
import deployContracts from "../src/core/deployContracts.mjs"
import { deploy, send } from '../src/core/ethersHelpers.mjs'

import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }
import SafeDeployerAbi from '../artifacts/src/contracts/deployers/SafeDeployer.sol/SafeDeployer.json' assert { type: "json" }
import AmbireAccountDeployerAbi from '../artifacts/src/contracts/deployers/AmbireAccountDeployer/AmbireAccountDeployer.sol/AmbireAccountDeployer.json' assert { type: "json" }

const { NFTAddressFactorySalt, RegistrarSalt} = config
const DEFAULT_SIGNER = "0x2F0cBd07f01862981b031eC7e0DC5A51109053aB"
const MINT_PRICE = '0' 

async function main() {
  try {
    const owner = DEFAULT_SIGNER
    await hre.network.provider.send("hardhat_setBalance", [owner, "0x1000000000000000000000000000000"])    
    await hre.network.provider.send("hardhat_impersonateAccount", [owner])
    const signer = await ethers.getSigner(owner)

    const { registrar, proxy, nftAddressFactory, safeDeployer, ambireAccountDeployer } = await deployContracts({
      registrarSalt: RegistrarSalt, 
      nftAddressFactorySalt: NFTAddressFactorySalt,
      mintPrice: MINT_PRICE,
      owner: signer.address,
      signer,
      verbose: true,
      deployers: true
    })

    process.stdout.write('Deploying GnosisSafe singleton... ')
    const GnosisSafe = await hre.ethers.getContractFactory("GnosisSafe")
    const gnosisSafe = await deploy(GnosisSafe)
    console.log(`${gnosisSafe.address} ✅`)

    process.stdout.write('Creating config file... ')
    createConfig({
      network: hre.network.name, 
      config: {
        RegistrarImplementation: registrar.address,
        Registrar: proxy.address,
        NFTAddressFactory: nftAddressFactory.address,
        SafeDeployer: safeDeployer.address,
        AmbireAccountDeployer: ambireAccountDeployer.address,
        GnosisSafeImpl: gnosisSafe.address,
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
