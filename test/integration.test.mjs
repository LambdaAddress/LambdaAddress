import hre from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { create2Deploy, deploy, send } from '../src/core/ethersHelpers.mjs'
import generateNFTAddress from '../src/core/generateNFTAddress.mjs'
import SampleContractArtifact from '../artifacts/src/contracts/test/SampleContract.sol/SampleContract.json' assert { type: "json" };

const SALT = hre.ethers.utils.id('0x123456')
const deployCode = SampleContractArtifact.bytecode

async function getDeployer() {
  const Create2DeployerFactory = await hre.ethers.getContractFactory("Create2Deployer") 
  return await deploy(Create2DeployerFactory)
}
  
describe("Integration tests", function () {
    const MINT_PRICE = '10000000000000000'
    const ROYALTIES = '500'
    const ROYALTIES_RECIPIENT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

    async function deployContracts() {
        try {
          const MetaData = await ethers.getContractFactory("MetaData")
          const Registrar = await ethers.getContractFactory("Registrar")
          const RegistrarProxy = await ethers.getContractFactory("RegistrarProxy")
          const NFTAddressFactory = await ethers.getContractFactory("NFTAddressFactory")
          const SampleContract = await ethers.getContractFactory("SampleContract")
          const [owner] = await hre.ethers.getSigners()
          const deployer = await getDeployer()
          const metaData = await create2Deploy(deployer, MetaData, SALT, [], { gasLimit: 30000000 })
          
          const registrar = await create2Deploy(deployer, Registrar, SALT)
          const utx = await registrar.populateTransaction.initialize(
            MINT_PRICE, 
            ROYALTIES, 
            ROYALTIES_RECIPIENT, 
            metaData.address, 
            owner.address
          )  
          const proxy = await create2Deploy(deployer, RegistrarProxy, SALT, [registrar.address, utx.data])
          const nftAddressFactory = await create2Deploy(deployer, NFTAddressFactory, SALT, [proxy.address])
          const sampleContract = await deploy(SampleContract, "6")

          
          const registrarProxy = Registrar.attach(proxy.address)
      
          //await send(registrarProxy.initialize(MINT_PRICE, ROYALTIES, ROYALTIES_RECIPIENT, metaData.address))
          await send(registrarProxy.allowFactory(nftAddressFactory.address, true))
      
          return { registrar, nftAddressFactory, proxy, registrarProxy, sampleContract }
          
        } catch(err) {
          console.log('Error deploying contracts', err)
        }

    }
      
    it("should mint the right address and deploy the right bytecode", async function () {
      const { registrar, nftAddressFactory, proxy, registrarProxy, sampleContract } = await loadFixture(deployContracts)
      //const contracts = await loadFixture(deployContracts)
      
      const [account1] = await ethers.getSigners()
      const salt = '0x000000000000000000000000000000000000000000000000000000000000007B'

      const sampleContractBytecode = await ethers.provider.getCode(sampleContract.address)
      const nftAddress = generateNFTAddress(nftAddressFactory.address, account1.address, salt)
      
      
      const tx = await send(registrarProxy.mint(nftAddressFactory.address, salt, { value: MINT_PRICE, from: account1.address }))

      const event = tx.events.find(e => e.event === 'Transfer')
      const contractAddress = event.args[2].toHexString()

      await send(registrarProxy.deploy(contractAddress, deployCode + '0000000000000000000000000000000000000000000000000000000000000006'))

      const bytecode = await ethers.provider.getCode(contractAddress)

      expect(contractAddress).equal(nftAddress.toLowerCase())
      expect(bytecode).equal(sampleContractBytecode)
    })

  

})
  