import { useState, useEffect } from 'react';

const Step1Initiation = ({ onNext, updateData, claimData }) => {
  const [authStep, setAuthStep] = useState(1); // 1: Login, 2: OTP
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '', password: '', otp: '', type: '', description: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setAuthStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setAuthStep(3);
      setLoading(false);
      updateData({ verified: true, policyNumber: formData.id });
    }, 1000);
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    // Mock NLP Analysis
    const nlpScore = formData.description.length > 10 ? Math.random() * 10 : 0;
    
    updateData({
      claimType: formData.type,
      description: formData.description,
      preScreeningScore: nlpScore
    });
    onNext();
  };

  if (authStep === 1) {
    return (
      <div className="fade-in">
        <h2>Identity Verification</h2>
        <p>Please log in securely to initiate your claim process.</p>
        <form onSubmit={handleLogin} className="flex-col mt-4">
          <div>
            <label>Insurance ID (e.g. POL-12345)</label>
            <input required type="text" placeholder="POL-XXXXX" 
              value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
          </div>
          <div>
            <label>Master Password</label>
            <input required type="password" placeholder="••••••••"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    );
  }

  if (authStep === 2) {
    return (
      <div className="fade-in">
        <h2>Multi-Factor Authentication</h2>
        <p>Enter the 6-digit code sent to your registered device.</p>
        <form onSubmit={handleOTP} className="flex-col mt-4">
          <div>
            <label>One-Time Password (OTP)</label>
            <input required type="text" maxLength="6" placeholder="123456"
              value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2>Claim Details & Initial Reporting</h2>
      <div className="flex gap-4 mb-4">
        <span className="badge success">Identity Verified</span>
        <span className="badge info">Policy Active</span>
      </div>
      
      <div className="glass-card mb-4" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
        <h4 style={{ margin: 0 }}>Cross-Reference Data Loaded</h4>
        <ul style={{ listStyle: 'none', fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
          <li>Vehicle: 2022 Tesla Model 3</li>
          <li>Recent Claims: None in 24 months</li>
          <li>Location Match: Nominal</li>
        </ul>
      </div>

      <form onSubmit={handleSubmitClaim} className="flex-col">
        <div>
          <label>Type of Claim</label>
          <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="" disabled>Select an option</option>
            <option value="minor_accident">Accident (Minor)</option>
            <option value="major_accident">Accident (Major)</option>
            <option value="stolen">Stolen</option>
          </select>
        </div>

        {formData.type && formData.type.includes('accident') && (
          <div className="fade-in" style={{ animationDelay: '0.1s' }}>
            <label>Accident Description (Analyzed for consistency)</label>
            <textarea required rows="4" placeholder="Briefly describe what happened..."
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            <small style={{ color: 'var(--color-primary)', display: 'block', marginTop: '0.5rem' }}>
              ✦ NLP Agent is listening to structure your context...
            </small>
          </div>
        )}

        <button type="submit" className="mt-4" disabled={!formData.type || (formData.type.includes('accident') && !formData.description)}>
          Proceed to AI Image Analysis
        </button>
      </form>
    </div>
  );
};

export default Step1Initiation;
