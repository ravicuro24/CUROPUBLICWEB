import axios from 'axios'

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://test.curo24.com/', // 🔹 Replace with your actual API endpoint
  timeout: 10000, // optional
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Optional: Add interceptors for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Optional: Handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Redirecting to login...')
      // You could clear auth & redirect if needed
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
