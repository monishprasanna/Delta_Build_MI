import { useState, useEffect } from 'react';

function App() {
  const [formData, setFormData] = useState({
    recipientAddress: '',
    amount: '',
  });
  
  const [status, setStatus] = useState('idle'); // idle, verifying, success, error
  const [txDetails, setTxDetails] = useState(null);
  const [senderAddress, setSenderAddress] = useState('Loading...');

  useEffect(() => {
    const fetchSender = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/address', {
          method: 'POST'
        });
        const data = await res.json();
        if (data.address) setSenderAddress(data.address);
        else setSenderAddress('Error loading address');
      } catch (e) {
        setSenderAddress('Error fetching');
      }
    };
    fetchSender();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('verifying');
    
    try {
      const response = await fetch('http://localhost:3001/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientAddress: formData.recipientAddress,
          amount: formData.amount
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }
      
      setStatus('success');
      setTxDetails(session);
      
    } catch(err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>INSURANCE SMART CLAIM</h1>
        <p>Direct Metamask Automation Setup</p>
      </header>

      <div className="grid grid-2">
        <div className="glass-card">
          <div style={{ padding: '1rem', background: '#000', color: '#0f0', border: '2px solid #000', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' }}>SENDER WALLET ADDRESS (METAMASK BOT)</div>
            {senderAddress}
          </div>

          <h2>Send Claim Payout</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
            Initiate an automated Ethereum testnet transfer directly from your backend Metamask robot.
          </p>

          <form onSubmit={handleSubmit} className="flex-col">
            <div>
              <label>Recipient Address</label>
              <input 
                type="text" 
                value={formData.recipientAddress} 
                onChange={e => setFormData({...formData, recipientAddress: e.target.value})}
                placeholder="0x..."
                required 
              />
            </div>

            <div className="flex gap-4">
              <div style={{ flex: 2 }}>
                <label>Amount (ETH)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  required 
                />
              </div>
            </div>

            <button type="submit" disabled={status === 'verifying'} className="mt-4">
              {status === 'verifying' ? 'Broadcasting to Hoodi Testnet...' : 'Execute Automated Transfer'}
            </button>
          </form>
        </div>

        <div className="glass-card flex-col justify-between">
          <div>
            <h2>Transaction Ledger</h2>
            <div style={{ padding: '1rem', background: '#000', color: '#fff', border: '2px solid #000', marginTop: '1rem', minHeight: '200px' }}>
              <h4 style={{ color: '#fff' }}>Logs</h4>
              <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem' }}>
                <span style={{ color: '#0f0' }}>&gt;</span> Ethers.js API Logic Loaded...
              </p>

              {status === 'verifying' && (
                <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', opacity: 0.7 }}>
                  <span style={{ color: '#0f0' }}>&gt;</span> Signing with private key & awaiting transaction confirmation...
                </p>
              )}

              {status === 'error' && (
                <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff4444' }}>
                  <span style={{ color: '#ff4444' }}>&gt;</span> ERROR: Transaction failed! Invalid RPC URL, gas settings, or not enough test ETH.
                </p>
              )}

              {status === 'success' && txDetails && (
                <div className="fade-in" style={{ marginTop: '1rem' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f0', marginBottom: '1rem' }}>
                    &gt; Transaction Confirmed!
                  </p>
                  <ul style={{ listStyle: 'none', fontFamily: 'monospace', fontSize: '0.8rem', paddingLeft: '1rem', borderLeft: '2px solid #333' }}>
                    <li className="mb-2"><strong>Status:</strong> <span className="badge success">VERIFIED</span></li>
                    <li className="mb-2"><strong>Time:</strong> {txDetails.timestamp}</li>
                    <li className="mb-2"><strong>Asset:</strong> {txDetails.amountSent}</li>
                    <li className="mb-2"><strong>From:</strong> {txDetails.sender ? `${txDetails.sender.substring(0,8)}...${txDetails.sender.substring(txDetails.sender.length-6)}` : 'Wallet'}</li>
                    <li className="mb-2"><strong>To:</strong> {txDetails.recipient.substring(0,8)}...{txDetails.recipient.substring(txDetails.recipient.length-6)}</li>
                    <li style={{ wordBreak: 'break-all' }}><strong>Hash:</strong> {txDetails.txHash}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '2px dashed #000' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Note: Your Metamask Private Key is securely held by the Express.js backend and is strictly interacting via standard Ethers.js RPC methods.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
