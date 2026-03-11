require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL || "https://rpc.hoodi.com";

let provider;
let wallet;

try {
  if (privateKey) {
    provider = new ethers.JsonRpcProvider(rpcUrl);
    wallet = new ethers.Wallet(privateKey, provider);
    console.log("Ethers Wallet Configured successfully! Address:", wallet.address);
  } else {
    console.log("Wallet not configured (Missing PRIVATE_KEY).");
  }
} catch (e) {
  console.error("Wallet Configuration Error:", e.message);
}

app.post('/api/address', async (req, res) => {
  try {
    if (wallet) {
      res.json({ address: wallet.address });
    } else {
      res.json({ address: "Wallet not configured" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transfer', async (req, res) => {
  const { recipientAddress, amount } = req.body;

  try {
    if (!wallet) throw new Error("Wallet not initialized. Check server config.");

    console.log(`Received request to transfer ${amount} ETH to ${recipientAddress}`);
    
    const parsedAmount = ethers.parseEther(amount.toString());
    const chainId = 560048; // Hoodi chain ID
    
    const tx = {
      to: recipientAddress,
      value: parsedAmount,
      gasLimit: 21000,
      maxFeePerGas: ethers.parseUnits("200", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"),
      chainId: chainId
    };
    
    console.log("Sending transaction...");
    const transaction = await wallet.sendTransaction(tx);
    
    console.log("Transaction sent! Hash:", transaction.hash);

    res.json({
      status: 'success',
      txHash: transaction.hash,
      network: 'hoodi-testnet',
      explorerUrl: `https://hoodi.etherscan.io/tx/${transaction.hash}`,
      timestamp: new Date().toLocaleString(),
      recipient: recipientAddress,
      sender: wallet.address,
      amountSent: `${amount} ETH`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Ethers Backend Proxy running on port ${PORT}`);
});
