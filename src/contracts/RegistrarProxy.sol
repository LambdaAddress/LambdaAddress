// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Errors} from "./Errors.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/// @title RegistrarProxy
/// @notice Proxy used to upgrade and delegate logic to Registrar. All interactions with
/// the Registrar should be made through this proxy.
contract RegistrarProxy is ERC1967Proxy {
  /// @param implementation Address of the Registrar
  /// @param data Initialization call data
  constructor(address implementation, bytes memory data) ERC1967Proxy(implementation, data) {}

  /// @notice Upgrades the implementation logic of the proxy.
  /// @param newImplementation Address of the new Registrar
  function upgradeTo(address newImplementation) external {
    require(Ownable(address(this)).owner() == msg.sender, Errors.OWNABLE_NOT_OWNER);
    _upgradeTo(newImplementation);
  }
}
