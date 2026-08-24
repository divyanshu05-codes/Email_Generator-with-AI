import API from "./api";

/*
|--------------------------------------------------------------------------
| Generate Email
|--------------------------------------------------------------------------
*/

export const generateEmail = async (data) => {
    const response = await API.post("/email/generate", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Save / Unsave Email
|--------------------------------------------------------------------------
*/

export const toggleSaveEmail = async (id) => {
    const response = await API.patch(`/email/${id}/save`);
    return response.data;
};