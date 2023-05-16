async function deploy(factory, ...params) {
    return (await factory.deploy(...params)).deployed()
}

async function send(tx) {
    return (await tx).wait()
}

async function create2Deploy(deployer, factory, salt, ...args) {
    const initcode = factory.getDeployTransaction(...args)
    
    const computedContractAddress = await deployer.computeAddress(
      salt,
      hre.ethers.utils.keccak256(initcode.data)
    )
  
    const receipt = await deployer.deploy(0, salt, initcode.data)
    const result = await receipt.wait()
    return factory.attach(computedContractAddress)
  }

export { create2Deploy, deploy, send }