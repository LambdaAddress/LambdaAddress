## Registrar

<blockquote>
Main contract to mint and query NFT addresses. Only addresses for smart contracts
can be minted, no EOA. This contract implements the ERC721 standard.

This contract is meant to be initialized with a proxy, and every interaction should
be through the proxy. Logic is further divided into 2 main contracts:
  - [IFactory](IFactory.md): Registration, validation and deployment of NFT addresses
  - [IMetaData](IMetaData.md): Generating the metadata for the NFT addresses.

The ID of an NFT address is simply its value casted to `uint256`.
</blockquote>

<br />
<font size="3">

```solidity
event Deploy(address deployer, uint256 tokenId)
```
</font>

<blockquote style="margin-top: -8px;">

Emitted when a contract is deployed to the `tokenId` NFT address.

</blockquote>

<div style="padding-left: 20px; margin-bottom: 24px">

</div>

<br />
<font size="3">

```solidity
event DeployerApproval(address owner, address approved, uint256 tokenId)
```
</font>

<blockquote style="margin-top: -8px;">

Emitted when `owner` enables `approved` to deploy to the `tokenId` NFT address.

</blockquote>

<div style="padding-left: 20px; margin-bottom: 24px">

</div>

<br />

### uint96 _royalties

<blockquote>

</blockquote>

<br />

### address payable _royaltiesRecipient

<blockquote>

</blockquote>

<br />
<font size="3">

```solidity
function initialize(uint256 mintPrice, uint96 royalties, address payable royaltiesRecipient, contract IMetaData metaData) external
```
</font>

<blockquote style="margin-top: -8px;">

Initializes the registrar

Function is invoked by the proxy contract during main deployment

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **mintPrice** | `uint256` | Price in wei to mint a new NFT address |
| **royalties** | `uint96` |  |
| **royaltiesRecipient** | `address payable` |  |
| **metaData** | `contract IMetaData` | IMetaData contract to handle metadata generation |

</details>
</div>

<br />
<font size="3">

```solidity
function allowFactory(contract IFactory factory, bool allow) external
```
</font>

<blockquote style="margin-top: -8px;">

Allow/disallow a factory

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **factory** | `contract IFactory` | IFactory contract |
| **allow** | `bool` | Allow/disallow the factory |

</details>
</div>

<br />
<font size="3">

```solidity
function approveDeployer(address deployer, uint256 tokenId) external
```
</font>

<blockquote style="margin-top: -8px;">

Approve `deployer` to deploy to the `tokenId` NFT address.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **deployer** | `address` | Account that can deploy a smart contract |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function isFactoryAllowed(contract IFactory factory) external view returns (bool)
```
</font>

<blockquote style="margin-top: -8px;">

Returns `true` if factory is allowed to mint new NFT addresses

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **factory** | `contract IFactory` | Factory |

</details>
</div>

<br />
<font size="3">

```solidity
function deploy(uint256 tokenId, bytes creationCode) external
```
</font>

<blockquote style="margin-top: -8px;">

Deploys a smart contract to the NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |
| **creationCode** | `bytes` | Creation bytecode of the smart contract |

</details>
</div>

<br />
<font size="3">

```solidity
function getAddressId(address nftAddress) external pure returns (uint256)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the ID for an NFT address.

The ID is the address' value casted to uint256. Hence there
can't be any ID larger than 20 bytes.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **nftAddress** | `address` | NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function getAddressDifficulty(uint256 tokenId) external pure returns (uint8)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the number of consecutive identical characters in an NFT address.
The higher the number, the greater the difficulty to generate the address.
`e.g.: 0x6e495383a99fde33333337cae062d75153fa2608 -> 7`

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function getApprovedDeployer(uint256 tokenId) external view returns (address)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the approved deployer for a given NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function getFactory(uint256 tokenId) public view returns (contract IFactory)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the Factory used to mint and deploy an NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function getMintedBy(uint256 tokenId) external view returns (address)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the address of the account that minted the NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function getIsDeployed(uint256 tokenId) external view returns (bool)
```
</font>

<blockquote style="margin-top: -8px;">

Returns `true` if a smart contract has been deployed to the NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function mint(contract IFactory factory, uint256 salt) external payable returns (uint256 tokenId)
```
</font>

<blockquote style="margin-top: -8px;">

Mint a new NFT address. This function doesn't deploy a smart contract
to the address.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **factory** | `contract IFactory` | Factory used to mint and deploy the NFT address |
| **salt** | `uint256` | Salt used to generate the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function royaltyInfo(uint256, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **** | `uint256` |  |
| **salePrice** | `uint256` | Sale price of the NFT asset specified by `tokenId` |

*Returns:*
| Name | Type | Description |
| ---- | ---- | ----------- |
| **receiver** | `address` | Address of who should be sent the royalty payment |
| **royaltyAmount** | `uint256` | Royalty payment amount for `salePrice` |

</details>
</div>

<br />
<font size="3">

```solidity
function setMetaData(contract IMetaData metaData) external
```
</font>

<blockquote style="margin-top: -8px;">

Set the contract used to generate metadata for the NFT addresses

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **metaData** | `contract IMetaData` | IMetaData contract address |

</details>
</div>

<br />
<font size="3">

```solidity
function setMintPrice(uint256 mintPrice) external
```
</font>

<blockquote style="margin-top: -8px;">

Set the price of minting NFT addresses, in wei.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **mintPrice** | `uint256` | Mint price in wei |

</details>
</div>

<br />
<font size="3">

```solidity
function setRoyalties(uint96 royalties) external
```
</font>

<blockquote style="margin-top: -8px;">

Sets the sales royalties in basis points. (e.g. 500 = 5%)

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **royalties** | `uint96` | Sales royalties in basis points |

</details>
</div>

<br />
<font size="3">

```solidity
function setRoyaltiesRecipient(address payable recipient) external
```
</font>

<blockquote style="margin-top: -8px;">

Sets the sales royalties recipient address.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **recipient** | `address payable` | Sales royalties recipient address. |

</details>
</div>

<br />
<font size="3">

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```
</font>

<blockquote style="margin-top: -8px;">

Returns true if this contract implements the interface defined by
`interfaceId`. See
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified

</blockquote>

<div style="padding-left: 20px;">

</details>
</div>

<br />
<font size="3">

```solidity
function tokenURI(uint256 tokenId) public view returns (string)
```
</font>

<blockquote style="margin-top: -8px;">

Returns an URI for a given token ID. The URI is generated
by [IMetaData](IMetaData.md).

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function transferFunds(uint256 amount, address payable to) public
```
</font>

<blockquote style="margin-top: -8px;">

Withdraw `amount` of wei from this contract and transfer it to recipient `to`.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **amount** | `uint256` | Amount of wei to withdraw |
| **to** | `address payable` | Address of the recipient |

</details>
</div>

<br />
<font size="3">

```solidity
function _approveDeployer(address deployer, uint256 tokenId) internal
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

</details>
</div>

<br />
<font size="3">

```solidity
function _beforeTokenTransfer(address, address, uint256 tokenId) internal virtual
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

</details>
</div>

<br />
<font size="3">

```solidity
function _canDeploy(uint256 tokenId, address deployer) internal view returns (bool)
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

</details>
</div>

<br />
<font size="3">

```solidity
function _mint(address payable addr, address mintedBy, contract IFactory factory) internal
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

</details>
</div>

