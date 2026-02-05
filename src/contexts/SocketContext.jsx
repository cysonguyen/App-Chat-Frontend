import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useAuth } from "./AuthContext"
import { createSocket, closeSocket } from "../lib/socket"

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user, socketToken } = useAuth()

  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // logout hoặc chưa login
    if (!user || !socketToken) {
      if (socket) {
        closeSocket(socket)
      }
      setSocket(null)
      setConnected(false)
      return
    }

    const url = import.meta.env.VITE_SOCKET_URL
    if (!url) {
      console.error("❌ VITE_SOCKET_URL not found")
      return
    }

    const s = createSocket(url, socketToken)

    s.on("connect", () => {
      setConnected(true)
    })

    s.on("disconnect", () => {
      setConnected(false)
    })

    s.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message)
    })

    setSocket(s)

    return () => {
      closeSocket(s)
      setSocket(null)
      setConnected(false)
    }
  }, [user, socketToken])

  const value = useMemo(
    () => ({
      socket,
      connected,
    }),
    [socket, connected]
  )

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider")
  }
  return ctx
}
