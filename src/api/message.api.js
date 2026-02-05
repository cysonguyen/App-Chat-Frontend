import axiosInstance from "."

export const getMessagesApi = async (payload) => {
    const response = await axiosInstance.post(`/messages/list`, payload)
    return response.data
}