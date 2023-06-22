async function deploy(factory, ...params) {
    return (await factory.deploy(...params)).deployed()
}

async function send(tx) {
    return (await tx).wait()
}

async function create2Deploy(deployer, factory, salt, args = [], options = {}) {
    const initcode = factory.getDeployTransaction(...args)
    //console.log('transaction: ', initcode)
    
    const computedContractAddress = await deployer.computeAddress(
      salt,
      hre.ethers.utils.keccak256(initcode.data)
    )
  
    const receipt = await deployer.deploy(0, salt, initcode.data, options)
    const result = await receipt.wait()
    return factory.attach(computedContractAddress)
  }

export { create2Deploy, deploy, send }