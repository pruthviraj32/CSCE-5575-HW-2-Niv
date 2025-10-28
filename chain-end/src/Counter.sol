// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Counter is Ownable {
    // Array of strings
    string[] private words;
    
    // Number variable to control array slicing
    uint256 public num;
    
    // Events for payable functions
    event FirstNumElementsCalled(address indexed caller, uint256 value, uint256 num);
    event LastNumElementsCalled(address indexed caller, uint256 value, uint256 num);
    event NumberUpdated(uint256 oldNum, uint256 newNum);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    // Constructor with initialOwner parameter
    constructor(address initialOwner) Ownable(initialOwner) {
        words = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do"];
        num = 5; // Default value
    }
    
    // Payable function: Returns elements from index 0 to num
    // Requires 0.001 ETH payment
    function firstNumElements() public payable returns (string[] memory) {
        require(msg.value == 0.001 ether, "Must send exactly 0.001 ETH");
        require(num > 0 && num <= words.length, "Invalid num value");
        
        string[] memory result = new string[](num);
        for (uint256 i = 0; i < num; i++) {
            result[i] = words[i];
        }
        
        emit FirstNumElementsCalled(msg.sender, msg.value, num);
        return result;
    }
    
    // Payable function: Returns elements from num to end of array
    // Requires 0.002 ETH payment
    function lastNumElements() public payable returns (string[] memory) {
        require(msg.value == 0.002 ether, "Must send exactly 0.002 ETH");
        require(num >= 0 && num < words.length, "Invalid num value");
        
        uint256 length = words.length - num;
        string[] memory result = new string[](length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = words[num + i];
        }
        
        emit LastNumElementsCalled(msg.sender, msg.value, num);
        return result;
    }
    
    // Owner-only function to update num
    function setNum(uint256 _num) public onlyOwner {
        require(_num >= 0 && _num <= words.length, "Number out of bounds");
        uint256 oldNum = num;
        num = _num;
        emit NumberUpdated(oldNum, _num);
    }
    
    // Owner-only function to withdraw all funds
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    // Function to get the full array
    function getWords() public view returns (string[] memory) {
        return words;
    }
    
    // Function to get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Receive function to accept ETH
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}
