// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {IERC721Upgradeable, IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Errors} from "../src/contracts/Errors.sol";
import {MetaData} from "../src/contracts/MetaData.sol";
import {NFTAddressFactory} from "../src/contracts/NFTAddressFactory.sol";
import {Registrar} from "../src/contracts/Registrar.sol";
import {RegistrarProxy} from "../src/contracts/RegistrarProxy.sol";

contract RegistrarProxyTest is Test {
  bytes32 internal constant _IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
  uint256 internal constant MINT_PRICE = 10000000000000000;

  Registrar internal registrarLogic;
  MetaData internal metaData;
  RegistrarProxy internal proxy;
  NFTAddressFactory internal factory;
  Registrar internal registrar;

  function setUp() public {
    metaData = new MetaData();
    registrarLogic = new Registrar();
    bytes memory data = abi.encodeWithSelector(
      registrar.initialize.selector,
      MINT_PRICE,
      metaData,
      address(this)
    );
    proxy = new RegistrarProxy(address(registrarLogic), data);
    registrar = Registrar(address(proxy));
    factory = new NFTAddressFactory(registrar);

    registrar.allowFactory(factory, true);
  }

  function testUpgradeTo() public {
    console.log("Should set the implementation logic to the right address.");

    Registrar newRegistrarLogic = new Registrar();
    proxy.upgradeTo(address(newRegistrarLogic));
    bytes32 implementation = vm.load(address(proxy), _IMPLEMENTATION_SLOT);
    assertEq(address(uint160(uint256(implementation))), address(newRegistrarLogic));
  }

  function testUpgradeToFromNewOwner() public {
    console.log("New owner should be able to upgrade.");

    address newOwner = 0xc02aAA3bbBBBbE8d0A0E5c4F27EAd9083c756cC2;
    vm.deal(newOwner, 10 ether);
    registrar.transferOwnership(newOwner);

    Registrar newRegistrarLogic = new Registrar();
    vm.prank(newOwner);
    proxy.upgradeTo(address(newRegistrarLogic));
    bytes32 implementation = vm.load(address(proxy), _IMPLEMENTATION_SLOT);
    assertEq(address(uint160(uint256(implementation))), address(newRegistrarLogic));
  }

  function testUpgradeToNotFromOwner(address from) public {
    console.log("Should revert when not called by owner.");

    vm.assume(from != address(this));
    vm.deal(from, 10 ether);
    Registrar newRegistrarLogic = new Registrar();
    vm.prank(from);
    vm.expectRevert();
    proxy.upgradeTo(address(newRegistrarLogic));
  }
}
