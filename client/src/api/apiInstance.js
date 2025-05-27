import axios from "axios";

import API_ENDPOINTS from "./endpoints";

const axiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BACK_URL,
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": API_ENDPOINTS.FRONT_URL,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
    },
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;