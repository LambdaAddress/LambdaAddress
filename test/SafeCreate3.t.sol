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
import {SampleContract} from "../src/contracts/test/SampleContract.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {StringHelper} from "./utils/StringHelper.sol";

contract SafeCreate3Test is Test {
  using StringHelper for string;

  function testDeploySample(bytes32 salt, address createdBy, uint256 sample) public {
    SampleContract sampleContract = new SampleContract(sample);

    SampleContract deployed = SampleContract(
      SafeCreate3.deploy(
        salt,
        createdBy,
        abi.encodePacked(type(SampleContract).creationCode, abi.encode(sample)),
        0
      )
    );

    assertEq(address(deployed), SafeCreate3.getDeployed(salt, createdBy));
    assertEq(address(sampleContract).code, address(deployed).code);
    assertEq(deployed.sample(), sample);
  }

  function testGetBytecode() public {
    console.log("Should contain createdBy address.");

    address createdBy = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    bytes memory createdByBytes = abi.encodePacked(createdBy);
    bytes memory bytecode = SafeCreate3.getBytecode(createdBy);
    assertEq(string(bytecode).contains(string(createdByBytes)), true);
  }
}
