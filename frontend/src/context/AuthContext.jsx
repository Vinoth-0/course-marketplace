// AuthContext.jsx — global authentication state
// Provides: user object (email, role), token, login(), logout()
// All child components can consume via useAuth() hook.
import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Rehydrate state from localStorage on first load (persist across refreshes)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  // Keep localStorage in sync whenever user/token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  /**
   * login — called after successful POST /api/auth/login
   * @param {object} credentials - { email, password }
   * @returns {object} response data { token, role, email }
   */
  const login = async (credentials) => {
    const { data } = await axiosInstance.post('/api/auth/login', credentials)
    // data = { token, role, email }
    setToken(data.token)
    setUser({ email: data.email, role: data.role })
    return data
  }

  /**
   * register — POST /api/auth/register
   */
  const register = async (payload) => {
    const { data } = await axiosInstance.post('/api/auth/register', payload)
    return data
  }

  /**
   * logout — clear all auth state and storage
   */
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.clear()
  }

  // Convenience helpers
  const isAuthenticated = Boolean(token && user)
  const role = user?.role || null

  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — cleaner than importing AuthContext directly
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
