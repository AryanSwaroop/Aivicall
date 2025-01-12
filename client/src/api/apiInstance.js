import axios from "axios";

import API_ENDPOINTS from "./endpoints";

const axiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BACK_URL,
    headers: {
        "Access-Control-Allow-Origin": API_ENDPOINTS.FRONT_URL,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
    },
});

export default axiosInstance;