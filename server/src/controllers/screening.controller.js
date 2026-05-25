const Screening = require('../models/Screening.model');
const Patient = require('../models/Patient.model');
const Alert = require('../models/Alert.model');
const FollowUp = require('../models/FollowUp.model');
const User = require('../models/User.model');

const { calculateRisk } = require('../engine/riskEngine');

const generateFollowUpDate = require('../utils/generateFollowUpDate');

const { sendHighRiskAlert } = require('../services/emailService');

const asyncHandler = require('../utils/asyncHandler');

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

    ayurvedic,

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
  getScreenings,
  getStats,
  getVillageSummary,
  getWeeklyTrend
};