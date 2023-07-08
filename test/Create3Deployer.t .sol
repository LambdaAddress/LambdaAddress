// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Create3Deployer} from "../src/contracts/helpers/Create3Deployer.sol";
import {MetaData} from "../src/contracts/MetaData.sol";
import {SampleContract} from "../src/contracts/test/SampleContract.sol";

contract Create3DeployerTest is Test {
  Create3Deployer deployer;

  function setUp() public {
    deployer = new Create3Deployer();
  }

  function testDeploy(bytes32 salt, uint256 sampleValue) public {
    console.log("Should deploy at the right address.");

    SampleContract sample = SampleContract(
      deployer.deploy(
        0,
        salt,
        abi.encodePacked(type(SampleContract).creationCode, abi.encode(sampleValue))
      )
    );
    address computed = deployer.computeAddress(salt);

    assertEq(address(sample), computed);
    assertEq(sample.sample(), sampleValue);
  }
}
