import axiosInstance from "./index"

export const getUsersApi = async () => {
    const response = await axiosInstance.get("/users")
    return response.data
}

export const getUserApi = async (id) => {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
}

export const updateUserApi = async (body) => {
    const response = await axiosInstance.put(`/users`, body)
    return response.data
}

export const changePasswordApi = async (body) => {
    const response = await axiosInstance.put(`/users/change-password`, body)
    return response.data
}