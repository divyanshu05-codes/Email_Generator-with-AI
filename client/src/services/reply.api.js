import API from "./api";

export const generateReply = async (replyData) => {
    const response = await API.post("/reply/generate", replyData);
    return response.data;
};