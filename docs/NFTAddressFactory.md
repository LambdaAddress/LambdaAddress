## NFTAddressFactory

<blockquote>
Main Factory used to mint and deploy NFT addresses.

</blockquote>

<br />
<font size="3">

```solidity
constructor(contract Registrar registrar) public
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **registrar** | `contract Registrar` | Address of the Registrar |

</details>
</div>

<br />
<font size="3">

```solidity
function deploy(address nftAddress, bytes creationCode) public
```
</font>

<blockquote style="margin-top: -8px;">

Deploys a smart contract to an NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **nftAddress** | `address` | NFT address |
| **creationCode** | `bytes` | Smart contract bytecode (i.e. bytecode containing the constructor and initialization data) |

</details>
</div>

<br />
<font size="3">

```solidity
function getAddress(address mintedBy, uint256 salt) public view returns (address payable)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the NFT address created by `mintedBy` with `salt`

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **mintedBy** | `address` | Account that minted the NFT address |
| **salt** | `uint256` | Salt used to generate the NFT address |

</details>
</div>

<br />
<font size="3">

```solidity
function mint(address mintedBy, uint256 salt) external returns (address payable)
```
</font>

<blockquote style="margin-top: -8px;">

Mints a new NFT address, created by `mintedBy` with `salt`

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **mintedBy** | `address` | Account that is minting the NFT address |
| **salt** | `uint256` | Salt used to generate the NFT address |

</details>
</div>

