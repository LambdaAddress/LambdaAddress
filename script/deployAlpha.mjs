// Alpha version deployment script

import hre from "hardhat"
import createConfig from '../src/core/createConfig.mjs'
import exportAbi from '../src/core/exportAbi.mjs'
import deployContracts from "../src/core/deployContracts.mjs"


import RegistrarAbi from '../artifacts/src/contracts/Registrar.sol/Registrar.json' assert { type: "json" }
import RegistrarProxyAbi from '../artifacts/src/contracts/RegistrarProxy.sol/RegistrarProxy.json' assert { type: "json" }
import NFTAddressFactoryAbi from '../artifacts/src/contracts/NFTAddressFactory.sol/NFTAddressFactory.json' assert { type: "json" }


async function main() {
  try {    
    const [owner] = await hre.ethers.getSigners()

    const { registrar, proxy, nftAddressFactory } = await deployContracts({
      salt: '0x0000000000000000000000000000000000000000000000000000000000000003',
      mintPrice: '1000000000000', // 0.000001 ETH
      royalties: '500', // 5%
      royaltiesRecipient: '0x9CF33ca0A779171d82f33203e6601bE925c7D3eA',
      owner: owner.address,
      verbose: true
    })

    process.stdout.write('Creating config file... ')
    createConfig({
      network: `${hre.network.name}_alpha`, 
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
