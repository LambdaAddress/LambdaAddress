// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IMetaData} from "./IMetaData.sol";
import {Registrar} from "./Registrar.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title MetaData
/// @notice The metadata of NFT addresses is fully generated on-chain, including the SVG image.
/// @dev The metadata logic is encapsulated here so it can be easier to update without doing
/// a full upgrade of the Registrar.
contract MetaData is IMetaData {
  /// @notice Returns the URI for an NFT address
  /// @param tokenId ID of the NFT address
  /// @param registrar Registrar
  function getTokenURI(uint256 tokenId, Registrar registrar) external pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(bytes(getMetaData(tokenId, registrar)))
        )
      );
  }

  /// @notice Returns the SVG image for an NFT address
  /// @param tokenId ID of the NFT address
  /// @param registrar Registrar
  function getImage(uint256 tokenId, Registrar registrar) public pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<svg class="nft-address" width="424" height="524" viewBox="0 0 424 524" fill="none" xmlns="http://www.w3.org/2000/svg"><style> @import url("https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@300;400;500"); .badge { font-size: 38px; font-weight: bold; }  .address { font-family: "Sofia Sans Extra Condensed", sans-serif; font-size: 22px; font-weight: bold; text-transform: lowercase; filter: drop-shadow(2px 1px 3px rgb(0,0,0,0.75)); } .logo { filter: drop-shadow(1px 3px 2px rgb(0,0,0,0.75)); } .nft-address { filter: drop-shadow(2px 1px 7px rgb(0, 0, 0, 0.5)) } </style><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="74%" y2="100%"><stop offset="0%" style="stop-color: rgb(86, 111, 149);"></stop><stop offset="48%" style="stop-color: rgb(35, 67, 116);"></stop><stop offset="100%" style="stop-color: rgb(35, 67, 116);"></stop></linearGradient><linearGradient id="badge" x1="0%" y1="0%" x2="74%" y2="100%"><stop offset="0%" style="stop-color: rgb(86, 111, 149);"></stop><stop offset="48%" style="stop-color: rgb(35, 67, 116);"></stop><stop offset="100%" style="stop-color: rgb(35, 67, 116);"></stop></linearGradient></defs><rect x="24" y="24" width="400" height="500" rx="20" fill="white" class="anim"></rect><rect x="34" y="34" width="380" height="480" rx="20" fill="url(#grad1)"></rect><circle cx="40" cy="40" r="40" fill="white"></circle><circle cx="40" cy="40" r="34" fill="url(#badge)"></circle><text x="40" y="44" dominant-baseline="middle" text-anchor="middle" fill="white" class="badge">',
          Strings.toString(registrar.getAddressDifficulty(tokenId)),
          '</text><g class="logo"><svg x="175" y="25%" width="97.35" height="154.8" viewBox="0 0 115 182" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M57.5054 181V135.84L1.64064 103.171L57.5054 181Z" fill="#88AAF1" stroke="#1616B4" stroke-linejoin="round"></path><path d="M57.6906 181V135.84L113.555 103.171L57.6906 181Z" fill="#b0d5fb" stroke="#1616B4" stroke-linejoin="round"></path><path d="M57.5055 124.615V66.9786L1 92.2811L57.5055 124.615Z" fill="#B8FAF6" stroke="#1616B4" stroke-linejoin="round"></path><path d="M57.6903 124.615V66.9786L114.196 92.2811L57.6903 124.615Z" fill="#b0d5fb" stroke="#1616B4" stroke-linejoin="round"></path><path d="M1.00006 92.2811L57.5054 1V66.9786L1.00006 92.2811Z" fill="#88AAF1" stroke="#1616B4" stroke-linejoin="round"></path><path d="M114.196 92.2811L57.6906 1V66.9786L114.196 92.2811Z" fill="#B8FAF6" stroke="#1616B4" stroke-linejoin="round"></path></svg></g><text x="50%" y="404" transform="translate(12 0)" dominant-baseline="middle" text-anchor="middle" fill="white" class="address">',
          Strings.toHexString(address(uint160(tokenId))),
          "</text></svg>"
        )
      );
  }

  /// @notice Returns the metadata for and NFT address
  /// @param tokenId ID of the NFT address
  /// @param registrar Registrar
  function getMetaData(uint256 tokenId, Registrar registrar) public pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '{ "name": "Lambda Address ',
          Strings.toHexString(address(uint160(tokenId))),
          '", "image": "',
          abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(getImage(tokenId, registrar)))
          ),
          '", "description": "Lambda Address" }'
        )
      );
  }
}
