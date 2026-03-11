import { useState, useEffect } from 'react';

const Step4PaymentLogging = ({ onNext, onBack, claimData }) => {
  const [currency, setCurrency] = useState('crypto'); // crypto or fiat
  const [processing, setProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');

  const payout = claimData.payoutAmount > 0 ? claimData.payoutAmount : 0;
  const cryptoRate = 1.0; // Assume stablecoin USDC 1:1

  useEffect(() => {
    // Generate a mock IPFS hash for the immutable log immediately upon reaching this step
    setIpfsHash('Qm' + Array.from({length: 44}, () => Math.floor(Math.random()*16).toString(16)).join(''));
  }, []);

  const handleApprove = () => {
    setProcessing(true);
    setTimeout(() => {
      setTxHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
      setProcessing(false);
    }, 4000);
  };

  const deduct = 500;
  const isEscrow = payout > 5000;

  return (
    <div className="fade-in">
      <h2>Automated Calculation Dashboard & Ledger</h2>
      
      <div className="grid grid-2 mb-4">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Fiat Payout</h3>
          <div className="flex justify-between mt-2"><span>Total Repair:</span> <span>${claimData.damageData?.cost}</span></div>
          <div className="flex justify-between mt-2"><span>Deductible:</span> <span style={{ color: 'var(--color-error)' }}>-${deduct}</span></div>
          <div className="flex justify-between mt-4" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Final USD:</span> <span style={{ color: 'var(--color-success)' }}>${payout.toFixed(2)}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(31,40,51,0.8), rgba(189,0,255,0.2))' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Crypto Payout (USDC)</h3>
          <div className="flex justify-between mt-2"><span>Current Oracle Rate:</span> <span>1 USDC = $1.00 USD</span></div>
          <div className="flex justify-between mt-2"><span>Network Fee:</span> <span>~$0.54</span></div>
          <div className="flex justify-between mt-4" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Final USDC:</span> <span style={{ color: 'var(--color-primary)' }}>{(payout * cryptoRate).toFixed(2)} USDC</span>
          </div>
        </div>
      </div>

      {isEscrow && (
        <div className="glass-card mb-4" style={{ background: 'rgba(69, 243, 255, 0.1)', borderColor: 'var(--color-primary)' }}>
          <h3 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔒 Smart Contract Escrow Activated
          </h3>
          <p>Because the payout exceeds <strong>$5,000</strong>, funds will be held in a smart contract escrow. They will be automatically released when the repair shop uploads the final invoice or after 7 days without dispute.</p>
        </div>
      )}

      <div className="glass-card mb-4">
        <h3>Payout Preference</h3>
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ marginTop: '0.5rem' }} disabled={txHash !== ''}>
          <option value="crypto">Cryptocurrency (Coinbase Dev / USDC)</option>
          <option value="fiat">Fiat Bank Transfer (ACH)</option>
        </select>
        
        {currency === 'crypto' && !txHash && (
          <div className="mt-4 fade-in">
            <label>Recipient Wallet Address (Polygon / Ethereum)</label>
            <input type="text" placeholder="0x..." />
          </div>
        )}
      </div>

      <div className="glass-card mb-4" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex justify-between items-center mb-2">
          <h4 style={{ margin: 0, color: '#c5c6c7' }}>Immutable Log (IPFS)</h4>
          <span className="badge success">Anchored</span>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-primary)', wordBreak: 'break-all' }}>
          ipfs://{ipfsHash}
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>All image metadata, model heatmap coordinates, and geo-stamps are permanently hashed.</p>
      </div>

      {!txHash ? (
        <div className="flex justify-between mt-4">
          <button className="secondary" onClick={onBack} disabled={processing}>Back</button>
          <button onClick={handleApprove} disabled={processing || claimData.requiresHumanReview}>
            {processing ? 'Broadcasting Tx...' : (claimData.requiresHumanReview ? 'Awaiting Audit' : 'Approve & Release Funds')}
          </button>
        </div>
      ) : (
        <div className="fade-in mt-4 text-center">
          <div style={{ padding: '1rem', background: 'rgba(0, 255, 157, 0.1)', borderRadius: '8px', border: '1px solid var(--color-success)' }}>
              <h3 style={{ color: 'var(--color-success)', margin: 0 }}>Transaction Successful</h3>
            <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.5rem', wordBreak: 'break-all' }}>Tx Hash: {txHash}</p>
          </div>
          <button className="secondary mt-4" onClick={onNext}>Finish & View Appeal Options</button>
        </div>
      )}

    </div>
  );
};

export default Step4PaymentLogging;
