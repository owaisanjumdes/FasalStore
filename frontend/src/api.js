import axios from 'axios'

// Base URL of your Flask backend
const API_BASE_URL = 'http://127.0.0.1:5000'

// Create an axios instance (so we can configure things in one place)
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ----------------------------
// API functions
// ----------------------------

/**
 * Fetch all storages along with unique crops + areas (metadata).
 * Used by: Map page, Analytics page, Search dropdown, etc.
 */
export const getAllStorages = async () => {
    const response = await api.get('/storages')
    return response.data
}

/**
 * Get filtered storage recommendations for a specific crop.
 * Used by: Search page.
 */
export const recommendStorages = async (crop) => {
    const response = await api.post('/recommend', { crop })
    return response.data
}

/**
 * Health check - verify backend is alive.
 * Used by: Landing page (optional connection indicator).
 */
export const checkBackendHealth = async () => {
    const response = await api.get('/')
    return response.data
}

export default api