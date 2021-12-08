// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract SingleChoicePoll{

    uint256 idCounter;

    mapping(uint256 => Poll) public idToPoll;
    mapping(uint256 => mapping(uint256 => uint256)) public counts;
    mapping(uint256 => mapping(address => bool)) public alreadyVoted;

    struct Poll{
        string question;
        string[] options;
        uint256 expiryTime;
    }

    /**
    @param _question : the question string of the poll
    @param _expiryTime : the time (in seconds) at which the poll will expire , not letting any further votes
    @param _options : the string of options in the poll
    @return success : returns success => true when flow was successful
    Allows any user to create a poll
    */
    function createPoll(string calldata _question, uint256 _expiryTime, string[] calldata _options) external returns(bool success) {
        require(_expiryTime > block.timestamp, "Invalid expiry time");
        require(_options.length >= 2, "Atleast 2 options");

        idCounter++;
        idToPoll[idCounter] = Poll(_question, _options, _expiryTime);

        return true;
    }

    /**
    @param pollId : id of the poll
    @param choice : choice number of the options of the poll
    @return success : returns success => true when flow was successful
    Allows any user to vote on any active poll
    */
    function voteOnPoll(uint256 pollId, uint256 choice) external returns(bool success){
        require(idCounter >= pollId, "Invalid poll id");
        require(idToPoll[pollId].expiryTime >= block.timestamp, "Poll has expired");
        require(choice <= idToPoll[pollId].options.length, "Invalid choice" );
        require(alreadyVoted[pollId][msg.sender] == false, "Already voted");

        counts[pollId][choice-1]++;
        alreadyVoted[pollId][msg.sender] = true;

        return true;
    }

    /**
    @param pollId : id of the poll
    @return question : the question string of the poll
    @return options : the string of options in the poll
    @return res : the number of votes corresponding to the options
    Allows any user to fetch the question, options of the poll and the poll result of the poll so far
    */
    function getPollResult(uint256 pollId) external view returns(string memory question, string[] memory options, uint256[] memory res) {
        require(idCounter >= pollId, "Invalid poll id");

        uint256[] memory result = new uint256[](idToPoll[pollId].options.length);
        uint256 size = idToPoll[pollId].options.length;

        for(uint i =0; i<size ; i++){
            result[i] = counts[pollId][i];
        }

        return(idToPoll[pollId].question, idToPoll[pollId].options, result);
    }

    /** Get current time in seconds
    @return options : the string of options in the poll
    */
    function getCurrentTime() external view returns(uint256) {
        return block.timestamp;
    }

}