/**
 * Javascript version of `NFTAddressFactory.getDeployCode(address generatedBy)`
 * 
 * @param {string} generatedBy Address of the account generating the NFTAddress
 */
export default function getDeployCode(generatedBy) {
    return '' +
    '0x73' + // PUSH20
    generatedBy.replace('0x', '') + 
    '50' + // POP
    '67363d3d37363d34f03d5260086018f3'
}