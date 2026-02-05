import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { readJson, removeJson, writeJson } from "../utils/storage"
import { loginApi } from "../api/auth.api"

const AuthContext = createContext(null)
const STORAGE_KEY = "auth_user"

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => readJson(STORAGE_KEY))
  const login = async ({ username, password }) => {
    try {
      const response = await loginApi(username, password)
      writeJson(STORAGE_KEY, response)
      setAuthUser(response)
    } catch (error) {
      console.error(error)
      alert("Invalid username or password")
    }
  }

  const logout = () => {
    setAuthUser(null)
    removeJson(STORAGE_KEY)
  }

  const refreshUser = useCallback((user) => {
    setAuthUser((prev) => ({ ...prev, user: user }))
    writeJson(STORAGE_KEY, { ...authUser, user: user })
  }, [authUser])

  const value = useMemo(
    () => ({
      token: authUser?.accessToken,
      socketToken: authUser?.socketToken,
      user: authUser?.user,
      isAuthenticated: Boolean(authUser),
      refreshUser,
      login,
      logout,
    }),
    [authUser, refreshUser]
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
