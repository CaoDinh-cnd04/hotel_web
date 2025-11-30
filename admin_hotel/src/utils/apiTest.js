// Utility to test API connection
import { API_BASE_URL } from '../config/api'

export const testAPIConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      return { success: false, error: `Server responded with status ${response.status}` }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Cannot connect to server',
      details: `Make sure backend is running at ${API_BASE_URL.replace('/api', '')}`
    }
  }
}


