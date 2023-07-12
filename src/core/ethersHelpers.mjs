import hre from "hardhat"

async function deploy(factory, ...params) {
    return (await factory.deploy(...params)).deployed()
}

async function send(tx) {
    return (await tx).wait()
}

async function create2Deploy(deployer, factory, salt, args = [], options = {}) {
    const initcode = factory.getDeployTransaction(...args)
    
    const computedContractAddress = await deployer.computeAddress(
      salt,
      hre.ethers.utils.keccak256(initcode.data)
    )
  
    const receipt = await deployer.deploy(0, salt, initcode.data, options)
    await receipt.wait()
    return factory.attach(computedContractAddress)
}

async function create3Deploy(create2Deployer, factory, salt, args) {
    const create3DeployerSalt = hre.ethers.utils.id('Create3Deployer')
    const Create3Deployer = await hre.ethers.getContractFactory("Create3Deployer")
    const create3DeployerAddress = await create2Deployer.computeAddress(create3DeployerSalt, hre.ethers.utils.keccak256(Create3Deployer.bytecode))
  
    const code = await hre.ethers.provider.getCode(create3DeployerAddress)
    
    // Check if contract is already deployed
    const create3Deployer = code === '0x' || code === ''
      ? await create2Deploy(create2Deployer, Create3Deployer, create3DeployerSalt)
      : Create3Deployer.attach(create3DeployerAddress)
  
    if (create3Deployer.address !== create3DeployerAddress) {
      throw "Wrong Create3Deployer address."
    }
  
    const initcode = factory.getDeployTransaction(...args)
  
    const computedContractAddress = await create3Deployer.computeAddress(salt)
    await create3Deployer.deploy(0, salt, initcode.data)
  
    return factory.attach(computedContractAddress)
}

/**
 * If running locally, deploy and return a new instance of the Create2Deployer contract,
 * otherwise return the instance at `address`.
 */
async function getCreate2Deployer(address) {
  const Create2DeployerFactory = await hre.ethers.getContractFactory("Create2Deployer")

  if (hre.network.name === 'hardhat' || hre.network.name === 'localhost')  
    return await deploy(Create2DeployerFactory)
  else
    return Create2DeployerFactory.attach(address)
}

export { create2Deploy, create3Deploy, deploy, getCreate2Deployer, send }