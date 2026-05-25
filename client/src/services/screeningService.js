import api from './api';
export const createScreening = (data) => api.post('/screenings', data);
export const getScreenings = (params) => api.get('/screenings', { params });
export const getStats = () => api.get('/screenings/stats');
export const getVillageSummary = () => api.get('/screenings/village-summary');
export const getWeeklyTrend = () => api.get('/screenings/weekly');
