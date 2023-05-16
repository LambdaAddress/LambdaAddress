## IMetaData

<blockquote>
The metadata of NFT addresses is fully generated on-chain, including the SVG image.

The metadata logic is encapsulated here so it can be easier to update without doing
a full upgrade of the Registrar.
</blockquote>

<br />
<font size="3">

```solidity
function getTokenURI(uint256 tokenId, contract Registrar registrar) external view returns (string)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the URI for an NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |
| **registrar** | `contract Registrar` | Registrar |

</details>
</div>

<br />
<font size="3">

```solidity
function getImage(uint256 tokenId, contract Registrar registrar) external view returns (string)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the SVG image for an NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |
| **registrar** | `contract Registrar` | Registrar |

</details>
</div>

<br />
<font size="3">

```solidity
function getMetaData(uint256 tokenId, contract Registrar registrar) external view returns (string)
```
</font>

<blockquote style="margin-top: -8px;">

Returns the metadata for and NFT address

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **tokenId** | `uint256` | ID of the NFT address |
| **registrar** | `contract Registrar` | Registrar |

</details>
</div>

