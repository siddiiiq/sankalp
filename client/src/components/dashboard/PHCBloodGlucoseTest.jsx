import { useState, useEffect } from 'react';
import { recordPHCTest } from '../../services/screeningService';

const THRESHOLDS = {
  fasting:      { normal: 100, diabetic: 126 },
  random:       { normal: 140, diabetic: 200 },
  postprandial: { normal: 140, diabetic: 200 }
};

const RESULT_CONFIG = {
  normal: {
    color:   'bg-green-50 border-green-300 text-green-800',
    badge:   'bg-green-100 text-green-700',
    icon:    '✅',
    label:   'Normal',
    outcome: 'Manage at PHC — no referral needed'
  },
  prediabetic: {
    color:   'bg-yellow-50 border-yellow-300 text-yellow-800',
    badge:   'bg-yellow-100 text-yellow-700',
    icon:    '⚠️',
    label:   'Pre-diabetic',
    outcome: 'Lifestyle intervention required — refer to CHC if no improvement'
  },
  diabetic: {
    color:   'bg-red-50 border-red-300 text-red-800',
    badge:   'bg-red-100 text-red-700',
    icon:    '🔴',
    label:   'Diabetic',
    outcome: 'Refer to CHC immediately for classification and treatment'
  }
};

export default function PHCBloodGlucoseTest({ screening, onTestComplete, onReferToCHC }) {
  const [form, setForm]     = useState({ bloodGlucose: '', testType: 'fasting', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [result, setResult] = useState(null);

  // FIX: sync result whenever the screening prop changes (e.g. after handleTestComplete)
  useEffect(() => {
    const existing = screening?.phcTest;
    // Only treat as a valid result if glucoseResult is a known key
    if (existing?.glucoseResult && RESULT_CONFIG[existing.glucoseResult]) {
      setResult(existing);
    } else {
      setResult(null);
    }
  }, [screening]);

  const thresholds = THRESHOLDS[form.testType];

  const handleSubmit = async () => {
    if (!form.bloodGlucose) { setError('Enter a blood glucose value'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await recordPHCTest(screening._id, form);
      const phcTest = res.data.screening.phcTest;
      // FIX: only set if glucoseResult is valid
      if (phcTest?.glucoseResult && RESULT_CONFIG[phcTest.glucoseResult]) {
        setResult(phcTest);
      }
      onTestComplete?.(res.data.screening);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save test result');
    } finally {
      setSaving(false);
    }
  };

  // FIX: cfg is only derived when result AND glucoseResult are valid
  const cfg = (result && RESULT_CONFIG[result.glucoseResult]) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-700">🩸 PHC Blood Glucose Test</h3>

        {/* FIX: guard with cfg — was crashing when result existed but cfg was undefined */}
        {result && cfg && (
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${cfg.badge}`}>
            {cfg.icon} {cfg.label}
          </span>
        )}
      </div>

      {/* ── Test not yet done ── */}
      {!result && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Record the blood glucose test performed at PHC for this high-risk patient.
          </p>

          {/* test type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
            <div className="flex gap-2">
              {['fasting', 'random', 'postprandial'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, testType: t }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    form.testType === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {form.testType === 'fasting'
                ? 'Fasting: Normal <100 · Pre-diabetic 100–125 · Diabetic ≥126 mg/dL'
                : 'Random/PP: Normal <140 · Pre-diabetic 140–199 · Diabetic ≥200 mg/dL'}
            </p>
          </div>

          {/* value input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Glucose Value
            </label>
            <div className="relative">
              <input
                type="number"
                className="input-field pr-16"
                placeholder="e.g. 118"
                value={form.bloodGlucose}
                onChange={e => setForm(f => ({ ...f, bloodGlucose: e.target.value }))}
              />
              <span className="absolute right-3 top-2 text-gray-400 text-xs">mg/dL</span>
            </div>

            {/* live threshold indicator */}
            {form.bloodGlucose && (
              <div className={`mt-2 text-xs font-medium px-3 py-1.5 rounded-lg ${
                Number(form.bloodGlucose) < thresholds.normal
                  ? 'bg-green-50 text-green-700'
                  : Number(form.bloodGlucose) < thresholds.diabetic
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {Number(form.bloodGlucose) < thresholds.normal
                  ? '✅ Within normal range'
                  : Number(form.bloodGlucose) < thresholds.diabetic
                  ? '⚠️ Pre-diabetic range'
                  : '🔴 Diabetic range — CHC referral needed'}
              </div>
            )}
          </div>

          {/* notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Notes (optional)
            </label>
            <textarea
              className="input-field h-20 resize-none"
              placeholder="Any clinical observations..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg p-2">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? 'Saving...' : '💉 Record Blood Glucose Test'}
          </button>
        </div>
      )}

      {/* ── Test result card ── */}
      {/* FIX: guard with cfg so we never access cfg.color etc. on undefined */}
      {result && cfg && (
        <div className={`rounded-xl border-2 p-4 space-y-4 ${cfg.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-70">
                {result.testType} blood glucose — tested{' '}
                {result.testedAt
                  ? new Date(result.testedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : ''}
              </p>
              <p className="text-3xl font-black mt-1">{result.bloodGlucose} mg/dL</p>
            </div>
            <div className="text-4xl">{cfg.icon}</div>
          </div>

          <div className="bg-white/60 rounded-lg p-3 text-sm font-medium">
            📋 {cfg.outcome}
          </div>

          {/* Ayurvedic recommendations */}
          {result.ayurvedicRecommendations?.length > 0 && (
            <div>
              <p className="text-sm font-bold mb-2">🌿 Ayurvedic Recommendations</p>
              <ul className="space-y-1">
                {result.ayurvedicRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 font-bold mt-0.5">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.notes && (
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs font-medium opacity-70 mb-1">Doctor notes</p>
              <p className="text-sm">{result.notes}</p>
            </div>
          )}

          {/* CHC referral button — only when outcome is refer_to_chc */}
          {result.outcome === 'refer_to_chc' && (
            <button
              onClick={onReferToCHC}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              🏥 Refer to CHC for Type 1 / Type 2 Classification
            </button>
          )}
        </div>
      )}
    </div>
  );
}