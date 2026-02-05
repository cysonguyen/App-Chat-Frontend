"use client"

import { useEffect, useState } from "react"
import { ListConversation } from "../components/chat/ListConversation"
import { ChatBox } from "../components/chat/ChatBox"
import { ConversationDetail } from "../components/chat/ConversationDetail"
import { ListUsers } from "../components/chat/ListUsers"
import { useQueryParams } from "../hook/useQueryParams"
import { useChat } from "../hook/useChat"
import { MESSAGE_EVENT } from "../common/app.const"

export default function ChatPage() {
  const { getParam: getConversationId, setParam: setConversationId, deleteParam: deleteConversationId } = useQueryParams()
  const conversationId = getConversationId("conversationId")
  const [showDetail, setShowDetail] = useState(true)
  const [tab, setTab] = useState("conversations")
  const { joinConversation, emitNewMess } = useChat(conversationId)

  useEffect(() => {
    if (conversationId) {
      setConversationId("conversationId", conversationId)
      joinConversation(conversationId)
    } else {
      deleteConversationId("conversationId")
    }
  }, [conversationId, setConversationId, deleteConversationId, joinConversation])

  useEffect(() => {
    if (!conversationId) return

    const handleSendEvent = (event) => {
      const { conversationId, content } = event.detail
      if (conversationId !== conversationId) return
      emitNewMess({ conversationId, content })
    }
    window.addEventListener(MESSAGE_EVENT.MESSAGE_SEND, handleSendEvent)
    return () => {
      window.removeEventListener(MESSAGE_EVENT.MESSAGE_SEND, handleSendEvent)
    }
  }, [conversationId, emitNewMess])

  console.log('showDetail', showDetail, conversationId)

  return (
    <div className="flex flex-1 bg-background min-h-0 max-h-full">
      {tab === "users" ? (
        <ListUsers
          onChangeConversationId={(newConversationId) => setConversationId("conversationId", newConversationId)}
          onSwitchTab={() => setTab("conversations")}
        />
      ) : (
        <ListConversation
          selectedConversationId={conversationId}
          onSelectConversation={(newConversationId) => setConversationId("conversationId", newConversationId)}
          onSwitchTab={() => setTab("users")}
        />
      )}
      <ChatBox
        conversationId={conversationId}
        onToggleDetail={() => setShowDetail(!showDetail)}
      />

      {showDetail && conversationId && (
        <ConversationDetail
          conversationId={conversationId}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  )
}
