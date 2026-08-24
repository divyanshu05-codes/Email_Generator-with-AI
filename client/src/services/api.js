import axios from "axios";

/**
 * Normalizes the backend base URL to ensure it always targets the '/api' prefix,
 * regardless of how VITE_API_URL is configured (with/without trailing slash, with/without /api).
 */
const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    // Remove any trailing slashes
    url = url.trim().replace(/\/+$/, "");

    // Ensure the URL ends with /api
    if (!url.endsWith("/api")) {
        url = `${url}/api`;
    }

    return url;
};

const API = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default API;
