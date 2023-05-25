import { Bytes } from "@graphprotocol/graph-ts"
import {
  Deploy as DeployEvent,
  Transfer as TransferEvent,
  Registrar
} from "../generated/Registrar/Registrar"
import { LambdaAddress } from "../generated/schema"


export function handleDeploy(event: DeployEvent): void {
  let lambdaAddress = LambdaAddress.load(event.params.tokenId.toString())

  if (lambdaAddress) {
    lambdaAddress.isDeployed = true
    lambdaAddress.save()
  }
}


export function handleTransfer(event: TransferEvent): void {
  let lambdaAddress = LambdaAddress.load(event.params.tokenId.toString())
  const tokenId = event.params.tokenId

  if (!lambdaAddress) {
    lambdaAddress = new LambdaAddress(event.params.tokenId.toString())
    lambdaAddress.tokenId = tokenId
    lambdaAddress.address = Bytes.fromByteArray(Bytes.fromBigInt(tokenId))
    lambdaAddress.isDeployed = false
    
    const registrar = Registrar.bind(event.address)
    lambdaAddress.tokenURI = registrar.tokenURI(tokenId)
  }

  lambdaAddress.owner = event.params.to
  lambdaAddress.save()
}
