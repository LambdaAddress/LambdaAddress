## IFactory

<blockquote>

Factories are used to register and deploy NFT addresses.
</blockquote>

<br />
<font size="3">

```solidity
function deploy(address nftAddress, bytes creationCode) external
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
function mint(address owner, uint256 salt) external returns (address payable)
```
</font>

<blockquote style="margin-top: -8px;">

Mints a new NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **owner** | `address` | Owner of the NFT address |
| **salt** | `uint256` | Salt used to generate the NFT Address |

</details>
</div>

