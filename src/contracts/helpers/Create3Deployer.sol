// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {CREATE3} from "solmate/src/utils/CREATE3.sol";

/**
 * @title CREATE3 Deployer Smart Contract
 */
contract Create3Deployer {
  event Deploy(address indexed sender, bytes32 salt, address deployed);

  /**
   * @dev Deploys a contract using solmate's `CREATE3`. The address where the
   * contract will be deployed can be known in advance via {computeAddress}.
   */
  function deploy(uint256 value, bytes32 salt, bytes memory code) external returns (address) {
    bytes32 computedSalt = keccak256(abi.encodePacked(msg.sender, salt));
    address deployed = CREATE3.deploy(computedSalt, code, value);
    emit Deploy(msg.sender, salt, deployed);
    return deployed;
  }

  /**
   * @dev Returns the address where a contract will be stored if deployed via {deploy}.
   */
  function computeAddress(bytes32 salt) external view returns (address) {
    bytes32 computedSalt = keccak256(abi.encodePacked(msg.sender, salt));
    return CREATE3.getDeployed(computedSalt);
  }
}
