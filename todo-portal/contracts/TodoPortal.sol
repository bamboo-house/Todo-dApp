// TodoPortal.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract TodoPortal {

  uint256 totalTodo;

  constructor() {
    console.log("Here is my fiirst smart contract!");
  }

  function createTodo() public {
    totalTodo += 1;
    console.log("%s create todo!", msg.sender);
  }

  function deleteTodo() public {
    totalTodo -= 1;
    console.log("%s delete todo!", msg.sender);
  }

  function getTotalTodo() public view returns (uint256) {
    console.log("We have %d total todo!", totalTodo);
    return totalTodo;
  }

}
