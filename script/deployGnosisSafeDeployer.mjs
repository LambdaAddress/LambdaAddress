import hre from "hardhat"
import { create2Deploy, getCreate2Deployer } from '../src/core/ethersHelpers.mjs'

const CREATE2_DEPLOYER_ADDRESS = '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2'
const salt = '0x0000000000000000000000000000000000000000000000000000000000000001'
const registrar = '0x4c310c3159A97a8aFFa73380D874E7F6c5774E8C'

async function main() {
  try {
    const SafeDeployer = await hre.ethers.getContractFactory("SafeDeployer")
    const deployer = await getCreate2Deployer(CREATE2_DEPLOYER_ADDRESS)

    process.stdout.write('Deploying SafeDeployer... ')
    const safeDeployer = await create2Deploy(deployer, SafeDeployer, salt, [registrar])
    console.log(`${safeDeployer.address} ✅`)

    console.log(`Deployment successful on ${hre.network.name} network ✅`)
  } catch(err) {
    console.log('❌')
    console.log(err)
    process.exitCode = 1;
  }
}



main()
