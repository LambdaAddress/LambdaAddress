// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {GnosisSafe} from "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import {GnosisSafeProxy} from "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxy.sol";
import {GnosisSafeProxyFactory} from "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";
import {Registrar} from "../Registrar.sol";

/// @title SafeDeployer
/// @notice Deploys a Gnosis Safe to a NFT Address
contract SafeDeployer is GnosisSafeProxyFactory {
  Registrar private _registrar;

  /// @param registrar Address of the Registrar
  constructor(Registrar registrar) {
    _registrar = registrar;
  }

  /// @notice Deploys a Gnosis Safe to a Lambda Address
  /// @param tokenId ID of the NFT Address
  /// @param singleton Address of Gnosis Safe singleton contract
  /// @param initializer Payload for message call sent to new proxy contract
  function deploy(
    uint256 tokenId,
    address singleton,
    bytes memory initializer
  ) public returns (GnosisSafeProxy proxy) {
    bytes memory deploymentData = abi.encodePacked(
      type(GnosisSafeProxy).creationCode,
      uint256(uint160(singleton))
    );
    _registrar.deploy(tokenId, deploymentData);
    if (initializer.length > 0) {
      // solhint-disable-next-line no-inline-assembly
      assembly {
        if eq(call(gas(), proxy, 0, add(initializer, 0x20), mload(initializer), 0, 0), 0) {
          revert(0, 0)
        }
      }
    }
    proxy = GnosisSafeProxy(payable(address(uint160(tokenId))));
    emit ProxyCreation(proxy, singleton);
  }
}
