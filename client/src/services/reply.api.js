import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/api`
            : "http://localhost:3000/api",
    withCredentials: true
});

export const generateReply = async (replyData) => {

    const response = await API.post(
        "/reply/generate",
        replyData
    );

    return response.data;
};