import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Deploy as DeployEvent,
  Transfer as TransferEvent,
  Registrar
} from "./generated/Registrar/Registrar"
import { LambdaAddress } from "./generated/schema"


export function handleDeploy(event: DeployEvent): void {
  let lambdaAddress = LambdaAddress.load(event.params.tokenId.toString())

  if (lambdaAddress) {
    lambdaAddress.isDeployed = true
    lambdaAddress.save()
  }
}


export function handleTransfer(event: TransferEvent): void {
  const tokenId = event.params.tokenId
  let lambdaAddress = LambdaAddress.load(tokenId.toString())

  if (!lambdaAddress) {
    lambdaAddress = new LambdaAddress(tokenId.toString())
    lambdaAddress.address = hexToAddress(tokenId.toHexString())
    lambdaAddress.isDeployed = false
    lambdaAddress.mintTime = event.block.timestamp
    
    const registrar = Registrar.bind(event.address)
    lambdaAddress.tokenURI = registrar.tokenURI(tokenId)
  }

  lambdaAddress.owner = event.params.to
  lambdaAddress.save()
}


function hexToAddress(hex: string): Bytes {
  const paddedHex = hex.slice(2).padStart(40, '0')
  return Address.fromHexString(`0x${paddedHex}`)
}