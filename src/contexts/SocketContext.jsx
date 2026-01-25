import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "./AuthContext"
import { closeSocket, createSocket } from "../services/socket"

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        closeSocket(socketRef.current)
        socketRef.current = null
      }
      return
    }

    const url = import.meta.env.VITE_SOCKET_URL
    if (!url) {
      return
    }

    const nextSocket = createSocket(url)
    socketRef.current = nextSocket
    if (nextSocket) {
      nextSocket.addEventListener("open", () => {
        setSocket(nextSocket)
      })
      nextSocket.addEventListener("close", () => {
        setSocket(null)
      })
    }

    return () => {
      closeSocket(nextSocket)
      if (socketRef.current === nextSocket) {
        socketRef.current = null
      }
    }
  }, [user])

  const value = useMemo(() => {
    const hasWebSocket = typeof WebSocket !== "undefined"
    return {
      socket,
      connected: Boolean(
        socket && hasWebSocket && socket.readyState === WebSocket.OPEN
      ),
    }
  }, [socket])

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider")
  }
  return context
}
