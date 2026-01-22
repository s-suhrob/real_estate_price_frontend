import axios from "axios";

const api = axios.create({
    baseURL: "https://realestatepricebackend-production.up.railway.app/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach Authorization: Bearer <token> header if a token exists in LocalStorage
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
