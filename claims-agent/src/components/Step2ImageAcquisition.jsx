import { useState, useEffect } from 'react';

const Step2ImageAcquisition = ({ onNext, onBack, updateData, claimData }) => {
  const [cameraState, setCameraState] = useState('idle'); // idle, active, processing, success, fail
  const [currentPhotoTarget, setCurrentPhotoTarget] = useState('');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photosCompleted, setPhotosCompleted] = useState([]);

  // Sequence of standard and random shots
  let allTargets = ['Front Bumper', 'Rear Left Quarter', 'Right Side Profile', 'VIN Plate (Random)', 'Odometer Reading (Random)'];
  if (claimData.claimType === 'major_accident') {
    allTargets = ['Copy of FIR / Police Report', ...allTargets];
  } else if (claimData.claimType === 'stolen') {
    allTargets = ['Copy of FIR / Police Report', 'Driver License / ID Card', 'Location of Theft (Surroundings)'];
  }

  useEffect(() => {
    setCurrentPhotoTarget(allTargets[photoIndex]);
  }, [photoIndex]);

  const startCamera = () => setCameraState('active');

  const takePhoto = () => {
    setCameraState('processing');
    
    // Simulate real-time checking, hashing, and environmental checks
    setTimeout(() => {
      // 10% chance to simulate a bad photo (blurry, inconsistent lighting)
      const isBad = Math.random() < 0.1;
      
      if (isBad) {
        setCameraState('fail');
      } else {
        setCameraState('success');
        setPhotosCompleted([...photosCompleted, currentPhotoTarget]);
        
        setTimeout(() => {
          if (photoIndex < allTargets.length - 1) {
            setPhotoIndex(p => p + 1);
            setCameraState('active');
          } else {
            setCameraState('done');
          }
        }, 1500);
      }
    }, 2000);
  };

  const retryPhoto = () => setCameraState('active');

  const skipPhoto = () => {
    setPhotosCompleted([...photosCompleted, currentPhotoTarget]);
    if (photoIndex < allTargets.length - 1) {
      setPhotoIndex(p => p + 1);
      setCameraState('active');
    } else {
      setCameraState('done');
    }
  };

  const handleProceed = () => {
    updateData({ images: photosCompleted });
    onNext();
  };

  if (cameraState === 'done') {
    return (
      <div className="fade-in text-center" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-success)' }}>Image Acquisition Complete</h2>
        <p>All requested angles and random verification items captured successfully.</p>
        <div className="glass-card my-4" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h4>Acquisition Logs:</h4>
          <ul style={{ listStyle: 'none', opacity: 0.8, fontSize: '0.9rem', marginTop: '1rem' }}>
            <li><span style={{color: 'var(--color-success)'}}>✓</span> Cryptographic hashing completed (anti-spoofing)</li>
            <li><span style={{color: 'var(--color-success)'}}>✓</span> Liveness detection passed (real-time stream verified)</li>
            <li><span style={{color: 'var(--color-success)'}}>✓</span> Environmental consistency (Lighting, Geo-GPS, Time) matched</li>
          </ul>
        </div>
        <div className="flex justify-between mt-4">
          <button className="secondary" onClick={onBack}>Back</button>
          <button onClick={handleProceed}>Run ML Analysis Engine</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2>AI-Driven Image Acquisition</h2>
      <p>Please capture live photos of the vehicle guided by the AR overlay.</p>
      
      <div className="flex justify-between items-center mt-4 mb-4">
        <div>
          <span>Progress: {photoIndex} / {allTargets.length} Items Captured</span>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ 
              width: `${(photoIndex / allTargets.length) * 100}%`, 
              height: '100%', 
              background: 'var(--color-primary)', 
              transition: 'width 0.3s ease',
              boxShadow: 'var(--neon-glow-primary)'
            }}></div>
          </div>
        </div>
        <button className="secondary" style={{ fontSize: '0.8rem', padding: '0.5rem' }} onClick={skipPhoto}>
          Skip Current Target (Test)
        </button>
      </div>

      <div style={{ 
        width: '100%', 
        height: '400px', 
        background: cameraState === 'idle' ? 'rgba(0,0,0,0.5)' : '#000', 
        borderRadius: '12px', 
        border: '1px solid ' + (cameraState === 'active' ? 'var(--color-primary)' : cameraState === 'fail' ? 'var(--color-error)' : cameraState === 'success' ? 'var(--color-success)' : 'rgba(255,255,255,0.2)'),
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {cameraState === 'idle' && (
          <button onClick={startCamera}>Start AR Camera</button>
        )}

        {cameraState === 'active' && (
          <div className="fade-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px', color: 'var(--color-error)', fontWeight: 'bold' }}>
              ● REC
            </div>
            <div className="target-overlay" style={{ border: '2px dashed rgba(69, 243, 255, 0.5)', width: '80%', height: '60%', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.5s ease' }}>
              <span style={{ fontSize: '1.2rem', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>Align {currentPhotoTarget} Here</span>
            </div>
            <button onClick={takePhoto} style={{ position: 'absolute', bottom: '20px', borderRadius: '50%', width: '60px', height: '60px', padding: 0 }}></button>
          </div>
        )}

        {cameraState === 'processing' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid transparent', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            <p className="pulse">Analyzing image quality, liveness, & context...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } .pulse { animation: pulse 1s infinite alternate; } @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }`}</style>
          </div>
        )}

        {cameraState === 'success' && (
          <div className="fade-in text-center" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', color: 'var(--color-success)' }}>✓</div>
            <p>Verification Passed</p>
          </div>
        )}

        {cameraState === 'fail' && (
          <div className="fade-in text-center" style={{ textAlign: 'center', padding: '0 2rem' }}>
            <div style={{ fontSize: '3rem', color: 'var(--color-error)', marginBottom: '1rem' }}>⚠</div>
            <h3 style={{ color: 'var(--color-error)' }}>Quality Check Failed</h3>
            <p style={{ opacity: 0.8 }}>Image appears blurry or lighting is completely inconsistent with previous shots.</p>
            <button className="mt-4" onClick={retryPhoto}>Retake Photo</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Step2ImageAcquisition;
