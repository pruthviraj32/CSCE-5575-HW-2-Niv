# CSCE-5575-HW-2-Template <br /> Instructor: Beddhu Murali
Second Homework template for blockchain course CSCE 4575/5575

# Introduction
In this homework, you will be using smart contracts provided by other parties in your smart contract. Think it as using libraries in programming languages such as Java or C++.

The contract you will be using is `Ownable.sol` by OpenZeppelin. More info will be in the following section.

The goal of the homework is to design a contract with some functionalities only accessible/callable by the owner of the contract. You will also learn about payment to and from the smart contract.

# Tasks
### Chain-end
Develop a smart contract with the "Lorem, ipsum, dolor, sit, amet, consectetur, adipiscing, elit, sed, do" array. Similar to the previous assignments, you will have a number variable, which will be used to control how the array gets sliced.

The contract will be "Ownable".

This time, you will have two functions to get slice of array:
- firstNumElements
  - Returns the elements from the first index, up until 'num' variable
- lastNumElements
  - Returns theh elements starting from the 'num' index up until the end of the array

These functions will be payable. "firstNumElements" will require the user to pay "0.001" and "lastNumElements", "0.002".

There will be a function to update the number similar to the previous assignments, however, this function will be only callable by the owner/creator of the contract only.

Finally, there will be a function to transfer all the funds from the contract to the owner of the contract. This function will also be callable only by the contract owner.

### Front-end
- You will display the address of the owner of the contract
- Similar to previous assignment, your address and ETH balance
- Display the num value and the array slice
- Necessary buttons to perform the function calls
- Necessary input fields to use set number function

Include any other necessary functions to perform the tasks.

# Environment Setup
Run the `setup.sh` script.

Add `import "@openzeppelin/contracts/access/Ownable.sol"` to your `Counter.sol` file.

Any other dependencies should be installed by the script.

# Sources
- Ownable: https://docs.openzeppelin.com/contracts/4.x/access-control
- Payable:
  - https://docs.alchemy.com/docs/solidity-payable-functions
  - https://solidity-by-example.org/payable/
- Receive and Fallback functions
  - https://solidity-by-example.org/fallback/
  - https://ethereum.stackexchange.com/questions/81994/what-is-the-receive-keyword-in-solidity
- Payable functions emit events:
  - https://solidity-by-example.org/events/
  - https://www.tutorialspoint.com/solidity/solidity_events.htm
