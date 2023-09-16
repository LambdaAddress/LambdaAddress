// Alpha version deployment script

import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import exportAbi from '../src/core/exportAbi.mjs'
import deployContracts from "../src/core/deployContracts.mjs"

import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }
import SafeDeployerAbi from '../artifacts/src/contracts/deployers/SafeDeployer.sol/SafeDeployer.json' assert { type: "json" }
import AmbireAccountDeployerAbi from '../artifacts/src/contracts/deployers/AmbireAccountDeployer/AmbireAccountDeployer.sol/AmbireAccountDeployer.json' assert { type: "json" }


async function main() {
  try {    
    const [owner] = await hre.ethers.getSigners()

    const { registrar, proxy, nftAddressFactory, safeDeployer, ambireAccountDeployer } = await deployContracts({
      salt: '0x0000000000000000000000000000000000000000000000000000000000000004',
      mintPrice: '1000000000000', // 0.000001 ETH
      royalties: '500', // 5%
      royaltiesRecipient: '0x2F0cBd07f01862981b031eC7e0DC5A51109053aB',
      owner: owner.address,
      verbose: true
    })

    process.stdout.write('Creating config file... ')
    createConfig({
      network: `${hre.network.name}_alpha`, 
      config: {
        RegistrarImplementation: registrar.address,
        Registrar: proxy.address,
        NFTAddressFactory: nftAddressFactory.address,
        AmbireAccountDeployer: ambireAccountDeployer.address,
        SafeDeployer: safeDeployer.address
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
