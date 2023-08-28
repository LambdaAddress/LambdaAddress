// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {GnosisSafe} from "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import {GnosisSafeProxy} from "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxy.sol";
import {MetaData} from "../src/contracts/MetaData.sol";
import {IFactory} from "../src/contracts/IFactory.sol";
import {NFTAddressFactory} from "../src/contracts/NFTAddressFactory.sol";
import {Registrar} from "../src/contracts/Registrar.sol";
import {RegistrarProxy} from "../src/contracts/RegistrarProxy.sol";
import {SafeDeployer} from "../src/contracts/deployers/SafeDeployer.sol";

contract SafeeployerTest is Test {
  uint256 public constant _MINT_PRICE = 10000000000000000;
  uint96 internal constant _ROYALTIES = 500;

  Registrar internal _registrarLogic;
  MetaData internal _metaData;
  RegistrarProxy internal _proxy;
  NFTAddressFactory internal _factory;
  Registrar internal _registrar;

  GnosisSafe _singleton;
  SafeDeployer _deployer;

  function setUp() public {
    _metaData = new MetaData();
    _registrarLogic = new Registrar();
    bytes memory data = abi.encodeWithSelector(
      _registrar.initialize.selector,
      _MINT_PRICE,
      _ROYALTIES,
      payable(address(this)),
      _metaData,
      address(this)
    );
    _proxy = new RegistrarProxy(address(_registrarLogic), data);
    _registrar = Registrar(address(_proxy));
    _factory = new NFTAddressFactory(_registrar);

    _registrar.allowFactory(_factory, true);

    _deployer = new SafeDeployer(_registrar);

    _singleton = new GnosisSafe();
  }

  function testDeploy() public {
    console.log("Should deploy the correct Gnosis Safe at the right address.");

    // Gnosis Safe initialization payload with the following parameters:
    // owners: [0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266]
    // threshold: 1
    bytes
      memory initializer = hex"b63e800d000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000";

    uint256 tokenId = _registrar.mint{value: _MINT_PRICE}(_factory, 0x123457);
    _registrar.approveDeployer(address(_deployer), tokenId);

    GnosisSafeProxy safe = _deployer.deploy(tokenId, address(_singleton), initializer);

    assertEq(address(uint160(tokenId)), address(safe));

    bytes32 slot0Content = vm.load(address(safe), bytes32(uint256(0)));
    assertEq(address(uint160(uint256(slot0Content))), address(_singleton));
  }
}
