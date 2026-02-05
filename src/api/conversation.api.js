import axiosInstance from "."

export const getListConversationsApi = async (userId) => {
    const response = await axiosInstance.get(`/conversations/list/${userId}`)
    return response.data
}

export const getConversationApi = async (conversationId) => {
    const response = await axiosInstance.get(`/conversations/${conversationId}`)
    return response.data
}

export const saveConversationApi = async (conversation) => {
    const response = await axiosInstance.put("/conversations", conversation)
    return response.data
}

export const deleteConversationApi = async (conversationId) => {
    const response = await axiosInstance.delete(`/conversations/${conversationId}`)
    return response.data
}