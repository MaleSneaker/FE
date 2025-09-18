import axios from "axios";
import { getAccessToken } from "./_helper";

const apiURL = "http://localhost:3000/api";

const instance = axios.create({
    baseURL: apiURL,
})
instance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (config && config.headers && accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
export default instance;
