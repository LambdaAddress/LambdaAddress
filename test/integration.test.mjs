import hre from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import deployContracts from "../src/core/deployContracts.mjs"
import { deploy, send } from '../src/core/ethersHelpers.mjs'
import generateNFTAddress from '../src/core/generateNFTAddress.mjs'
import SampleContractArtifact from '../artifacts/src/contracts/test/SampleContract.sol/SampleContract.json' assert { type: "json" };

const deployCode = SampleContractArtifact.bytecode
 
describe("Integration tests", function () {
    const MINT_PRICE = '10000000000000000'

    async function deployTestContracts() {
        try {
          const Registrar = await ethers.getContractFactory("Registrar")
          const SampleContract = await ethers.getContractFactory("SampleContract")
          const [owner] = await hre.ethers.getSigners()
          const sampleContract = await deploy(SampleContract, "6")

          const { registrar, proxy, nftAddressFactory } = await deployContracts({
            salt: '0x0000000000000000000000000000000000000000000000000000000000000001',
            mintPrice: MINT_PRICE,
            owner: owner.address,
            local: true
          }) 

          const registrarProxy = Registrar.attach(proxy.address)
          return { registrar, nftAddressFactory, proxy, registrarProxy, sampleContract }
          
        } catch(err) {
          console.log('Error deploying contracts', err)
        }

    }
      
    it("should mint the right address and deploy the right bytecode", async function () {
      const { registrar, nftAddressFactory, proxy, registrarProxy, sampleContract } = await loadFixture(deployTestContracts)
      
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
  