import axiosInstance from "./index"

export const loginApi = async (username, password) => {
    const response = await axiosInstance.post("/auth/login", { username, password })
    return response.data
}

export const registerApi = async (body) => {
    const response = await axiosInstance.post("/auth/register", body)
    return response.data
}