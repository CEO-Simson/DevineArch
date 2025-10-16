import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, setAuthToken } from '../api/client'

type AuthContextValue = {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({ token: null, login: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken())
  useEffect(() => {
    const onStorage = () => setToken(getToken())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const login = (value: string) => {
    setAuthToken(value)
    setToken(value)
  }
  const logout = () => {
    setAuthToken(undefined)
    setToken(null)
  }
  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
