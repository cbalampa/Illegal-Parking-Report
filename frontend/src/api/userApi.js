import api from './axiosConfig'

export const registerUser = (data) => api.post('/api/users/register', data)
export const loginUser = (data) => api.post('/api/users/login', data)
