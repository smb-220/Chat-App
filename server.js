const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
const contractABI = [/* ABI from compiled contract */];
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/sendMessage', async (req, res) => {
    const { content } = req.body;
    const sentiment = await analyzeSentiment(content);

    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const tx = contract.methods.sendMessage(content, sentiment);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(account.address);

    const signedTx = await web3.eth.accounts.signTransaction({
        to: contract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: 1
    }, process.env.PRIVATE_KEY);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.send(receipt);
});

app.get('/getMessages', async (req, res) => {
    const messages = await contract.methods.getMessages().call();
    res.send(messages);
});

async function analyzeSentiment(message) {
    const response = await axios.post('https://api.example.com/analyze', { text: message });
    return response.data.sentiment;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
