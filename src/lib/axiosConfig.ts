import axios from "axios";
import { tokenStorage } from "./tokenStorage";


export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    const token = tokenStorage.get();

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenStorage.remove()
        }
        return Promise.reject(error)
    }
    );