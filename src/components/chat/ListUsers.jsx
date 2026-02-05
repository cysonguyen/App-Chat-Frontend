"use client"

import { cn } from "../../lib/utils"
import { ScrollArea, Button, Input, Avatar, AvatarImage, AvatarFallback } from "../ui"
import { Search, MessageSquarePlus } from "lucide-react"
import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUsersApi } from "../../api/user.api"
import { saveConversationApi } from "../../api/conversation.api"
import { useAuth } from "../../contexts/AuthContext"

export function ListUsers({ onChangeConversationId, onSwitchTab }) {
    const { user } = useAuth()
    const currentUserId = user?.id
    const [search, setSearch] = useState("")
    const queryClient = useQueryClient()
    const { data: listUsers = [] } = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsersApi().then((res) => res.data || []),
    })

    const filteredUsers = useMemo(() => {
        if (!listUsers) return []
        const list = listUsers.filter((user) => user.id !== currentUserId)
        return list.filter((user) =>
            user.fullName?.toLowerCase()?.includes(search.toLowerCase())
        )
    }, [listUsers, search, currentUserId])

    const onSaveConversation = (targetUser) => {
        const payload = {
            name: `${targetUser.fullName}, ${user.fullName}`,
            userIds: [targetUser.id, currentUserId]
        }
        return saveConversationApi(payload)
    }

    const saveConversationMutation = useMutation({
        mutationFn: (targetUser) => onSaveConversation(targetUser),
        onSuccess: (response) => {
            if (!response.errors) {
                queryClient.invalidateQueries({ queryKey: ["conversations"] })
                onChangeConversationId(response.id)
                onSwitchTab()
            }
        },
    })

    return (
        <div className="h-auto w-72 flex-col border-r border-border bg-muted/30 flex">
            <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold">Users</h2>
                <Button variant="ghost" size="icon-sm" onClick={onSwitchTab}>
                    <MessageSquarePlus className="size-5" />
                </Button>
            </div>

            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                    {filteredUsers?.map((user) => (
                        <button
                            key={user.id}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                                saveConversationMutation.isPending ? "bg-accent opacity-50" : ""
                            )}
                            onClick={() => saveConversationMutation.mutate(user)}
                        >
                            <div className="relative">
                                <Avatar className="size-10">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {user.online && (
                                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{user.fullName}</span>
                                    {user.lastMessageTime && (
                                        <span className="text-xs text-muted-foreground">{user.lastMessageTime}</span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
