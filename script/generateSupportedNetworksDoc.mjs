import hre from "hardhat"
import generateSupportedNetworksDoc from '../src/core/generateSupportedNetworksDoc.mjs'


async function main() {
  try {
    process.stdout.write('Generating supported networks documentation... ')
    await generateSupportedNetworksDoc()
    console.log('✅')
  } catch(err) {
    console.log('❌')
    console.log(err)
    process.exitCode = 1;
  }
}



main()
