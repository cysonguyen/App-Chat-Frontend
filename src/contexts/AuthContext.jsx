import { createContext, useContext, useMemo, useState } from "react"
import { readJson, removeJson, writeJson } from "../utils/storage"
import { loginApi } from "../api/auth.api"

const AuthContext = createContext(null)
const STORAGE_KEY = "auth_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(STORAGE_KEY))
  const login = async ({ username, password }) => {
    try {
      const response = await loginApi(username, password)
      writeJson(STORAGE_KEY, response)
      setUser(response)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    removeJson(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
