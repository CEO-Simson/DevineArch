import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, setAuthToken } from '../api/client'

type AuthContextValue = {
  token: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({ token: null, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken())
  useEffect(() => {
    const onStorage = () => setToken(getToken())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  return (
    <AuthContext.Provider value={{ token, logout: () => { setAuthToken(undefined); setToken(null) } }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
