// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {ERC721Upgradeable, IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {IERC2981Upgradeable} from "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import {Errors} from "./Errors.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IFactory} from "./IFactory.sol";
import {IMetaData} from "./IMetaData.sol";

/// @title Registrar contract
/// @notice Main contract to mint and query NFT addresses. Only addresses for smart contracts
/// can be minted, no EOA. This contract implements the ERC721 standard.
/// @dev This contract is meant to be initialized with a proxy, and every interaction should
/// be through the proxy. Logic is further divided into 2 main contracts:
///   - [IFactory](IFactory.md): Registration, validation and deployment of NFT addresses
///   - [IMetaData](IMetaData.md): Generating the metadata for the NFT addresses.
///
/// The ID of an NFT address is simply its value casted to `uint256`.
contract Registrar is IERC2981Upgradeable, ERC721Upgradeable, OwnableUpgradeable {
  string private constant _NAME = "Lambda Address";
  string private constant _SYMBOL = "LADD";
  bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

  /// @dev Emitted when a contract is deployed to the `tokenId` NFT address.
  event Deploy(address indexed deployer, uint256 indexed tokenId);

  /// @dev Emitted when `owner` enables `approved` to deploy to the `tokenId` NFT address.
  event DeployerApproval(address indexed owner, address indexed approved, uint256 indexed tokenId);

  /// @dev Represents an NFT address registration
  struct NFTAddress {
    address mintedBy; // Account that minted the NFT address
    bool isDeployed; // Is a smart contract deployed at the address?
    IFactory factory; // Factory used to mint and deploy the address
  }

  mapping(uint256 tokenId => NFTAddress) private _nftAddress;
  mapping(IFactory => bool isAllowed) private _allowedFactories;

  uint256 private _mintPrice; // Mint price in wei
  IMetaData private _metaData; // Contract used to generate metadata for the NFT addresses
  uint96 _royalties; // Sales royalties (basis points)
  address payable _royaltiesRecipient;

  // Account that can deploy to the NFT address, other than its owner
  mapping(uint256 tokenId => address account) private _deployApprovals;

  /// @notice Initializes the registrar
  /// @dev Function is invoked by the proxy contract during main deployment
  /// @param mintPrice Price in wei to mint a new NFT address
  /// @param royalties Sales royalties in basis points
  /// @param royaltiesRecipient Royalties recipient address
  /// @param metaData IMetaData contract to handle metadata generation
  /// @param owner Contract's owner
  function initialize(
    uint256 mintPrice,
    uint96 royalties,
    address payable royaltiesRecipient,
    IMetaData metaData,
    address owner
  ) external initializer {
    __ERC721_init(_NAME, _SYMBOL);

    _mintPrice = mintPrice;
    _royalties = royalties;
    _royaltiesRecipient = royaltiesRecipient;
    _metaData = metaData;

    OwnableUpgradeable._transferOwnership(owner);
  }

  /// @notice Allow/disallow a factory
  /// @param factory IFactory contract
  /// @param allow Allow/disallow the factory
  function allowFactory(IFactory factory, bool allow) external onlyOwner {
    _allowedFactories[factory] = allow;
  }

  /// Approve `deployer` to deploy to the `tokenId` NFT address.
  /// @param deployer Account that can deploy a smart contract
  /// @param tokenId ID of the NFT address
  function approveDeployer(address deployer, uint256 tokenId) external {
    require(msg.sender == ERC721Upgradeable.ownerOf(tokenId), Errors.ERC721_NOT_TOKEN_OWNER);
    _approveDeployer(deployer, tokenId);
  }

  /// @notice Returns `true` if factory is allowed to mint new NFT addresses
  /// @param factory Factory
  function isFactoryAllowed(IFactory factory) external view returns (bool) {
    return _allowedFactories[factory];
  }

  /// @notice Deploys a smart contract to the NFT address
  /// @param tokenId ID of the NFT address
  /// @param creationCode Creation bytecode of the smart contract
  function deploy(uint256 tokenId, bytes memory creationCode) external {
    require(_canDeploy(tokenId, msg.sender), Errors.NO_DEPLOY_PERMISSION);
    address nftAddress = address(uint160(tokenId));
    getFactory(tokenId).deploy(nftAddress, creationCode);
    _nftAddress[tokenId].isDeployed = true;
    emit Deploy(msg.sender, tokenId);
  }

  /// @notice Returns the ID for an NFT address.
  /// @dev The ID is the address' value casted to uint256. Hence there
  /// can't be any ID larger than 20 bytes.
  /// @param nftAddress NFT address
  function getAddressId(address nftAddress) external pure returns (uint256) {
    return uint256(uint160(nftAddress));
  }

  /// @notice Returns the number of consecutive identical characters in an NFT address.
  /// The higher the number, the greater the difficulty to generate the address.
  /// `e.g.: 0x6e495383a99fde33333337cae062d75153fa2608 -> 7`
  /// @param tokenId ID of the NFT address
  function getAddressDifficulty(uint256 tokenId) external pure returns (uint8) {
    uint8 highestHex = 0;
    uint8 highestHexCount = 0;
    uint8 currentHex = 0;
    uint8 currentCount = 0;

    uint8[] memory it = new uint8[](2);

    for (uint8 i = 0; i < 20; ) {
      uint8 b = uint8(uint(uint160(tokenId)) / (2 ** (8 * (19 - i))));
      it[0] = uint8(b) / 16;
      it[1] = uint8(b) - 16 * it[0];

      for (uint8 j = 0; j < 2; ) {
        if (it[j] == currentHex) {
          unchecked {
            currentCount++;
          }
        } else {
          currentHex = it[j];
          currentCount = 1;
        }

        if (currentCount > highestHexCount) {
          if (highestHex != currentHex) highestHex = currentHex;

          highestHexCount = currentCount;
        }

        unchecked {
          j++;
        }
      }

      unchecked {
        i++;
      }
    }
    return highestHexCount;
  }

  /// @notice Returns the approved deployer for a given NFT address
  /// @param tokenId ID of the NFT address
  function getApprovedDeployer(uint256 tokenId) external view returns (address) {
    return _deployApprovals[tokenId];
  }

  /// @notice Returns the Factory used to mint and deploy an NFT address
  /// @param tokenId ID of the NFT address
  function getFactory(uint256 tokenId) public view returns (IFactory) {
    return _nftAddress[tokenId].factory;
  }

  /// @notice Returns the address of the account that minted the NFT address
  /// @param tokenId ID of the NFT address
  function getMintedBy(uint256 tokenId) external view returns (address) {
    return _nftAddress[tokenId].mintedBy;
  }

  /// @notice Returns `true` if a smart contract has been deployed to the NFT address
  /// @param tokenId ID of the NFT address
  function getIsDeployed(uint256 tokenId) external view returns (bool) {
    return _nftAddress[tokenId].isDeployed;
  }

  /// @notice Mint a new NFT address. This function doesn't deploy a smart contract
  /// to the address.
  /// @param factory Factory used to mint and deploy the NFT address
  /// @param salt  Salt used to generate the NFT address
  function mint(IFactory factory, uint256 salt) external payable returns (uint256 tokenId) {
    require(_allowedFactories[factory], Errors.UNAUTHORIZED_FACTORY);
    require(msg.value >= _mintPrice, Errors.INSUFFICIENT_MINT_PAYMENT);

    address payable deployedAddress = factory.mint(msg.sender, salt);
    _mint(deployedAddress, msg.sender, factory);
    return uint256(uint160(address(deployedAddress)));
  }

  /// @notice ERC-2981 implementation. Called with the sale price to determine how much royalty is
  /// owed and to whom. The `tokenId` param is optional since the royalty amount is always the
  /// same.
  // @param tokenId NFT asset queried for royalty information
  /// @param salePrice Sale price of the NFT asset specified by `tokenId`
  /// @return receiver Address of who should be sent the royalty payment
  /// @return royaltyAmount Royalty payment amount for `salePrice`
  function royaltyInfo(
    uint256 /*tokenId*/,
    uint256 salePrice
  ) external view override returns (address receiver, uint256 royaltyAmount) {
    receiver = _royaltiesRecipient;
    royaltyAmount = (salePrice / 10000) * uint256(_royalties);
  }

  /// @notice Set the contract used to generate metadata for the NFT addresses
  /// @param metaData IMetaData contract address
  function setMetaData(IMetaData metaData) external onlyOwner {
    _metaData = metaData;
  }

  /// @notice Set the price of minting NFT addresses, in wei.
  /// @param mintPrice Mint price in wei
  function setMintPrice(uint256 mintPrice) external onlyOwner {
    _mintPrice = mintPrice;
  }

  /// @notice Sets the sales royalties in basis points. (e.g. 500 = 5%)
  /// @param royalties Sales royalties in basis points
  function setRoyalties(uint96 royalties) external onlyOwner {
    require(royalties <= 10000, Errors.INVALID_ROYALTIES);
    _royalties = royalties;
  }

  /// @notice Sets the sales royalties recipient address.
  /// @param recipient Sales royalties recipient address.
  function setRoyaltiesRecipient(address payable recipient) external onlyOwner {
    _royaltiesRecipient = recipient;
  }

  /// @dev Returns true if this contract implements the interface defined by
  /// `interfaceId`. See
  /// https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721Upgradeable, IERC165Upgradeable) returns (bool) {
    return interfaceId == _INTERFACE_ID_ERC2981 || super.supportsInterface(interfaceId);
  }

  /// @notice Returns an URI for a given token ID. The URI is generated
  /// by [IMetaData](IMetaData.md).
  /// @param tokenId ID of the NFT address
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return _metaData.getTokenURI(tokenId, this);
  }

  /// @notice Withdraw `amount` of wei from this contract and transfer it to recipient `to`.
  /// @param amount Amount of wei to withdraw
  /// @param to Address of the recipient
  function transferFunds(uint256 amount, address payable to) public onlyOwner {
    require(amount <= address(this).balance, Errors.INSUFFICIENT_FUNDS);
    (bool succeeded, ) = to.call{value: amount}("");
    require(succeeded, Errors.TRANSFER_FAILED);
  }

  function _approveDeployer(address deployer, uint256 tokenId) internal {
    _deployApprovals[tokenId] = deployer;
    emit DeployerApproval(ERC721Upgradeable.ownerOf(tokenId), deployer, tokenId);
  }

  function _beforeTokenTransfer(address, address, uint256 tokenId) internal virtual override {
    if (_deployApprovals[tokenId] != address(0)) {
      _approveDeployer(address(0), tokenId);
    }
  }

  function _canDeploy(uint256 tokenId, address deployer) internal view returns (bool) {
    return deployer == ERC721Upgradeable.ownerOf(tokenId) || deployer == _deployApprovals[tokenId];
  }

  function _mint(address payable addr, address mintedBy, IFactory factory) internal {
    uint256 tokenId = uint256(uint160(address(addr)));
    require(!_exists(tokenId), Errors.ADDRESS_ALREADY_MINTED);

    _mint(mintedBy, tokenId);
    _nftAddress[tokenId].mintedBy = mintedBy;
    _nftAddress[tokenId].factory = factory;
  }
}
