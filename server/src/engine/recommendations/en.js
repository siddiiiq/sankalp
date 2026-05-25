const recommendations = {
  HIGH: {
    default: [
      'Visit PHC immediately — do not delay',
      'Alert sent to your PHC doctor',
      'Strictly avoid sugar, salt, and oily foods',
      'Take prescribed medicines regularly',
      'Check blood pressure daily if possible',
      'Follow up within 7 days'
    ],
    'Diabetic Range': ['Avoid all sweets, rice, and sugary drinks', 'Monitor blood sugar daily'],
    'Hypertensive Crisis': ['Go to hospital emergency immediately', 'Avoid any physical exertion'],
    'Stage 2 Hypertension': ['Reduce salt intake drastically', 'Avoid stress and heavy lifting']
  },
  MEDIUM: {
    default: [
      'Visit PHC within the next 2 weeks',
      'Reduce rice, sugar, and oily food intake',
      'Walk 30 minutes daily',
      'Drink 8 glasses of water daily',
      'Avoid smoking and alcohol',
      'Recheck in 1 month'
    ]
  },
  LOW: {
    default: [
      'Maintain a healthy diet — less rice, more vegetables',
      'Exercise at least 30 minutes daily',
      'Avoid smoking and alcohol',
      'Regular health checkup every 6 months',
      'Stay hydrated — drink plenty of water'
    ]
  }
};

module.exports = recommendations;
