const Screening = require('../models/Screening.model');
const Patient = require('../models/Patient.model');
const Alert = require('../models/Alert.model');
const FollowUp = require('../models/FollowUp.model');
const User = require('../models/User.model');

const { calculateRisk } = require('../engine/riskEngine');

const generateFollowUpDate = require('../utils/generateFollowUpDate');

const { sendHighRiskAlert } = require('../services/emailService');

const asyncHandler = require('../utils/asyncHandler');

// ── Ayurvedic recommendations per glucose outcome ─────────────────────
const AYURVEDIC_RECS = {
  normal: [
    'Blood glucose is normal — maintain a healthy lifestyle',
    'Reduce processed sugar, white rice, and refined carbs',
    'Practise yoga and pranayama daily (30 minutes)',
    'Include bitter gourd (karela) and fenugreek (methi) regularly in meals',
    'Drink warm water with half a teaspoon of turmeric every morning',
    'Routine screening every 6 months is recommended'
  ],

  prediabetic: [
    'Strict dietary changes — avoid sugar, white rice, and maida products',
    'Ayurvedic herbs: bitter gourd juice, fenugreek seeds soaked overnight, neem leaves, jamun seed powder',
    'Yoga therapy: Surya Namaskar and Kapalbhati pranayama — 30–45 minutes daily',
    'Walk briskly for 45 minutes every morning — essential for glucose regulation',
    'Triphala churna: one teaspoon in warm water before bed',
    'Manage stress — practise meditation for 20 minutes daily',
    'Repeat blood glucose test in 1 month'
  ],

  diabetic: [
    'Refer to CHC immediately for Type 1 / Type 2 classification and treatment plan',
    'No added sugar; switch from rice and wheat to millets (ragi, jowar, bajra)',
    'Ayurvedic management: Guduchi (Giloy), bitter gourd capsules, jamun seed powder daily',
    'Yoga asanas for diabetes: Paschimottanasana, Halasana, Dhanurasana — under guidance',
    'Strict blood glucose monitoring twice daily',
    'Avoid all forms of stress — regular meditation is essential',
    'Consult CHC doctor for long-term medication and monitoring plan'
  ]
};

// POST /api/screenings
const createScreening = asyncHandler(async (req, res) => {
  const {
    patientId,
    vitals,
    symptoms,
    riskFactors,
    pregnancy,
    ayurvedic
  } = req.body;

  const patient = await Patient.findById(patientId);

  if (!patient) {
    return res.status(404).json({
      message: 'Patient not found'
    });
  }

  // Auto-calculate BMI
  if (vitals.weight && vitals.height) {
    const hm = vitals.height / 100;

    vitals.bmi =
      Math.round((vitals.weight / (hm * hm)) * 10) / 10;
  }

  // Run rule engine
  const result = calculateRisk({
    age: patient.age,

    vitals,

    symptoms,

    riskFactors,

    pregnancy,

    ayurvedic
  });

  // Save screening
  const screening = await Screening.create({
    patientId,

    ashaId: req.user.id,

    vitals,

    symptoms,

    riskFactors,

    pregnancy,

    ayurvedic: ayurvedic || {},

    result
  });

  // Create follow-up record
  await FollowUp.create({
    patientId,

    screeningId: screening._id,

    dueDate: generateFollowUpDate(result.riskLevel)
  });

  // HIGH RISK ALERT
  if (result.riskLevel === 'HIGH') {
    const alert = await Alert.create({
      patientId,

      screeningId: screening._id,

      riskLevel: 'HIGH'
    });

    const asha = await User.findById(req.user.id)
      .select('name phone');

    try {
      await sendHighRiskAlert(
        patient,
        screening,
        asha
      );

      await Alert.findByIdAndUpdate(alert._id, {
        emailSentAt: new Date()
      });
    } catch (err) {
      console.error(
        'Email alert failed:',
        err.message
      );
    }
  }

  res.status(201).json({
    screening,
    result
  });
});

// PATCH /api/screenings/:id/phc-test
const recordPHCTest = asyncHandler(async (req, res) => {
  const {
    bloodGlucose,
    testType,
    notes
  } = req.body;

  const screeningId = req.params.id;

  if (
    !bloodGlucose ||
    isNaN(Number(bloodGlucose))
  ) {
    return res.status(400).json({
      message:
        'A valid blood glucose value is required'
    });
  }

  const value = Number(bloodGlucose);

  const type = testType || 'fasting';

  // ADA diagnostic thresholds
  let glucoseResult;

  if (type === 'fasting') {
    if (value < 100) {
      glucoseResult = 'normal';
    } else if (value < 126) {
      glucoseResult = 'prediabetic';
    } else {
      glucoseResult = 'diabetic';
    }
  } else {
    // random or postprandial
    if (value < 140) {
      glucoseResult = 'normal';
    } else if (value < 200) {
      glucoseResult = 'prediabetic';
    } else {
      glucoseResult = 'diabetic';
    }
  }

  const outcome =
    glucoseResult === 'normal'
      ? 'manage_at_phc'
      : 'refer_to_chc';

  const ayurvedicRecommendations =
    AYURVEDIC_RECS[glucoseResult];

  const screening =
    await Screening.findByIdAndUpdate(
      screeningId,
      {
        $set: {
          phcTest: {
            bloodGlucose: value,

            testType: type,

            glucoseResult,

            testedBy: req.user.id,

            testedAt: new Date(),

            notes: notes || '',

            outcome,

            ayurvedicRecommendations
          }
        }
      },
      {
        new: true
      }
    ).populate(
      'patientId',
      'name age gender village phone'
    );

  if (!screening) {
    return res.status(404).json({
      message: 'Screening not found'
    });
  }

  res.json({
    screening,

    glucoseResult,

    outcome,

    ayurvedicRecommendations
  });
});

// GET /api/screenings?patientId=xxx
const getScreenings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.patientId) {
    filter.patientId = req.query.patientId;
  }

  if (req.user.role === 'asha') {
    filter.ashaId = req.user.id;
  }

  const screenings = await Screening.find(filter)
    .sort({ createdAt: -1 })
    .populate(
      'patientId',
      'name village age gender'
    );

  res.json(screenings);
});

// GET /api/screenings/stats
const getStats = asyncHandler(async (req, res) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const [
    todayCount,
    highRisk,
    mediumRisk,
    lowRisk,
    pendingAlerts,
    pendingFollowups
  ] = await Promise.all([
    Screening.countDocuments({
      createdAt: { $gte: today }
    }),

    Screening.countDocuments({
      'result.riskLevel': 'HIGH'
    }),

    Screening.countDocuments({
      'result.riskLevel': 'MEDIUM'
    }),

    Screening.countDocuments({
      'result.riskLevel': 'LOW'
    }),

    Alert.countDocuments({
      status: 'pending'
    }),

    FollowUp.countDocuments({
      status: {
        $in: ['pending', 'overdue']
      },

      dueDate: {
        $lte: new Date()
      }
    })
  ]);

  res.json({
    todayCount,

    highRisk,

    mediumRisk,

    lowRisk,

    pendingAlerts,

    pendingFollowups
  });
});

// GET /api/screenings/village-summary
const getVillageSummary = asyncHandler(async (req, res) => {
  const summary = await Screening.aggregate([
    {
      $lookup: {
        from: 'patients',

        localField: 'patientId',

        foreignField: '_id',

        as: 'patient'
      }
    },

    {
      $unwind: '$patient'
    },

    {
      $group: {
        _id: '$patient.village',

        total: {
          $sum: 1
        },

        high: {
          $sum: {
            $cond: [
              {
                $eq: [
                  '$result.riskLevel',
                  'HIGH'
                ]
              },
              1,
              0
            ]
          }
        },

        medium: {
          $sum: {
            $cond: [
              {
                $eq: [
                  '$result.riskLevel',
                  'MEDIUM'
                ]
              },
              1,
              0
            ]
          }
        },

        low: {
          $sum: {
            $cond: [
              {
                $eq: [
                  '$result.riskLevel',
                  'LOW'
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },

    {
      $sort: {
        high: -1
      }
    }
  ]);

  res.json(summary);
});

// GET /api/screenings/weekly
const getWeeklyTrend = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 7
  );

  const data = await Screening.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sevenDaysAgo
        }
      }
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',

            date: '$createdAt'
          }
        },

        count: {
          $sum: 1
        }
      }
    },

    {
      $sort: {
        _id: 1
      }
    }
  ]);

  res.json(data);
});

module.exports = {
  createScreening,

  recordPHCTest,

  getScreenings,

  getStats,

  getVillageSummary,

  getWeeklyTrend
};