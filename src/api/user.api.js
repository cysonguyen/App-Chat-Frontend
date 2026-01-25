import axiosInstance from "./index"

export const getUserByUsernameApi = async (username) => {
    const response = await axiosInstance.get(`/users/${username}`)
    return response.data
}