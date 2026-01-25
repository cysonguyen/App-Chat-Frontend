import { useState } from "react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react"

export function ChatBox({ selectedConversation, messages, currentUserId, onSendMessage, onToggleDetail = () => {} }) {  
    const [newMessage, setNewMessage] = useState("")

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage)
            setNewMessage("")
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!selectedConversation) {
        return (
            <div className="flex flex-1 items-center justify-center bg-muted/10">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                        <Send className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">Choose a user from the list to start chatting</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="size-10">
                            <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} alt={selectedConversation.name} />
                            <AvatarFallback>{selectedConversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {selectedConversation.online && (
                            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">{selectedConversation.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {selectedConversation.online ? "Online" : "Offline"}
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
            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {messages.map((message) => {
                        const isOwn = message.senderId === currentUserId
                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-2",
                                    isOwn ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {!isOwn && (
                                    <Avatar className="size-8">
                                        <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} alt={selectedConversation.name} />
                                        <AvatarFallback>{selectedConversation.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                                    <p className={cn(
                                        "mt-1 text-[10px]",
                                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon-sm">
                        <Paperclip className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                        <Smile className="size-4" />
                    </Button>
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
