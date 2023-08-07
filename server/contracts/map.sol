pragma solidity ^0.18.19;

contract Map {

    bytes32 private passwordHash;
    string public basicMap;
    string public tailorMap;


    constructor(string memory passwordClearText) {
        
        passwordHash = keccak256(abi.encodePacked(passwordClearText));


    }

    function setMap(string memeory passwordClearText, string newBasicMap, string newTailorMap) public {
        bytes32 givenPasswordHash = keccak256(abi.encodePacked(passwordClearText));
        if(passwordHash == givenPasswordHash) {
            basicMap = newBasicMap;
            tailorMap = newTailorMap;
        }
    }
}