import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import exportAbi from '../src/core/exportAbi.mjs'
import deployContracts from "../src/core/deployContracts.mjs"
import { deploy, send } from '../src/core/ethersHelpers.mjs'

import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }
import SafeDeployerAbi from '../artifacts/src/contracts/deployers/SafeDeployer.sol/SafeDeployer.json' assert { type: "json" }


async function main() {
  try {
    const [owner] = await hre.ethers.getSigners()

    const { registrar, proxy, nftAddressFactory, safeDeployer } = await deployContracts({
      salt: '0x0000000000000000000000000000000000000000000000000000000000000001',
      mintPrice: '0',
      royalties: '500',
      royaltiesRecipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      owner: owner.address,
      verbose: true
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
        GnosisSafeImpl: gnosisSafe.address
      }
    })
    console.log('✅')

    process.stdout.write('Exporting ABIs... ')
    exportAbi({
      Registrar: RegistrarAbi.abi,
      RegistrarProxy: RegistrarProxyAbi.abi,
      NFTAddressFactory: NFTAddressFactoryAbi.abi,
      SafeDeployer: SafeDeployerAbi.abi
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
