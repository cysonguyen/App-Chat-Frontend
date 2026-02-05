import { useCallback, useEffect, useRef } from "react"
import { useSocket } from "../contexts/SocketContext"
import { useAuth } from "../contexts/AuthContext"
import { CONVERSATION_EVENT, MESSAGE_EVENT } from "../common/app.const"
import { useQueryClient } from "@tanstack/react-query"


export function useChat(conversationId) {
    const { socket, connected } = useSocket()
    const { user } = useAuth()
    const joinedConversationIdRef = useRef(null)
    const queryClient = useQueryClient()

    const joinConversation = useCallback(
        (targetConversationId) => {
            if (!socket || !connected) return
            if (!targetConversationId) return

            const currentConversationId = joinedConversationIdRef.current
            if (currentConversationId && currentConversationId !== targetConversationId) {
                socket.emit(CONVERSATION_EVENT.CONVERSATION_LEAVE, {
                    conversationId: currentConversationId,
                    userId: user?.id,
                })
            }

            if (currentConversationId !== targetConversationId) {
                socket.emit(CONVERSATION_EVENT.CONVERSATION_JOIN, {
                    conversationId: targetConversationId,
                    userId: user?.id,
                })
                joinedConversationIdRef.current = targetConversationId
            }
        },
        [socket, connected, user]
    )

    const emitNewMess = useCallback(
        (payload) => {
            if (!socket || !connected) return
            if (!payload) return
            socket.emit(MESSAGE_EVENT.MESSAGE_SEND, payload)
        },
        [socket, connected]
    )

    const readMessage = useCallback(
        (payload) => {
            if (!socket || !connected) return
            if (!payload) return
            socket.emit(MESSAGE_EVENT.MESSAGE_READ, payload)
        },
        [socket, connected]
    )


    useEffect(() => {
        if (!conversationId) return
        if (joinedConversationIdRef.current === conversationId) return
        joinConversation(conversationId)
    }, [conversationId, joinConversation])

    useEffect(() => {
        if (!socket || !connected || !conversationId) return

        const handleMessageNew = (payload) => {
            if (payload?.conversationId !== conversationId) return
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
        }

        const handleMessageReadUpdated = (payload) => {
            if (payload?.conversationId !== conversationId) return
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
        }

        socket.on(MESSAGE_EVENT.MESSAGE_NEW, handleMessageNew)
        socket.on(MESSAGE_EVENT.MESSAGE_READ_UPDATED, handleMessageReadUpdated)

        return () => {
            socket.off(MESSAGE_EVENT.MESSAGE_NEW, handleMessageNew)
            socket.off(MESSAGE_EVENT.MESSAGE_READ_UPDATED, handleMessageReadUpdated)
        }
    }, [socket, connected, conversationId, queryClient])

    useEffect(() => {
        return () => {
            if (!socket || !connected) return
            const currentConversationId = joinedConversationIdRef.current
            if (currentConversationId) {
                socket.emit(CONVERSATION_EVENT.CONVERSATION_LEAVE, {
                    conversationId: currentConversationId,
                    userId: user?.id,
                })
                joinedConversationIdRef.current = null
            }
        }
    }, [socket, connected, user])

    return {
        connected,
        joinConversation,
        emitNewMess,
        readMessage,
    }
}
