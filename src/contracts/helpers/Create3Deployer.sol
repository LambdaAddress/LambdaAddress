// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {CREATE3} from "solmate/src/utils/CREATE3.sol";

/**
 * @title CREATE3 Deployer Smart Contract
 */
contract Create3Deployer {
  /**
   * @dev Deploys a contract using solmate's `CREATE3`. The address where the
   * contract will be deployed can be known in advance via {computeAddress}.
   */
  function deploy(uint256 value, bytes32 salt, bytes memory code) public {
    CREATE3.deploy(salt, code, value);
  }

  /**
   * @dev Returns the address where a contract will be stored if deployed via {deploy}.
   */
  function computeAddress(bytes32 salt) public view returns (address) {
    return CREATE3.getDeployed(salt);
  }
}
