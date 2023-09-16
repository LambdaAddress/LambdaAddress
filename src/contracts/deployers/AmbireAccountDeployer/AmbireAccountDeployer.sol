// SPDX-License-Identifier: MIT
// Based on https://github.com/AmbireTech/wallet/blob/main/contracts/AmbireAccountFactory.sol
pragma solidity ^0.8.7;

import {AmbireAccount} from "./AmbireAccount.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Registrar} from "../../Registrar.sol";

/// @title AmbireAccountDeployer
/// @dev Contract is almost identical to Ambire's AmbireAccountFactory, with
/// for one main difference: Instead of using the provided salt to generate
/// the account, we use LambdaAddress's Registrar to deploy it. The `salt`
/// parameter is thus replaced with the actual tokenId of the LambdaAddress
/// NFT. We can therefore keep the exact same function signatures as the
/// original AmbireAccountFactory.
contract AmbireAccountDeployer {
  event LogDeployed(address addr, uint256 salt);

  Registrar private _registrar;

  /// @param registrar Address of the LambdaAddress Registrar
  constructor(Registrar registrar) {
    _registrar = registrar;
  }

  function deploy(bytes calldata code, uint256 tokenId) external returns (address) {
    return deploySafe(tokenId, code);
  }

  // When the relayer needs to act upon an /identity/:addr/submit call, it'll either call execute on the AmbireAccount directly
  // if it's already deployed, or call `deployAndExecute` if the account is still counterfactual
  // we can't have deployAndExecuteBySender, because the sender will be the factory
  function deployAndExecute(
    bytes calldata code,
    uint256 tokenId,
    AmbireAccount.Transaction[] calldata txns,
    bytes calldata signature
  ) external {
    address payable addr = payable(deploySafe(tokenId, code));
    AmbireAccount(addr).execute(txns, signature);
  }

  // but for the quick accounts we need this
  function deployAndCall(
    bytes calldata code,
    uint256 tokenId,
    address callee,
    bytes calldata data
  ) external {
    deploySafe(tokenId, code);
    require(data.length > 4, "DATA_LEN");
    bytes4 method;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      // can also do shl(224, shr(224, calldataload(0)))
      method := and(
        calldataload(data.offset),
        0xffffffff00000000000000000000000000000000000000000000000000000000
      )
    }
    require(
      method == 0x6171d1c9 || // execute((address,uint256,bytes)[],bytes)
        method == 0x534255ff || // send(address,(uint256,address,address),(bool,bytes,bytes),(address,uint256,bytes)[])
        method == 0x4b776c6d || // sendTransfer(address,(uint256,address,address),(bytes,bytes),(address,address,uint256,uint256))
        method == 0x63486689, // sendTxns(address,(uint256,address,address),(bytes,bytes),(string,address,uint256,bytes)[])
      "INVALID_METHOD"
    );

    assembly {
      let dataPtr := mload(0x40)
      calldatacopy(dataPtr, data.offset, data.length)
      let result := call(gas(), callee, 0, dataPtr, data.length, 0, 0)

      switch result
      case 0 {
        let size := returndatasize()
        let ptr := mload(0x40)
        returndatacopy(ptr, 0, size)
        revert(ptr, size)
      }
      default {

      }
    }
  }

  // This is done to mitigate possible frontruns where, for example, deploying the same code/salt via deploy()
  // would make a pending deployAndExecute fail
  // The way we mitigate that is by checking if the contract is already deployed and if so, we continue execution
  function deploySafe(uint256 tokenId, bytes memory code) internal returns (address) {
    _registrar.deploy(tokenId, code);
    address addr = address(uint160(tokenId));
    emit LogDeployed(addr, tokenId);
    return addr;
  }
}
