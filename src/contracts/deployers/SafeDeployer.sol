// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Errors} from "../Errors.sol";
import {GnosisSafeProxy} from "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxy.sol";
import {GnosisSafeFactory} from "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";
import {Registrar} from "../Registrar.sol";

/// @title 
/// @notice 
contract SafeDeployer is GnosisSafeProxyFactory {
  Registrar private _registrar;

  /// @param registrar Address of the Registrar
  constructor(Registrar registrar) {
    _registrar = registrar;
  }

  /// @dev Allows to create new proxy contact using CREATE2 but it doesn't run the initializer.
  ///      This method is only meant as an utility to be called from other methods
  /// @param tokenId
  /// @param _singleton Address of singleton contract.
  /// @param initializer Payload for message call sent to new proxy contract.
  /// @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.
  function deployProxyWithRegistrar(
    uint256 tokenId,
    address _singleton,
    bytes memory initializer/*,
    uint256 saltNonce*/
  ) internal returns (GnosisSafeProxy proxy) {
      // If the initializer changes the proxy address should change too. Hashing the initializer data is cheaper than just concatinating it
      bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
      bytes memory deploymentData = abi.encodePacked(type(GnosisSafeProxy).creationCode, uint256(uint160(_singleton)));
      // solhint-disable-next-line no-inline-assembly
      /*
      assembly {
          proxy := create2(0x0, add(0x20, deploymentData), mload(deploymentData), salt)
      }*/
      _registrar.deploy(tokenId, deploymentData);
      //require(address(proxy) != address(0), "Create2 call failed");
      return GnosisSafeProxy(address(uint160(tokenId)));
  }

  /// @notice 
  /// @param tokenId
  /// @param _singleton 
  /// @param initializer 
  function deploy(uint256 tokenId, address _singleton, bytes initializer) public returns (GnosisSafeProxy proxy) {
    proxy = deployProxyWithRegistrar(_singleton, initializer, saltNonce);
    if (initializer.length > 0)
        // solhint-disable-next-line no-inline-assembly
        assembly {
            if eq(call(gas(), proxy, 0, add(initializer, 0x20), mload(initializer), 0, 0), 0) {
                revert(0, 0)
            }
        }
    emit ProxyCreation(proxy, _singleton);
  }
 

}
