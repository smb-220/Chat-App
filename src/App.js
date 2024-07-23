import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
  const contractABI = [/* ABI from compiled contract */];
  const contractAddress = 'your_contract_address';
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const messages = await axios.get('/getMessages');
    setMessages(messages.data);
  };

  const sendMessage = async () => {
    await axios.post('/sendMessage', { content: messageContent });
    setMessageContent('');
    fetchMessages();
  };

  return (
    <div>
      <h1>AI-Powered Blockchain Chat App</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.content} - {msg.sentiment}</p>
          </div>
        ))}
      </div>
      <div>
        <input 
          type="text" 
          value={messageContent} 
          onChange={(e) => setMessageContent(e.target.value)} 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
