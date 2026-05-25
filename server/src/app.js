const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const screeningRoutes = require('./routes/screening.routes');
const alertRoutes = require('./routes/alert.routes');
const followupRoutes = require('./routes/followup.routes');
const referralRoutes = require('./routes/referral.routes');
const diabetesRoutes = require('./routes/diabetes.routes');

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'NirAmaya',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/diabetes', diabetesRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;