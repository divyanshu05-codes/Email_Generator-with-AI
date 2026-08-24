import API from "./api";

export const getReplyHistory = async () => {
    const response = await API.get("/reply-history");
    return response.data;
};

export const getSingleReply = async (id) => {
    const response = await API.get(`/reply-history/${id}`);
    return response.data;
};

export const deleteReply = async (id) => {
    const response = await API.delete(`/reply-history/${id}`);
    return response.data;
};