// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SampleContract {
  uint256 public sample;

  constructor(uint256 _sample) {
    sample = _sample;
  }

  function setSample(uint256 value) external {
    sample = value + 1;
  }

  // Foundry workaround for skipping coverage
  function test() public {}
}
