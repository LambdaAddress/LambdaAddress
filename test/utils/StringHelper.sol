// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library StringHelper {
  function contains(string memory where, string memory what) public pure returns (bool) {
    bytes memory whatBytes = bytes(what);
    bytes memory whereBytes = bytes(where);

    if (whatBytes.length > whereBytes.length) return false;

    bool found = false;
    for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
      bool flag = true;
      for (uint j = 0; j < whatBytes.length; j++)
        if (whereBytes[i + j] != whatBytes[j]) {
          flag = false;
          break;
        }
      if (flag) {
        found = true;
        break;
      }
    }
    return found;
  }

  function startsWith(string memory where, string memory what) public pure returns (bool) {
    bytes memory whatBytes = bytes(what);
    bytes memory whereBytes = bytes(where);

    if (whatBytes.length > whereBytes.length) return false;

    for (uint i = 0; i < whatBytes.length; i++) {
      if (whatBytes[i] != whereBytes[i]) return false;
    }

    return true;
  }

  // Foundry workaround for skipping coverage
  function test() public {}
}
