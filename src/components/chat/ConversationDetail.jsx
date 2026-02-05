import { ScrollArea, Button, Separator, Avatar, AvatarImage, AvatarFallback, Input, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui"
import { Bell, BellOff, ImageIcon, File, Link2, Star, Trash2, X, Pencil, Check, Users, Plus } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteConversationApi, getConversationApi, saveConversationApi } from "../../api/conversation.api"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect, useMemo, useState } from "react"
import { getUsersApi } from "../../api/user.api"

export function ConversationDetail({ conversationId, onClose }) {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    const currentUserId = user?.id
    const [isOpen, setIsOpen] = useState(false)

    const { data: conversation } = useQuery({
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

    console.log('formattedConversation', formattedConversation)

    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(formattedConversation?.name)

    const handleOpenChange = (open) => {
        setIsOpen(open)
    }

    const handleSaveName = async () => {
        try {
            const payload = {
                id: conversationId,
                name: editedName,
                userIds: formattedConversation.conversationUsers.map((conversationUser) => conversationUser.user.id),
            }
            const response = await saveConversationApi(payload)
            if (!response.errors) {
                queryClient.invalidateQueries({ queryKey: ["conversations", conversationId] })
            }
        } catch (error) {
            console.error(error);
        }

        setIsEditing(false)
    }

    const isOnline = useMemo(() => {    
        const conversationUsers = formattedConversation?.conversationUsers || []
        return conversationUsers.filter((conversationUser) => conversationUser.user?.id !== currentUserId)
            .some((conversationUser) => conversationUser.user?.isOnline)
    }, [formattedConversation, currentUserId])


    const handleDeleteConversation = async () => {
        try {
            const response = await deleteConversationApi(formattedConversation.id)
            if (!response.errors) {
                queryClient.invalidateQueries({ queryKey: ["conversations"] })
                onClose()
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="flex h-full w-80 flex-col border-l border-border bg-background min-h-[calc(100vh-56px)]">
            <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-semibold">Details</h2>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1 justify-between">
                <div className="flex flex-col items-center text-center">
                    <div className="relative">
                        <Avatar className="size-20">
                            <AvatarImage src={formattedConversation?.avatar || "/placeholder.svg"} alt={formattedConversation?.name} />
                            <AvatarFallback className="text-xl">{formattedConversation?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {isOnline && (
                            <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-background bg-green-500" />
                        )}
                    </div>
                    <div className="flex items-center gap-2 justify-center items-center mt-3 w-full">
                        {
                            isEditing ? (
                                <Input type="text" className="w-full" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                            ) : (
                                <h3 className="text-lg font-semibold">{formattedConversation?.name}</h3>
                            )
                        }
                        {
                            isEditing ? (
                                <Check className="size-4 cursor-pointer" onClick={handleSaveName} />
                            ) : (
                                <Pencil className="size-4 cursor-pointer" onClick={() => setIsEditing(true)} />
                            )
                        }
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <AddMemberModal conversation={formattedConversation} isOpen={isOpen} onOpenChange={handleOpenChange} />
                    <Button variant="ghost" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer" onClick={handleDeleteConversation}>
                        <Trash2 className="mr-2 size-4" />
                        Delete conversation
                    </Button>
                </div>
            </div>
        </div>
    )
}


export function AddMemberModal({ conversation, isOpen, onOpenChange }) {
    const queryClient = useQueryClient()

    const { user } = useAuth()
    const currentUserId = user?.id
    const { data: listUsers = [] } = useQuery({
        queryKey: ["users"],
        queryFn: () => getUsersApi().then((res) => res.data || []),
        enabled: isOpen,
    })

    const [selectedUsers, setSelectedUsers] = useState(conversation?.conversationUsers?.map((conversationUser) => conversationUser.user.id) || [])
    const filteredUsers = useMemo(() => {
        return listUsers.filter((user) => user.id !== currentUserId)
    }, [listUsers, currentUserId])

    const handleSaveConversation = async () => {
        try {
            const payload = {
                id: conversation.id,
                userIds: selectedUsers,
            }
            const response = await saveConversationApi(payload)
            if (!response.errors) {
                queryClient.invalidateQueries({ queryKey: ["conversations", conversation.id] })
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSelectUser = (userId, checked) => {
        const newSelectedUsers = new Set([...selectedUsers, userId])
        if (checked) {
            newSelectedUsers.add(userId)
        } else {
            newSelectedUsers.delete(userId)
        }
        if (newSelectedUsers.size < 2) {
            alert("Please select at least 2 users")
            return
        }
        setSelectedUsers(Array.from(newSelectedUsers))
    }

    useEffect(() => {
        if (!conversation) return
        const userIds = conversation?.conversationUsers?.map((conversationUser) => conversationUser.user.id) || []
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedUsers(userIds)
    }, [conversation])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
            <DialogTrigger>
                <Button variant="secondary" className="justify-start cursor-pointer w-full">
                    <Users className="mr-2 size-4" />
                    Add member
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-[90vw] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add member</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-2">
                            <Input type="checkbox" className="size-4" checked={selectedUsers.includes(user.id)} onChange={(e) => handleSelectUser(user.id, e.target.checked)} />
                            <div className="flex items-center gap-2">
                                <Avatar className="size-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{user.fullName}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter className=" p-2">
                    <div className="flex justify-end w-full pr-2 gap-2">
                        <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button variant="default" className="cursor-pointer" onClick={handleSaveConversation}>
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}   