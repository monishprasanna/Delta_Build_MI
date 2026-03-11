import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    walletId: 'default-wallet',
    recipientAddress: '',
    amount: '',
    assetId: 'usdc',
  });
  const [status, setStatus] = useState('idle'); // idle, verifying, success, error
  const [txDetails, setTxDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('verifying');
    
    try {
      const response = await fetch('http://localhost:3001/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const session = await response.json();
      
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
        <h1>CDP Payout Verifier</h1>
        <p>Coinbase Developer Platform Integration</p>
      </header>

      <div className="grid grid-2">
        <div className="glass-card">
          <h2>Send & Verify Crypto</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
            Initiate a transfer from your CDP managed wallet to a recipient address and verify its completion on-chain.
          </p>

          <form onSubmit={handleSubmit} className="flex-col">
            <div>
              <label>Source Wallet ID</label>
              <input 
                type="text" 
                value={formData.walletId} 
                onChange={e => setFormData({...formData, walletId: e.target.value})}
                placeholder="Managed Wallet UUID"
                required 
              />
            </div>
            
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
                <label>Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  required 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Asset</label>
                <select 
                  value={formData.assetId} 
                  onChange={e => setFormData({...formData, assetId: e.target.value})}
                >
                  <option value="usdc">USDC</option>
                  <option value="eth">ETH</option>
                  <option value="btc">BTC</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={status === 'verifying'} className="mt-4">
              {status === 'verifying' ? 'Broadcasting to Network...' : 'Execute CDP Transfer'}
            </button>
          </form>
        </div>

        <div className="glass-card flex-col justify-between">
          <div>
            <h2>Transaction Ledger</h2>
            <div style={{ padding: '1rem', background: '#000', color: '#fff', border: '2px solid #000', marginTop: '1rem', minHeight: '200px' }}>
              <h4 style={{ color: '#fff' }}>Logs</h4>
              <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem' }}>
                <span style={{ color: '#0f0' }}>&gt;</span> Connecting to portal.cdp.coinbase.com...
              </p>
              
              {status === 'verifying' && (
                <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', opacity: 0.7 }}>
                  <span style={{ color: '#0f0' }}>&gt;</span> Awaiting wallet signature and network broadcast...
                </p>
              )}

              {status === 'error' && (
                <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#ff4444' }}>
                  <span style={{ color: '#ff4444' }}>&gt;</span> ERROR: Insufficient funds or network congestion.
                </p>
              )}

              {status === 'success' && (
                <div className="fade-in" style={{ marginTop: '1rem' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f0', marginBottom: '1rem' }}>
                    &gt; Transaction Confirmed!
                  </p>
                  <ul style={{ listStyle: 'none', fontFamily: 'monospace', fontSize: '0.8rem', paddingLeft: '1rem', borderLeft: '2px solid #333' }}>
                    <li className="mb-2"><strong>Status:</strong> <span className="badge success">VERIFIED</span></li>
                    <li className="mb-2"><strong>Time:</strong> {txDetails.timestamp}</li>
                    <li className="mb-2"><strong>Asset:</strong> {txDetails.amountSent}</li>
                    <li className="mb-2"><strong>To:</strong> {txDetails.recipient.substring(0,8)}...{txDetails.recipient.substring(txDetails.recipient.length-6)}</li>
                    <li style={{ wordBreak: 'break-all' }}><strong>Hash:</strong> {txDetails.txHash}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '2px dashed #000' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Note: To fully connect to Coinbase CDP, a backend Node.js proxy is required to protect your `API_KEY_NAME` and `API_KEY_PRIVATE_KEY`. This frontend sends requests to your internal endpoint.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
