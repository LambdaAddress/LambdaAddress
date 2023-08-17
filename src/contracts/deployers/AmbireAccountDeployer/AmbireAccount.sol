// SPDX-License-Identifier: agpl-3.0
// Based on https://github.com/AmbireTech/wallet/blob/main/contracts/AmbireAccount.sol
pragma solidity ^0.8.7;

interface AmbireAccount {
	// Events
	event LogPrivilegeChanged(address indexed addr, bytes32 priv);
	event LogErr(address indexed to, uint value, bytes data, bytes returnData); // only used in tryCatch
	event LogScheduled(bytes32 indexed txnHash, bytes32 indexed recoveryHash, address indexed recoveryKey, uint nonce, uint time, Transaction[] txns);
	event LogCancelled(bytes32 indexed txnHash, bytes32 indexed recoveryHash, address indexed recoveryKey, uint time);
	event LogExecScheduled(bytes32 indexed txnHash, bytes32 indexed recoveryHash, uint time);

	// Transaction structure
	// we handle replay protection separately by requiring (address(this), chainID, nonce) as part of the sig
	struct Transaction {
		address to;
		uint value;
		bytes data;
	}
	struct RecoveryInfo {
		address[] keys;
		uint timelock;
	}

	function onERC721Received(address, address, uint256, bytes memory) external pure returns (bytes4);
	function onERC1155Received(address, address, uint256, uint256, bytes memory) external pure returns (bytes4);
	function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) external pure returns (bytes4);

	function setAddrPrivilege(address addr, bytes32 priv) external;

	// Useful when we need to do multiple operations but ignore failures in some of them
	function tryCatch(address to, uint value, bytes calldata data) external;
	function tryCatchLimit(address to, uint value, bytes calldata data, uint gasLimit) external;

	// WARNING: if the signature of this is changed, we have to change IdentityFactory
	function execute(Transaction[] calldata txns, bytes calldata signature) external;

	// built-in batching of multiple execute()'s; useful when performing timelocked recoveries
	struct ExecuteArgs { Transaction[] txns; bytes signature; }
	function executeMultiple(ExecuteArgs[] calldata toExec) external;

	// no need for nonce management here cause we're not dealing with sigs
	function executeBySender(Transaction[] calldata txns) external;

	function executeBySelf(Transaction[] calldata txns) external;

	// EIP 1271 implementation
	// see https://eips.ethereum.org/EIPS/eip-1271
	function isValidSignature(bytes32 hash, bytes calldata signature) external view returns (bytes4);

	// EIP 1155 implementation
	// we pretty much only need to signal that we support the interface for 165, but for 1155 we also need the fallback function
	function supportsInterface(bytes4 interfaceID) external pure returns (bool);
}