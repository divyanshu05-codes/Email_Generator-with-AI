import API from "./api";

export const getDashboardStats = async () => {
    const response = await API.get("/email/stats");
    return response.data;
};