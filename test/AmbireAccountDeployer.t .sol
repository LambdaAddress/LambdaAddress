// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {MetaData} from "../src/contracts/MetaData.sol";
import {IFactory} from "../src/contracts/IFactory.sol";
import {NFTAddressFactory} from "../src/contracts/NFTAddressFactory.sol";
import {Registrar} from "../src/contracts/Registrar.sol";
import {RegistrarProxy} from "../src/contracts/RegistrarProxy.sol";
import {AmbireAccountDeployer} from "../src/contracts/deployers/AmbireAccountDeployer/AmbireAccountDeployer.sol";

contract AmbireAccountDeployerTest is Test {
  uint256 public constant _MINT_PRICE = 10000000000000000;
  uint96 internal constant _ROYALTIES = 500;

  Registrar internal _registrarLogic;
  MetaData internal _metaData;
  RegistrarProxy internal _proxy;
  NFTAddressFactory internal _addressFactory;
  Registrar internal _registrar;

  AmbireAccountDeployer _deployer;

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
    _addressFactory = new NFTAddressFactory(_registrar);

    _registrar.allowFactory(_addressFactory, true);

    _deployer = new AmbireAccountDeployer(_registrar);
  }

  function testDeploy() public {
    console.log("Should deploy the correct Ambire Account at the right address.");

    // Account initialization payload
    bytes
      memory initializer = hex"7f00000000000000000000000000000000000000000000000000000000000000017fdcc8c0bee2788aa0bee69a60464021a3ab79999acd41c1a7f5936e87f673beea553d602d80604d3d3981f3363d3d373d3d3d363d732a2b85eb1054d6f0c6c2e37da05ed3e5fea684ef5af43d82803e903d91602b57fd5bf3";

    uint256 tokenId = _registrar.mint{value: _MINT_PRICE}(_addressFactory, 0x123457);
    _registrar.approveDeployer(address(_deployer), tokenId);

    address newAccount = _deployer.deploy(initializer, tokenId);

    assertEq(address(uint160(tokenId)), newAccount);

    assertEq(
      newAccount.code,
      hex"363d3d373d3d3d363d732a2b85eb1054d6f0c6c2e37da05ed3e5fea684ef5af43d82803e903d91602b57fd5bf3"
    );
  }
}
