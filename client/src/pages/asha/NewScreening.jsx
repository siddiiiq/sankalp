import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import OfflineBanner from '../../components/shared/OfflineBanner';
import StepIndicator from '../../components/screening/StepIndicator';
import Step1PatientInfo from '../../components/screening/Step1PatientInfo';
import Step2Vitals from '../../components/screening/Step2Vitals';
import Step3Symptoms from '../../components/screening/Step3Symptoms';
import Step4RiskFactors from '../../components/screening/Step4RiskFactors';
import Step5Pregnancy from '../../components/screening/Step5Pregnancy';
import { useScreening } from '../../hooks/useScreening';
import { createPatient } from '../../services/patientService';
import { createScreening } from '../../services/screeningService';
import { saveOfflineScreening } from '../../utils/offlineStorage';
import { useOffline } from '../../hooks/useOffline';
import { calculateBMI } from '../../utils/calculateBMI';

export default function NewScreening() {
  const navigate = useNavigate();
  const isOffline = useOffline();
  const { step, data, update, nextStep, prevStep } = useScreening();
  const [createdPatient, setCreatedPatient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePatient = async () => {
    const { name, age, gender, village, phone, aadhaar } = data.patient;
    if (!name || !age || !gender || !village) {
      setError('Please fill in Name, Age, Gender, and Village');
      return;
    }
    setError('');
    try {
      const res = await createPatient({ name, age: Number(age), gender, village, phone, aadhaar });
      setCreatedPatient(res.data);
      nextStep();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register patient');
    }
  };

  const handleSubmit = async () => {
    if (!createdPatient) { setError('Please register the patient first'); return; }
    setSubmitting(true);
    setError('');

    const bmi = calculateBMI(data.vitals.weight, data.vitals.height);
    const payload = {
      patientId: createdPatient._id,
      vitals: { ...data.vitals, bmi,
        systolic: Number(data.vitals.systolic), diastolic: Number(data.vitals.diastolic),
        bloodSugar: Number(data.vitals.bloodSugar), weight: Number(data.vitals.weight),
        height: Number(data.vitals.height), waist: Number(data.vitals.waist)
      },
      symptoms: data.symptoms,
      riskFactors: data.riskFactors,
      pregnancy: data.pregnancy
    };

    try {
      if (isOffline) {
        await saveOfflineScreening({ data: payload, patient: createdPatient });
        navigate('/asha/result', { state: { offline: true, patient: createdPatient } });
        return;
      }
      const res = await createScreening(payload);
      navigate('/asha/result', { state: { result: res.data.result, patient: createdPatient, screening: res.data.screening } });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Data saved offline.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1PatientInfo data={data.patient} onChange={v => update('patient', v)} onCreatePatient={handleCreatePatient} createdPatient={createdPatient} />;
      case 2: return <Step2Vitals data={data.vitals} onChange={v => update('vitals', v)} />;
      case 3: return <Step3Symptoms data={data.symptoms} onChange={v => update('symptoms', v)} />;
      case 4: return <Step4RiskFactors data={data.riskFactors} onChange={v => update('riskFactors', v)} />;
      case 5: return <Step5Pregnancy data={data.pregnancy} onChange={v => update('pregnancy', v)} gender={data.patient.gender} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <OfflineBanner />
      <Navbar />
      <div className="max-w-lg mx-auto p-4">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate('/asha')} className="text-gray-400 hover:text-gray-600 text-2xl">←</button>
          <h1 className="text-xl font-bold text-gray-800">New Screening</h1>
        </div>

        <StepIndicator current={step} />

        <div className="card mb-4">
          {renderStep()}
          {error && <p className="mt-3 text-red-600 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
        </div>

        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={prevStep} className="btn-secondary flex-1">← Back</button>
          )}
          {step > 1 && step < 5 && (
            <button onClick={nextStep} className="btn-primary flex-1">Next →</button>
          )}
          {step === 5 && (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 py-3">
              {submitting ? 'Calculating...' : '✅ Submit & Get Risk Score'}
            </button>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
