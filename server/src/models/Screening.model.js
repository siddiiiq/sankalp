const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  ashaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vitals: {
    systolic: Number,
    diastolic: Number,
    bloodSugar: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    waist: Number
  },
  symptoms: {
    urination: Boolean,
    thirst: Boolean,
    vision: Boolean,
    headache: Boolean,
    fatigue: Boolean,
    numbness: Boolean
  },
  riskFactors: {
    familyDiabetes: Boolean,
    familyBP: Boolean,
    smoking: String,   // 'yes' | 'no' | 'ex'
    alcohol: Boolean,
    exercise: String,  // 'none' | 'moderate' | 'active'
    stress: String     // 'low' | 'medium' | 'high'
  },
  pregnancy: {
    isPregnant: Boolean,
    gestationalHistory: Boolean
  },
  result: {
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
    score: Number,
    maxScore: { type: Number, default: 20 },
    flags: [String],
    recommendations: {
      en: [String],
      hi: [String],
      kn: [String]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Screening', screeningSchema);
