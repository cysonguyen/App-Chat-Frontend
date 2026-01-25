"use client"

import { useState } from "react"
import { ListConversation } from "../components/chat/ListConversation"
import { ChatBox } from "../components/chat/ChatBox"
import { ConversationDetail } from "../components/chat/ConversationDetail"

const mockConversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: "That sounds great! Let me know when you're free.",
    lastMessageTime: "2m",
    online: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "I've sent you the files.",
    lastMessageTime: "15m",
    online: true,
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: "Can we reschedule the meeting?",
    lastMessageTime: "1h",
    online: false,
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    lastMessage: "Thanks for your help!",
    lastMessageTime: "3h",
    online: false,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    lastMessage: "See you tomorrow!",
    lastMessageTime: "1d",
    online: true,
  },
]

const mockMessages = {
  "1": [
    { id: "1", content: "Hey! How are you doing?", senderId: "1", timestamp: "10:30 AM" },
    { id: "2", content: "I'm good, thanks! Just finished the project.", senderId: "current", timestamp: "10:32 AM" },
    { id: "3", content: "That's awesome! Would you like to grab coffee and celebrate?", senderId: "1", timestamp: "10:33 AM" },
    { id: "4", content: "Sure, I'd love that! When are you free?", senderId: "current", timestamp: "10:35 AM" },
    { id: "5", content: "That sounds great! Let me know when you're free.", senderId: "1", timestamp: "10:36 AM" },
  ],
  "2": [
    { id: "1", content: "Hi Michael, did you receive my email?", senderId: "current", timestamp: "9:00 AM" },
    { id: "2", content: "Yes, I saw it. I'm working on the response.", senderId: "2", timestamp: "9:15 AM" },
    { id: "3", content: "I've sent you the files.", senderId: "2", timestamp: "9:45 AM" },
  ],
  "3": [
    { id: "1", content: "Hey Emily, are we still on for the meeting?", senderId: "current", timestamp: "Yesterday" },
    { id: "2", content: "Can we reschedule the meeting?", senderId: "3", timestamp: "Yesterday" },
  ],
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [showDetail, setShowDetail] = useState(true)
  const currentUserId = "current"

  const handleSendMessage = (content) => {
    if (!selectedConversation) return

    const newMessage = {
      id: Date.now().toString(),
      content,
      senderId: currentUserId,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage],
    }))
  }

  const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : []

  return (
    <div className="flex h-screen bg-background">
      <ListConversation
        conversations={mockConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <ChatBox
        selectedConversation={selectedConversation}
        messages={currentMessages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onToggleDetail={() => setShowDetail(!showDetail)}
      />
      {showDetail && (
        <ConversationDetail
          conversation={selectedConversation}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  )
}
