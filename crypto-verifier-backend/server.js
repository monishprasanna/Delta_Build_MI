require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Note: Official CDP SDK allows you to configure with API Key ID & Private Key.
// Depending on whether it's the EC private key or standard secret, we pass it based on SDK instructions.
// Below we import the SDK, but we wrap it in a mock/try-catch mechanism for demonstration.
const { Coinbase, Wallet } = require('@coinbase/coinbase-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Set up the API Key config. Ensure your env variables match what the SDK expects.
// If your private key doesn't have the standard BEGIN/END blocks, it might throw an error.
const apiKeyName = process.env.CDP_API_KEY_NAME;
const privateKey = process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, '\n');

try {
  if (apiKeyName && privateKey) {
    Coinbase.configure({ apiKeyName: apiKeyName, privateKey: privateKey });
    console.log("Coinbase SDK Configured successfully!");
  } else {
    console.log("SDK not configured (Missing ENVs).");
  }
} catch (e) {
  console.error("SDK Configuration Error:", e.message);
}

app.post('/api/transfer', async (req, res) => {
  const { walletId, recipientAddress, amount, assetId } = req.body;

  try {
    console.log(`Received request to transfer ${amount} ${assetId} to ${recipientAddress} via ${walletId}.`);

    // In a fully working production app where the SDK is completely set up:
    // const wallet = await Wallet.import(walletId); 
    // const transfer = await wallet.createTransfer({ amount, assetId, destination: recipientAddress });
    // await transfer.wait();
    
    // Because we just supplied a partial key and we don't have a fully bootstrapped wallet ID registered
    // on this account here yet, we'll simulate the response exactly how the real SDK would emit it:
    
    // Mock the success structure returned by CDP SDK for frontend testing:
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 95% success rate
      if (isSuccess) {
        res.json({
          status: 'success',
          txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          network: 'ethereum-sepolia',
          explorerUrl: `https://sepolia.etherscan.io/tx/`,
          timestamp: new Date().toLocaleString(),
          recipient: recipientAddress,
          amountSent: `${amount} ${assetId.toUpperCase()}`
        });
      } else {
        res.status(500).json({ error: "Network error or insufficient funds simulated." });
      }
    }, 2000);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Coinbase CDP Backend Proxy running on port ${PORT}`);
});
