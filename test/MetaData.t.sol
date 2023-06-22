// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Errors} from "../src/contracts/Errors.sol";
import {MetaData} from "../src/contracts/MetaData.sol";
import {NFTAddressFactory} from "../src/contracts/NFTAddressFactory.sol";
import {Registrar} from "../src/contracts/Registrar.sol";
import {RegistrarProxy} from "../src/contracts/RegistrarProxy.sol";
import {SafeCreate3} from "../src/contracts/SafeCreate3.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {StringHelper} from "./utils/StringHelper.sol";

contract MetaDataTest is Test {
  using StringHelper for string;
  uint256 public constant MINT_PRICE = 10000000000000000;
  uint96 internal constant _ROYALTIES = 500;

  Registrar public registrarLogic;
  MetaData public metaData;
  RegistrarProxy public proxy;
  NFTAddressFactory public factory;
  Registrar public registrar;

  function setUp() public {
    metaData = new MetaData();
    registrarLogic = new Registrar();
    bytes memory data = abi.encodeWithSelector(
      registrar.initialize.selector,
      MINT_PRICE,
      _ROYALTIES,
      payable(address(this)),
      metaData,
      address(this)
    );
    proxy = new RegistrarProxy(address(registrarLogic), data);
    registrar = Registrar(address(proxy));
    factory = new NFTAddressFactory(registrar);

    //registrar.initialize(MINT_PRICE, _ROYALTIES, payable(address(this)), metaData);
    registrar.allowFactory(factory, true);
  }

  function testGetTokenURI(uint256 tokenId) public {
    console.log("Should be base64 encoded.");

    vm.assume(tokenId < type(uint160).max);
    string memory tokenURI = metaData.getTokenURI(tokenId, registrar);
    assertEq(tokenURI.startsWith("data:application/json;base64,"), true);
  }

  function testGetImageContainsAddress(uint256 tokenId) public {
    console.log("Should contain the address.");

    vm.assume(tokenId < type(uint160).max);
    address nftAddress = address(uint160(tokenId));
    string memory image = metaData.getImage(tokenId, registrar);
    assertEq(image.contains(Strings.toHexString(nftAddress)), true);
  }

  function testGetImageSVG(uint256 tokenId) public {
    console.log("Should be a SVG.");

    vm.assume(tokenId < type(uint160).max);

    string memory image = metaData.getImage(tokenId, registrar);
    assertEq(image.startsWith("<svg"), true);
  }

  function testGetMetaDataContainsName(uint256 tokenId) public {
    console.log("Should contain the name.");

    vm.assume(tokenId < type(uint160).max);

    string memory meta = metaData.getMetaData(tokenId, registrar);
    assertEq(meta.contains('"name"'), true);
  }

  function testGetMetaDataContainsImage(uint256 tokenId) public {
    console.log("Should contain the image.");

    vm.assume(tokenId < type(uint160).max);

    string memory meta = metaData.getMetaData(tokenId, registrar);
    assertEq(meta.contains('"image"'), true);
  }

  function testGetMetaDataContainsDescription(uint256 tokenId) public {
    console.log("Should contain the description.");

    vm.assume(tokenId < type(uint160).max);

    string memory meta = metaData.getMetaData(tokenId, registrar);
    assertEq(meta.contains('"description"'), true);
  }
}
