"use client"

import { cn } from "../../lib/utils"
import { ScrollArea, Button, Input, Avatar, AvatarImage, AvatarFallback } from "../ui"
import { Search, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getListConversationsApi } from "../../api/conversation.api"
import { useAuth } from "../../contexts/AuthContext"
import { useMemo, useState } from "react"

export function ListConversation({ selectedConversationId, onSelectConversation, onSwitchTab }) {
    const { user } = useAuth()
    const { data: listConversations = [] } = useQuery({
        queryKey: ["conversations"],
        queryFn: () => getListConversationsApi(user.id).then((res) => res || []),
        enabled: !!user?.id,
    })

    const [search, setSearch] = useState("")

    const filteredConversations = useMemo(() => {
        if (!listConversations) return []
        const formattedConversations = listConversations.map((conversation) => {
            const userLength = conversation.conversationUsers.length;
            if (userLength === 2) {
                const newName = conversation.conversationUsers.find((conversationUser) => conversationUser.user?.id !== user?.id)?.user?.fullName
                return {
                    ...conversation,
                    name: newName || conversation.name,
                }
            }
            return conversation
        })
        return formattedConversations.filter((conversation) => conversation.name.toLowerCase().includes(search.toLowerCase()))
    }, [listConversations, search, user])

    return (
        <div className="h-auto w-72 flex-col border-r border-border bg-muted/30 flex min-h-[calc(100vh-64px)]">
            <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button variant="ghost" size="icon-sm" onClick={onSwitchTab}>
                    <Users className="size-5" />
                </Button>
            </div>

            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                    {filteredConversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                                selectedConversationId == conversation.id && "bg-accent"
                            )}
                            onClick={() => onSelectConversation(conversation.id)}
                        >
                            <div className="relative">
                                <Avatar className="size-10">
                                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                                    <AvatarFallback>{conversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {conversation.online && (
                                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{conversation.name}</span>
                                    {conversation.lastMessageTime && (
                                        <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                                    )}
                                </div>
                                {conversation.lastMessage && (
                                    <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                                )}
                            </div>
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                    {conversation.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
