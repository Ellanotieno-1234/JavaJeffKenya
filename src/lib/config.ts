export const API_BASE_URL = 'https://javajeffkenya-4-gf2j.onrender.com';

// Ensure we're using HTTPS in production
if (process.env.NODE_ENV === 'production' && !API_BASE_URL.startsWith('https')) {
    console.warn('Warning: API_BASE_URL should use HTTPS in production');
}