import { useState } from 'react';
import Step1Initiation from './components/Step1Initiation';
import Step2ImageAcquisition from './components/Step2ImageAcquisition';
import Step3AnalysisDashboard from './components/Step3AnalysisDashboard';
import Step4PaymentLogging from './components/Step4PaymentLogging';
import Step5Appeal from './components/Step5Appeal';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [claimData, setClaimData] = useState({
    policyNumber: '',
    claimType: '',
    description: '',
    verified: false,
    images: [],
    fraudScore: null,
    vehicleMatch: null,
    damageData: null,
    payoutAmount: 0,
    requiresHumanReview: false,
    status: 'pending' // pending, approved, denied, appealed
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const updateClaimData = (data) => setClaimData(prev => ({ ...prev, ...data }));

  return (
    <div className="app-container fade-in">
      <header className="app-header slide-up">
        <h1>INSURANCE SMART CLAIM</h1>
        <p>AI-Powered Autonomous Claim Adjustment</p>
      </header>

      <div className="step-indicator slide-up">
        {[1, 2, 3, 4, 5].map((step, index) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}></div>
            {index < 4 && <div className={`step-line ${currentStep > step ? 'completed' : ''}`}></div>}
          </div>
        ))}
      </div>

      <main className="glass-card slide-up">
        {currentStep === 1 && <Step1Initiation onNext={handleNext} claimData={claimData} updateData={updateClaimData} />}
        {currentStep === 2 && <Step2ImageAcquisition onNext={handleNext} onBack={handleBack} claimData={claimData} updateData={updateClaimData} />}
        {currentStep === 3 && <Step3AnalysisDashboard onNext={handleNext} onBack={handleBack} claimData={claimData} updateData={updateClaimData} />}
        {currentStep === 4 && <Step4PaymentLogging onNext={handleNext} onBack={handleBack} claimData={claimData} updateData={updateClaimData} />}
        {currentStep === 5 && <Step5Appeal onBack={handleBack} claimData={claimData} />}
      </main>
    </div>
  );
}

export default App;
