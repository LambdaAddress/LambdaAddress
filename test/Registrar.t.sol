// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {IERC721Upgradeable, IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Errors} from "../src/contracts/Errors.sol";
import {MetaData} from "../src/contracts/MetaData.sol";
import {IFactory} from "../src/contracts/IFactory.sol";
import {NFTAddressFactory} from "../src/contracts/NFTAddressFactory.sol";
import {Registrar} from "../src/contracts/Registrar.sol";
import {RegistrarProxy} from "../src/contracts/RegistrarProxy.sol";

contract RegistrarTest is Test {
  uint256 public constant MINT_PRICE = 10000000000000000;
  bytes public constant SAMPLE_BYTECODE =
    hex"608060405234801561001057600080fd5b5060e58061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636ca1f933146037578063f8a8fd6d146048575b600080fd5b604660423660046071565b6062565b005b605060005481565b60405190815260200160405180910390f35b606b8160016089565b60005550565b600060208284031215608257600080fd5b5035919050565b8082018082111560a957634e487b7160e01b600052601160045260246000fd5b9291505056fea2646970667358221220619c97eca55eda524c77b84453908159b9b24441a22c13a0779840999595fbd064736f6c63430008120033";
  uint96 internal constant _ROYALTIES = 500;

  address payable[] internal users;
  address internal owner;

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
      _ROYALTIES,
      payable(address(this)),
      metaData,
      address(this)
    );
    proxy = new RegistrarProxy(address(registrarLogic), data);
    registrar = Registrar(address(proxy));
    factory = new NFTAddressFactory(registrar);

    registrar.allowFactory(factory, true);
  }

  function testAllowFactory() public {
    console.log("Should set _allowedFactories[factory] to the right value.");

    NFTAddressFactory fact = new NFTAddressFactory(registrar);
    assertEq(registrar.isFactoryAllowed(fact), false);
    assertEq(registrar.isFactoryAllowed(factory), true);

    registrar.allowFactory(fact, true);
    assertEq(registrar.isFactoryAllowed(fact), true);
    assertEq(registrar.isFactoryAllowed(factory), true);

    registrar.allowFactory(fact, false);
    assertEq(registrar.isFactoryAllowed(fact), false);
    assertEq(registrar.isFactoryAllowed(factory), true);
  }

  function testAllowFactoryNotFromOwner(address from) public {
    console.log("Should revert when not called by owner.");

    vm.assume(from != address(this));
    IFactory fact = new NFTAddressFactory(registrar);
    vm.prank(from);
    vm.expectRevert();
    registrar.allowFactory(fact, true);
  }

  function testApproveDeployer(address deployer) public {
    console.log("Should add deployment access to the right address.");

    vm.assume(deployer != address(this));
    vm.assume(deployer != address(0));

    uint256 salt = 0x123456;
    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, salt);
    address nftAddress = address(uint160(tokenId));
    address sampleContract = createContract(SAMPLE_BYTECODE);

    registrar.approveDeployer(deployer, tokenId);

    vm.prank(deployer);
    registrar.deploy(tokenId, SAMPLE_BYTECODE);

    assertEq(nftAddress.code, sampleContract.code);
    assertEq(registrar.getIsDeployed(tokenId), true);
  }

  function testApproveDeployerNotFromOwner(address deployer, address caller) public {
    console.log("Should throw when not called by tokenId owner.");

    vm.assume(deployer != address(this));
    vm.assume(deployer != address(0));
    vm.assume(caller != address(this));

    uint256 salt = 0x123456;
    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, salt);

    vm.expectRevert(abi.encodePacked(Errors.ERC721_NOT_TOKEN_OWNER));
    vm.prank(caller);
    registrar.approveDeployer(deployer, tokenId);
  }

  function testGetAddressId(address nftAddress) public {
    console.log("Should return the address casted to uint256");

    uint256 tokenId = uint256(uint160(nftAddress));
    assertEq(registrar.getAddressId(nftAddress), tokenId);
  }

  function testGetApprovedDeployer(address deployer) public {
    console.log("Should return the correct address");

    vm.assume(deployer != address(this));
    vm.assume(deployer != address(0));

    uint256 salt = 0x123456;
    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, salt);
    assertEq(registrar.getApprovedDeployer(tokenId), address(0));

    registrar.approveDeployer(deployer, tokenId);
    assertEq(registrar.getApprovedDeployer(tokenId), deployer);
  }

  function testDeploy(uint256 salt) public {
    console.log("Should deploy the right code to the right address, set isDeployed=true.");

    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, salt);
    address nftAddress = address(uint160(tokenId));

    address sampleContract = createContract(SAMPLE_BYTECODE);

    registrar.deploy(tokenId, SAMPLE_BYTECODE);

    assertEq(nftAddress.code, sampleContract.code);
    assertEq(registrar.getIsDeployed(tokenId), true);
  }

  function testDeployInvalidToken(address from, uint256 tokenId, bytes memory deployCode) public {
    console.log("Should revert if tokenId is invalid");

    vm.assume(from != address(this));
    vm.assume(from != address(0));
    vm.prank(from);
    vm.expectRevert(abi.encodePacked("ERC721: invalid token ID"));
    registrar.deploy(tokenId, deployCode);
  }

  function testDeployNotFromTokenOwner(address from, uint256 salt, bytes memory deployCode) public {
    console.log("Should revert if not called by token owner");

    vm.assume(from != address(this));
    vm.assume(from != address(0));
    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, salt);
    vm.prank(from);
    vm.expectRevert(abi.encodePacked(Errors.NO_DEPLOY_PERMISSION));
    registrar.deploy(tokenId, deployCode);
  }

  function testGetAddressDifficulty() public {
    console.log("Should return the right difficulty");

    assertEq(
      registrar.getAddressDifficulty(uint256(uint160(0x6E495383a99FDE33333337CAE062d75153FA2608))),
      7
    );
    assertEq(
      registrar.getAddressDifficulty(uint256(uint160(0x0000000000AD88F6F4cE6Ab8827279cfffb92266))),
      10
    );
    assertEq(
      registrar.getAddressDifficulty(uint256(uint160(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0))),
      2
    );
    assertEq(
      registrar.getAddressDifficulty(uint256(uint160(0xf39fd6E51aA088F6f4Ce6Ab882727fffffB92266))),
      5
    );
    assertEq(
      registrar.getAddressDifficulty(uint256(uint160(0xc02aAA3bbBBBbE8d0A0E5c4F27EAd9083c756cC2))),
      6
    );
  }

  function testInitialize(
    uint256 mintPrice,
    uint96 royalties,
    address payable royaltiesRecipient,
    address metaDataTest
  ) public {
    console.log("Should set the right mint price, royalties, recipient and MetaData address");

    bytes memory data = abi.encodeWithSelector(
      registrar.initialize.selector,
      mintPrice,
      royalties,
      royaltiesRecipient,
      MetaData(metaDataTest),
      address(this)
    );
    RegistrarProxy proxyTest = new RegistrarProxy(address(registrarLogic), data);
    Registrar reg = Registrar(address(proxyTest));

    //reg.initialize(mintPrice, royalties, royaltiesRecipient, MetaData(metaDataTest));

    // _mintPrice is stored at slot 203
    assertEq(uint256(vm.load(address(reg), bytes32(uint256(203)))), mintPrice);

    // _metaData and _royalties are stored at slot 204
    bytes32 slot204Content = vm.load(address(reg), bytes32(uint256(204)));
    address storedMetaData = address(uint160(uint256(slot204Content)));
    uint96 storedRoyalties = uint96(uint256(slot204Content >> 160));
    assertEq(storedMetaData, metaDataTest);
    assertEq(storedRoyalties, royalties);

    // _royaltiesRecipient is stored at slot 205
    assertEq(
      address(uint160(uint256(vm.load(address(reg), bytes32(uint256(205)))))),
      royaltiesRecipient
    );
  }

  function testMintWithInsufficientValue(uint256 value) public {
    console.log("Should revert when called with insufficient value");
    vm.assume(value < msg.sender.balance);
    vm.assume(value < MINT_PRICE);
    vm.expectRevert(abi.encodePacked(Errors.INSUFFICIENT_MINT_PAYMENT));

    registrar.mint{value: value}(factory, 0x0001);
  }

  function testMint(address from, uint256 value, uint256 salt) public {
    console.log("Should set the right factory, owner, isDeployed values");

    vm.assume(from != address(0));
    vm.deal(from, type(uint256).max);
    vm.assume(value < from.balance);
    vm.assume(value >= MINT_PRICE);
    vm.prank(from);

    uint256 tokenId = registrar.mint{value: value}(factory, salt);
    assertEq(address(registrar.getFactory(tokenId)), address(factory));
    assertEq(registrar.ownerOf(tokenId), from);
    assertEq(registrar.getIsDeployed(tokenId), false);
  }

  function testMintWithUnauthorizedFactory(address factoryTest) public {
    console.log("Should revert when called with unauthorized factory");

    vm.assume(factoryTest != address(factory));
    vm.expectRevert(abi.encodePacked(Errors.UNAUTHORIZED_FACTORY));
    registrar.mint{value: MINT_PRICE}(NFTAddressFactory(factoryTest), 0x0001);
  }

  function testMintWithAlreadyMintedAddress(address from, uint256 salt) public {
    console.log("Should revert when NFT address is already minted");

    vm.assume(from != address(0));
    vm.deal(from, 10 ether);
    vm.startPrank(from);
    registrar.mint{value: MINT_PRICE}(factory, salt);
    vm.expectRevert(abi.encodePacked(Errors.ADDRESS_ALREADY_MINTED));
    registrar.mint{value: MINT_PRICE}(factory, salt);
  }

  function testRoyaltyInfo(uint256 tokenId, uint256 salePrice) public {
    console.log("Should return the correct royalty info");

    (address receiver, uint256 royaltyAmount) = registrar.royaltyInfo(tokenId, salePrice);

    assertEq(receiver, registrar.owner());
    assertEq(royaltyAmount, (salePrice / 10000) * uint256(500));
  }

  function testSetMetaData(address metaDataTest) public {
    console.log("Should set the correct MetaData address");

    registrar.setMetaData(MetaData(metaDataTest));
    // _metaData is stored at slot 204
    assertEq(
      address(uint160(uint256(vm.load(address(registrar), bytes32(uint256(204)))))),
      metaDataTest
    );
  }

  function testSetMetaDataNotFromOwner(address from, uint256 mintPrice) public {
    console.log("Should revert when not called by owner.");

    vm.assume(from != address(this));
    vm.prank(from);
    vm.expectRevert(abi.encodePacked("Ownable: caller is not the owner"));
    registrar.setMintPrice(mintPrice);
  }

  function testSetMintPrice(uint256 mintPrice) public {
    console.log("Should set the correct mint price");

    registrar.setMintPrice(mintPrice);
    // _mintPrice is stored at slot 203
    assertEq(uint256(vm.load(address(registrar), bytes32(uint256(203)))), mintPrice);
  }

  function testSetMintPriceNotFromOwner(address from, uint256 mintPrice) public {
    console.log("Should revert when not called by owner.");

    vm.assume(from != address(this));
    vm.prank(from);
    vm.expectRevert(abi.encodePacked("Ownable: caller is not the owner"));
    registrar.setMintPrice(mintPrice);
  }

  function testSetRoyalties(uint96 royalties) public {
    console.log("Should set _royalties to the correct value.");

    vm.assume(royalties <= 10000);
    registrar.setRoyalties(royalties);

    // _metaData and _royalties are stored at slot 204
    bytes32 slot204Content = vm.load(address(registrar), bytes32(uint256(204)));
    uint96 storedRoyalties = uint96(uint256(slot204Content >> 160));
    assertEq(storedRoyalties, royalties);
  }

  function testSetRoyaltiesNotFromOwner(address from, uint96 royalties) public {
    console.log("Should revert if not called by owner.");

    vm.assume(royalties <= 10000);
    vm.assume(from != address(this));
    vm.deal(from, 1 ether);
    vm.prank(from);
    vm.expectRevert(abi.encodePacked("Ownable: caller is not the owner"));
    registrar.setRoyalties(royalties);
  }

  function testSetRoyaltiesTooHigh(uint96 royalties) public {
    console.log("Should revert if not called by owner.");

    vm.assume(royalties > 10000);
    vm.expectRevert(abi.encodePacked(Errors.INVALID_ROYALTIES));
    registrar.setRoyalties(royalties);
  }

  function testSetRoyaltiesRecipient(address payable royaltiesRecipient) public {
    console.log("Should set _royaltiesRecipient to the correct value.");

    registrar.setRoyaltiesRecipient(royaltiesRecipient);

    //_royaltiesRecipient are stored at slot 205
    bytes32 slot205Content = vm.load(address(registrar), bytes32(uint256(205)));
    assertEq(address(uint160(uint256(slot205Content))), royaltiesRecipient);
  }

  function testSetRoyaltiesRecipientNotFromOwner(
    address from,
    address payable royaltiesRecipient
  ) public {
    console.log("Should revert if not called by owner.");

    vm.assume(from != address(this));
    vm.deal(from, 1 ether);
    vm.prank(from);
    vm.expectRevert(abi.encodePacked("Ownable: caller is not the owner"));
    registrar.setRoyaltiesRecipient(royaltiesRecipient);
  }

  function testSupportsInterfaceERC2981() public {
    console.log("Should support ERC2981 interface.");
    assertEq(registrar.supportsInterface(0x2a55205a), true);
  }

  function testSupportsInterfaceERC721() public {
    console.log("Should support ERC721 interface.");
    assertEq(registrar.supportsInterface(0x5b5e139f), true);
  }

  function testSupportsInterfaceERC721Upgradeable() public {
    console.log("Should support ERC721Upgradeable interface.");
    assertEq(registrar.supportsInterface(type(IERC721Upgradeable).interfaceId), true);
  }

  function testSupportsInterfaceERC165() public {
    console.log("Should support ERC165/ERC165Upgradeable interface.");
    // ERC165 interfaceId == ERC165Upgradeable interfaceId
    assertEq(registrar.supportsInterface(type(IERC165Upgradeable).interfaceId), true);
  }

  function testSupportsInterfaceNoOther(bytes4 interfaceId) public {
    console.log("Should not support other interfaces.");

    vm.assume(interfaceId != 0);
    vm.assume(interfaceId != 0x2a55205a); // ERC2981
    vm.assume(interfaceId != 0x5b5e139f); // ERC721
    vm.assume(interfaceId != type(IERC721Upgradeable).interfaceId);
    vm.assume(interfaceId != type(IERC165Upgradeable).interfaceId);
    assertEq(registrar.supportsInterface(interfaceId), false);
  }

  function testTokenURI(uint256 tokenId) public {
    console.log("Should call MetaData.getTokenURI() with the right params.");

    vm.expectCall(
      address(metaData),
      abi.encodeWithSelector(MetaData.getTokenURI.selector, tokenId, address(registrar))
    );
    registrar.tokenURI(tokenId);
  }

  function testTransferFromResetsApprovedDeployer(address deployer, address to) public {
    console.log("Should reset the approved deployer.");

    vm.assume(deployer != address(this));
    vm.assume(deployer != address(0));
    vm.assume(to != address(this));
    vm.assume(to != address(0));

    uint256 salt = 0x123456;
    uint256 tokenId = registrar.mint{value: MINT_PRICE}(factory, salt);

    registrar.approveDeployer(deployer, tokenId);
    assertEq(registrar.getApprovedDeployer(tokenId), deployer);

    registrar.transferFrom(address(this), to, tokenId);
    assertEq(registrar.getApprovedDeployer(tokenId), address(0));
  }

  function testTransferFunds(uint256 amount) public {
    console.log("Should transfer funds to the correct address.");

    address payable to = payable(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    vm.deal(to, 0);
    vm.deal(address(registrar), amount);
    registrar.transferFunds(amount, to);
    assertEq(address(registrar).balance, 0);
    assertEq(to.balance, amount);
  }

  function testTransferFundsInsufficientFunds(uint256 amount) public {
    console.log("Should revert when funds are insufficient.");

    vm.assume(amount > 0);
    vm.deal(address(registrar), 0 ether);
    vm.expectRevert(abi.encodePacked(Errors.INSUFFICIENT_FUNDS));
    registrar.transferFunds(amount, payable(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266));
  }

  function testTransferFundsFail() public {
    console.log("Should revert when transfer failed.");

    address to = address(new MockRecipient());
    vm.deal(address(registrar), 10 ether);
    vm.expectRevert(abi.encodePacked(Errors.TRANSFER_FAILED));
    registrar.transferFunds(1 ether, payable(to));
  }

  function testTransferFundsNotFromOwner(address from) public {
    console.log("Should revert when not called by owner.");

    vm.assume(from != address(this));
    vm.deal(address(registrar), 10 ether);
    vm.prank(from);
    vm.expectRevert(abi.encodePacked("Ownable: caller is not the owner"));
    registrar.transferFunds(1 ether, payable(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266));
  }
}

function createContract(bytes memory bytecode) returns (address newContract) {
  assembly {
    newContract := create(0, add(bytecode, 0x20), mload(bytecode))
    if iszero(extcodesize(newContract)) {
      revert(0, 0)
    }
  }
}

contract MockRecipient {
  receive() external payable {
    revert();
  }

  // Foundry workaround for skipping coverage
  function test() public {}
}
