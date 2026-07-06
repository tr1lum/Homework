// ==========================================
// API Configuration - Bank System
// ==========================================

// Backend API base URL - update this when backend is ready
const API_BASE_URL = 'http://localhost:8080/api';

// Unified request wrapper
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Attach auth token if available (saved after login)
    const token = localStorage.getItem('token');
    if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API request error:', error);
        return { code: 500, message: 'Network error, please try again later', data: null };
    }
}

// ==========================================
// Mock Data Mode - for frontend-only demo
// Toggle this to false when backend is ready
// ==========================================
const USE_MOCK = true;

// Mock response helper
function mockResponse(data, message = 'success') {
    return { code: 200, message: message, data: data };
}
