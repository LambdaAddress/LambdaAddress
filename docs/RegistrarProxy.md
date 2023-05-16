## RegistrarProxy

<blockquote>
Proxy used to upgrade and delegate logic to Registrar. All interactions with
the Registrar should be made through this proxy.

</blockquote>

<br />
<font size="3">

```solidity
constructor(address implementation) public
```
</font>

<blockquote style="margin-top: -8px;">

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **implementation** | `address` | Address of the Registrar |

</details>
</div>

<br />
<font size="3">

```solidity
function upgradeTo(address newImplementation) external
```
</font>

<blockquote style="margin-top: -8px;">

Upgrades the implementation logic of the proxy.

</blockquote>

<div style="padding-left: 20px;">

<details>
<summary><i>Parameters</i></summary>

| Name | Type | Description |
| ---- | ---- | ----------- |
| **newImplementation** | `address` | Address of the new Registrar |

</details>
</div>

