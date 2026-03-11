import { useState } from 'react';

const Step5Appeal = ({ onBack, claimData }) => {
  const [appealed, setAppealed] = useState(false);
  const [appealReason, setAppealReason] = useState('');

  const handleAppeal = (e) => {
    e.preventDefault();
    setAppealed(true);
  };

  if (appealed) {
    return (
      <div className="fade-in text-center" style={{ padding: '2rem 1rem' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Appeal Submitted Successfully</h2>
        <p>A dedicated human adjuster has been assigned to your case.</p>
        
        <div className="glass-card mt-4 mb-4 text-left" style={{ textAlign: 'left', background: 'rgba(0,0,0,0.5)' }}>
          <h4 style={{ color: '#c5c6c7' }}>What happens next?</h4>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', opacity: 0.8 }}>
            <li className="mb-2">All previous images, ML outputs, and logs are preserved on IPFS.</li>
            <li className="mb-2">Your dedicated adjuster will review and contact you within 24 hours.</li>
            <li>No automated decisions will be finalized until the appeal concludes.</li>
          </ul>
        </div>
      </div>
    );
  }

  const isDeniedOrFlagged = claimData.requiresHumanReview;

  return (
    <div className="fade-in">
      <h2>Post-Claim Actions</h2>
      
      {isDeniedOrFlagged ? (
        <div className="mb-4">
          <h3 style={{ color: '#ffaa00' }}>Your claim is under manual audit.</h3>
          <p>Because your claim tripped our automated risk thresholds (high cost or anomaly flags), it has been sent to an expert for review.</p>
        </div>
      ) : (
        <div className="mb-4">
          <h3 style={{ color: 'var(--color-success)' }}>Claim Processed & Approved.</h3>
          <p>If you disagree with the payout amount or the damage assessment, you can trigger an appeal below.</p>
        </div>
      )}

      <div className="glass-card" style={{ borderColor: 'var(--color-secondary)' }}>
        <h3>Initiate an Appeal</h3>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Appealing will halt the current payout sequence and assign a senior human adjuster.</p>
        
        <form onSubmit={handleAppeal} className="flex-col mt-4">
          <div>
            <label>Reason for Appeal</label>
            <textarea required rows="4" placeholder="I disagree with the payout because..."
              value={appealReason} onChange={e => setAppealReason(e.target.value)}></textarea>
          </div>
          <button type="submit" className="secondary mt-2" disabled={!appealReason}>Submit Appeal for Human Review</button>
        </form>
      </div>

    </div>
  );
};

export default Step5Appeal;
