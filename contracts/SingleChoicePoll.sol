// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract SingleChoicePoll{

    mapping(uint256 => Poll) public idToPoll;
    mapping(uint256 => mapping(uint256 => uint256)) public counts;
    mapping(uint256 => mapping(address => bool)) public alreadyVoted;

    uint256 idCounter;

    struct Poll{
        string question;
        string[] options;
        uint256 expiryTime;
    }

    //create poll
    function createPoll(string calldata _question, uint256 _expiryTime, string[] calldata _options) external {
        require(_expiryTime > block.timestamp, "Invalid expiry time");
        require(_options.length >= 2, "Atleast 2 options");
        // require(bytes(_question).length > 5, "Invalid question size, minimum 5");
        idCounter++;
        idToPoll[idCounter] = Poll(_question, _options, _expiryTime);
    }

    //vote on poll
    function voteOnPoll(uint256 pollId, uint256 choice) external returns(bool){
        require(idCounter >= pollId, "Invalid poll id");
        require(idToPoll[pollId].expiryTime >= block.timestamp, "Poll has expired");
        require(choice <= idToPoll[pollId].options.length, "Invalid choice" );
        require(alreadyVoted[pollId][msg.sender] == false, "Already voted");
        counts[pollId][choice-1]++;
        alreadyVoted[pollId][msg.sender] = true;
        return true;
    }

    //query poll result
    function getPollResult(uint256 pollId) external view returns(string memory question, string[] memory options, uint256[] memory) {
        require(idCounter >= pollId, "Invalid poll id");

        uint256[] memory result = new uint256[](idToPoll[pollId].options.length);

        uint256 size = idToPoll[pollId].options.length;

        for(uint i =0; i<size ; i++){
            result[i] = counts[pollId][i];
        }

        return(idToPoll[pollId].question, idToPoll[pollId].options, result);
    }

    //Get current time in seconds
    function getCurrentTime() external view returns(uint256) {
        return block.timestamp;
    }

}