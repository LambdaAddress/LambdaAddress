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

contract NFTAddressFactoryTest is Test {
  using SafeCreate3 for NFTAddressFactory;

  uint256 public constant MINT_PRICE = 10000000000000000;
  bytes public constant SAMPLE_BYTECODE =
    hex"608060405234801561001057600080fd5b5060e58061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c8063c9482a5d146037578063e221818b146051575b600080fd5b603f60005481565b60405190815260200160405180910390f35b6060605c3660046071565b6062565b005b606b8160016089565b60005550565b600060208284031215608257600080fd5b5035919050565b8082018082111560a957634e487b7160e01b600052601160045260246000fd5b9291505056fea264697066735822122017ddbc8df9be6719ca6aea10225d9f2960b76806e3e22e63760fee306b7ec65c64736f6c63430008120033";
  bytes internal constant SAMPLE_BYTECODE_DEPLOYED =
    hex"6080604052348015600f57600080fd5b506004361060325760003560e01c8063c9482a5d146037578063e221818b146051575b600080fd5b603f60005481565b60405190815260200160405180910390f35b6060605c3660046071565b6062565b005b606b8160016089565b60005550565b600060208284031215608257600080fd5b5035919050565b8082018082111560a957634e487b7160e01b600052601160045260246000fd5b9291505056fea264697066735822122017ddbc8df9be6719ca6aea10225d9f2960b76806e3e22e63760fee306b7ec65c64736f6c63430008120033";
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

  function testDeploy() public {
    console.log(
      "Should deploy the right bytecode at the right address when calling deploy() from Registrar"
    );

    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, 0x0001);
    address nftAddress = address(uint160(tokenId));
    vm.deal(address(registrar), 10 ether);
    vm.prank(address(registrar));

    factory.deploy(nftAddress, SAMPLE_BYTECODE);
    assertEq(nftAddress.code, SAMPLE_BYTECODE_DEPLOYED);
  }

  function testDeployNotCalledFromRegistrar(address from) public {
    console.log("Should revert when calling deploy() not from Registrar");

    vm.assume(from != address(registrar));
    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, 0x0001);
    address nftAddress = address(uint160(tokenId));
    vm.deal(from, 10 ether);
    vm.prank(from);

    vm.expectRevert(abi.encodePacked(Errors.NOT_REGISTRAR));
    factory.deploy(nftAddress, SAMPLE_BYTECODE);
  }

  function testDeployInvalidAddress() public {
    console.log("Should revert when deploying an invalid address");

    vm.deal(address(registrar), 10 ether);
    vm.prank(address(registrar));

    vm.expectRevert(abi.encodePacked(Errors.INVALID_ADDRESS_CREATED));
    factory.deploy(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, SAMPLE_BYTECODE);
  }

  function testGetAddress(address mintedBy, uint256 salt) public {
    // TODO
  }

  function testMint(address mintedBy, uint256 salt) public {
    console.log("Should return getAddress() and store the right salt");

    vm.deal(address(registrar), 10 ether);
    vm.prank(address(registrar));

    address nftAddress = factory.mint(mintedBy, salt);
    assertEq(nftAddress, factory.getAddress(mintedBy, salt));
    assertEq(getFactorySalt(nftAddress), salt);
  }

  function testMintNotFromRegistrar(address from) public {
    console.log("Should revert when calling mint() not from Registrar");

    vm.assume(from != address(factory));
    vm.deal(from, 10 ether);
    vm.expectRevert(abi.encodePacked(Errors.NOT_REGISTRAR));
    factory.mint(from, 0x0001);
  }

  function getFactorySalt(address nftAddress) public view returns (uint256) {
    return uint256(vm.load(address(factory), keccak256(abi.encode(nftAddress, 1))));
  }
}
