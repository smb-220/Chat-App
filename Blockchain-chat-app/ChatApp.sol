// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatApp {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
        string sentiment;
    }

    Message[] public messages;
    mapping(address => uint256) public messageCount;

    event MessageSent(address indexed sender, string content, uint256 timestamp, string sentiment);

    function sendMessage(string memory _content, string memory _sentiment) public {
        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            sentiment: _sentiment
        });

        messages.push(newMessage);
        messageCount[msg.sender] += 1;

        emit MessageSent(msg.sender, _content, block.timestamp, _sentiment);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessageCount(address _user) public view returns (uint256) {
        return messageCount[_user];
    }
}
