## SafeCreate3

<blockquote>
Variant of solmate's CREATE3 with front running protection

Since `deploy(...)` is always called from the same address (i.e. the Factory),
NFT address registration could technically be front run. To mitigate this, we add
at the begining of the bytecode the address of the account that creates it.
e.g.: PUSH20 `createdBy`. This operation doesn't do anything other than prevent
front running. The rest of the library is practically identical to solmate's CREATE3.
</blockquote>

<br />
<font size="3">

```solidity
function deploy(bytes32 salt, address createdBy, bytes creationCode, uint256 value) internal returns (address deployed)
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
function getDeployed(bytes32 salt, address createdBy) internal view returns (address)
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
function getBytecode(address createdBy) internal pure returns (bytes)
```
</font>

<blockquote style="margin-top: -8px;">

Adds "PUSH20 `createdBy`" and POP to solmate's CREATE3 deploy bytecode
to prevent frontrunning.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **createdBy** | `address` | Address of the account that creates the smart contract |

</details>
</div>

<br />
<font size="3">

```solidity
function getBytecodeHash(address createdBy) internal pure returns (bytes32)
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

</details>
</div>

