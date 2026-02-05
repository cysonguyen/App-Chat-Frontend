import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react"
import { useSocket } from "./SocketContext"
import { useAuth } from "./AuthContext"
import { CONVERSATION_EVENT, MESSAGE_EVENT, USER_EVENT } from "../common/app.const"
import { useQueryClient } from "@tanstack/react-query"

const EventContext = createContext(null)

export function EventProvider({ children }) {
  const { socket, connected } = useSocket()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const handleUserNotification = useCallback((payload) => {
    switch (payload.type) {
      case 'status':
        queryClient.invalidateQueries({ queryKey: ['conversations', payload.conversationId] })
        break
    }
  }, [queryClient])

  useEffect(() => {
    if (!socket || !connected) return
    if (!user?.id) {
      socket.emit(USER_EVENT.USER_OFFLINE, { userId: user.id })
    } else {
      socket.on(USER_EVENT.USER_NOTIFICATION, handleUserNotification)
      socket.emit(USER_EVENT.USER_ONLINE, { userId: user.id })
    }
    
    return () => {
      socket.off(USER_EVENT.USER_NOTIFICATION, handleUserNotification)
      if (user?.id) {
        socket.emit(USER_EVENT.USER_OFFLINE, { userId: user.id })
      }
    }
  }, [
    socket,
    connected,
    user,
    handleUserNotification,
  ])

  const joinConversation = useCallback(
    (conversationId) => {
      if (!socket || !connected || !conversationId) return
      socket.emit(CONVERSATION_EVENT.CONVERSATION_JOIN, {
        conversationId,
        userId: user?.id,
      })
    },
    [socket, connected, user]
  )

  const leaveConversation = useCallback(
    (conversationId) => {
      if (!socket || !connected || !conversationId) return
      socket.emit(CONVERSATION_EVENT.CONVERSATION_LEAVE, {
        conversationId,
        userId: user?.id,
      })
    },
    [socket, connected, user]
  )

  const sendMessage = useCallback(
    (payload) => {
      if (!socket || !connected || !payload) return
      socket.emit(MESSAGE_EVENT.MESSAGE_NEW, payload)
    },
    [socket, connected]
  )

  const readMessage = useCallback(
    (payload) => {
      if (!socket || !connected || !payload) return
      socket.emit(MESSAGE_EVENT.MESSAGE_READ_UPDATED, payload)
    },
    [socket, connected]
  )

  const value = useMemo(
    () => ({
      connected,
      handleUserNotification,
      joinConversation,
      leaveConversation,
      sendMessage,
      readMessage,
    }),
    [
      connected,
      handleUserNotification,
      joinConversation,
      leaveConversation,
      sendMessage,
      readMessage,
    ]
  )

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEvent() {
  const ctx = useContext(EventContext)
  if (!ctx) {
    throw new Error("useEvent must be used within EventProvider")
  }
  return ctx
}
