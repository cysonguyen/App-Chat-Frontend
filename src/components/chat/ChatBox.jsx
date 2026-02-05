import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import {
    Send,
    Paperclip,
    Smile,
    MoreVertical,
    Phone,
    Video,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { getConversationApi } from "../../api/conversation.api"
import { useQuery } from "@tanstack/react-query"
import { getMessagesApi } from "../../api/message.api"
import { MESSAGE_EVENT } from "../../common/app.const"

export function ChatBox({
    conversationId,
    onToggleDetail = () => { },
}) {
    const { user } = useAuth()
    const currentUserId = user?.id

    const { data: conversation, isLoading: isLoadingConversation } = useQuery({
        queryKey: ["conversations", conversationId],
        queryFn: () => getConversationApi(conversationId),
        enabled: !!conversationId,
    })

    const formattedConversation = useMemo(() => {
        const userLength = conversation?.conversationUsers?.length
        if (userLength === 2) {
            const newName = conversation?.conversationUsers?.find((conversationUser) => conversationUser.user?.id !== currentUserId)?.user?.fullName
            return {
                ...conversation,
                name: newName ?? conversation.name,
            }
        }
        return conversation
    }, [conversation, currentUserId])

    const { data: messages, isLoading: isLoadingMessages } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: async () => {
            const payload = {
                conversationId,
                pageInfo: {
                    last: 100,
                    reverse: false,
                },
            }
            const response = await getMessagesApi(payload)
            return response?.data || []
        },
        enabled: !!conversationId,
    })

    const [newMessage, setNewMessage] = useState("")
    const bottomRef = useRef(null)

    const handleSend = () => {
        if (!newMessage.trim()) return
        window.dispatchEvent(new CustomEvent(MESSAGE_EVENT.MESSAGE_SEND, { detail: { conversationId, content: newMessage } }, { bubbles: true, composed: true }))
        setNewMessage("")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const isOnline = useMemo(() => {
        const conversationUsers = formattedConversation?.conversationUsers || []
        return conversationUsers.filter((conversationUser) => conversationUser.user?.id !== currentUserId)
            .some((conversationUser) => conversationUser.user?.isOnline)
    }, [formattedConversation?.conversationUsers, currentUserId])

    useEffect(() => {
        if (!isLoadingConversation && !isLoadingMessages) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [isLoadingConversation, isLoadingMessages])

    useEffect(() => {
        if (!conversationId) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [conversationId])

    useEffect(() => {
        if (messages?.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    if (!formattedConversation) {
        return (
            <div className="flex flex-1 items-center justify-center bg-muted/10 min-h-[calc(100vh-64px)]">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                        <Send className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose a user from the list to start chatting
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="size-10">    
                            <AvatarImage src={formattedConversation.avatar} />
                            <AvatarFallback>
                                {formattedConversation.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">{formattedConversation.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm">
                        <Phone className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                        <Video className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={onToggleDetail}>
                        <MoreVertical className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 min-h-[calc(100vh-186px)] max-h-[calc(100vh-186px)]
            ">
                <div className="flex flex-col gap-4">
                    {messages?.map((message) => {
                        const isOwn = message.sender.id === currentUserId

                        return (
                            <div
                                key={message.id}
                                className={cn("flex gap-2", isOwn && "flex-row-reverse")}
                            >
                                {!isOwn && (
                                    <Avatar className="size-8">
                                        <AvatarImage src={message.sender.avatar} />
                                        <AvatarFallback>
                                            {message.sender.fullName.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={cn(
                                        "max-w-[70%] rounded-2xl px-4 py-2",
                                        isOwn
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p
                                        className={cn(
                                            "mt-1 text-[10px]",
                                            isOwn
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                    />
                    <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
