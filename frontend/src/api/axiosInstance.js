// axiosInstance.js — centralised Axios configuration
// All API requests go through this instance so that:
//   1. Base URL is set once and changed in one place
//   2. JWT is automatically attached to every outgoing request
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot backend
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ───────────────────────────────────────────────────────
// Reads the token from localStorage and injects "Authorization: Bearer <token>"
// before every request is dispatched.
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

// ── Response interceptor ──────────────────────────────────────────────────────
// Globally handle 401 Unauthorized: clear storage and redirect to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
