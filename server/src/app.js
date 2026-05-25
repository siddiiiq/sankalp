const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const screeningRoutes = require('./routes/screening.routes');
const alertRoutes = require('./routes/alert.routes');
const followupRoutes = require('./routes/followup.routes');
const referralRoutes = require('./routes/referral.routes');
const diabetesRoutes = require('./routes/diabetes.routes');   // NEW

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', app: 'NirAmaya' })
);

app.use('/api/auth',      authRoutes);
app.use('/api/patients',  patientRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/alerts',    alertRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/diabetes',  diabetesRoutes);   // NEW

app.use(errorHandler);

module.exports = app;
