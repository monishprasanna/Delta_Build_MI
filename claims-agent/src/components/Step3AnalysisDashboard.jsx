import { useState, useEffect } from 'react';

const Step3AnalysisDashboard = ({ onNext, onBack, updateData, claimData }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Simulate ML multi-model analysis
    const timer = setTimeout(() => {
      const isMinor = claimData.claimType === 'minor_accident';
      const dmgPct = isMinor ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 40) + 30; // 5-20% for minor, 30-70% for major
      const estCost = isMinor ? (dmgPct * 120) : (dmgPct * 250);
      
      const vehicleConf = 98.4;
      
      // Calculate a fraud score based on pre-screening + random baseline
      const baseFraud = Math.random() * 15;
      const finalFraudScore = claimData.preScreeningScore ? baseFraud + claimData.preScreeningScore : baseFraud;

      const requiresHuman = vehicleConf < 90 || finalFraudScore > 70 || estCost > 5000;

      const res = {
        vehicleMatchConfidence: vehicleConf.toFixed(1),
        damagePercentage: dmgPct,
        estimatedCost: estCost.toFixed(2),
        fraudScore: finalFraudScore.toFixed(1),
        requiresHuman
      };

      setResults(res);
      updateData({
        vehicleMatch: res.vehicleMatchConfidence,
        damageData: { percentage: dmgPct, cost: estCost },
        fraudScore: res.fraudScore,
        requiresHumanReview: requiresHuman,
        payoutAmount: estCost - 500 // Assuming $500 deductible
      });
      setAnalyzing(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (analyzing) {
    return (
      <div className="fade-in text-center" style={{ padding: '4rem 0' }}>
        <h2 className="pulse" style={{ color: 'var(--color-primary)' }}>Running Sequential ML Analysis</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <div className="glass-card" style={{ width: '200px', animation: 'pulse 1s infinite alternate' }}>
            <h4>Model 1</h4>
            <small>Vehicle Verifier</small>
          </div>
          <div className="glass-card" style={{ width: '200px', animation: 'pulse 1s infinite alternate', animationDelay: '0.2s' }}>
            <h4>Model 2</h4>
            <small>Damage Segmenter</small>
          </div>
          <div className="glass-card" style={{ width: '200px', animation: 'pulse 1s infinite alternate', animationDelay: '0.4s' }}>
            <h4>Model 3</h4>
            <small>Fraud Engine</small>
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <progress style={{ width: '60%' }}></progress>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2>ML Analysis Dashboard</h2>
      <p>Results of the autonomous inspection & fraud scoring.</p>

      {results.requiresHuman && (
        <div className="glass-card mb-4" style={{ background: 'rgba(255, 170, 0, 0.1)', borderColor: '#ffaa00' }}>
          <h3 style={{ color: '#ffaa00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Human-in-the-Loop Triggered
          </h3>
          <p>This claim has exceeded automated thresholds (e.g. Cost &gt; $5000 or Fraud Score &gt; 70). It has been queued for a human adjuster.</p>
        </div>
      )}

      <div className="grid grid-2 mb-4">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Identity Verifier</h3>
          <div className="flex justify-between mt-2">
            <span>Profile Match:</span>
            <span style={{ color: results.vehicleMatchConfidence > 90 ? 'var(--color-success)' : 'var(--color-error)' }}>{results.vehicleMatchConfidence}%</span>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>Compared vehicle in images against insurer’s DB (make, model, color, license plate).</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Fraud Engine</h3>
          <div className="flex justify-between mt-2">
            <span>Risk Score (0-100):</span>
            <span style={{ color: results.fraudScore < 30 ? 'var(--color-success)' : results.fraudScore < 70 ? '#ffaa00' : 'var(--color-error)' }}>{results.fraudScore}&nbsp;&nbsp;{results.fraudScore < 30 ? 'Low' : results.fraudScore < 70 ? 'Medium' : 'High'}</span>
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>Combined metadata, geo-location, historical patterns and AI outputs.</p>
        </div>
      </div>

      <div className="glass-card mb-4" style={{ position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ position: 'relative', zIndex: 1 }}>Damage Assessment Topography</h3>
        
        {/* Mock wireframe vehicle heat map overlay */}
        <div style={{ height: '300px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', marginTop: '1rem', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          
          <div style={{ 
            width: '280px', height: '140px', 
            border: '2px solid rgba(69, 243, 255, 0.4)', 
            borderRadius: '40px 10px 10px 40px',
            position: 'absolute',
            boxShadow: 'inset 0 0 20px rgba(69, 243, 255, 0.1)'
          }}></div>

          <div className="pulse" style={{ 
            position: 'absolute', 
            width: '80px', height: '60px', 
            background: 'rgba(255, 42, 95, 0.5)', 
            filter: 'blur(15px)',
            borderRadius: '50%',
            left: '30%', top: '40%'
          }}></div>

          <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--color-surface)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>
            Red Alert: Structural Dent (Confidence 92%)
          </div>

        </div>

        <div className="grid grid-2 mt-4" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8 }}>Severity Area</span>
            <h2 style={{ margin: 0, color: 'var(--color-error)' }}>{results.damagePercentage}%</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8 }}>Est. Repair Cost</span>
            <h2 style={{ margin: 0 }}>${results.estimatedCost}</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="secondary" onClick={onBack}>Back</button>
        <button onClick={onNext}>{results.requiresHuman ? 'Submit for Audit' : 'Proceed to Payment'}</button>
      </div>

    </div>
  );
};

export default Step3AnalysisDashboard;
