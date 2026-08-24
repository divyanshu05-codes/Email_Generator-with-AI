import axios from "axios";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";


/*
|--------------------------------------------------------------------------
| Generate Email
|--------------------------------------------------------------------------
*/

export const generateEmail = async (data) => {

    const response = await axios.post(
        `${API_URL}/api/email/generate`,
        data,
        {
            withCredentials: true
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Save / Unsave Email
|--------------------------------------------------------------------------
*/

export const toggleSaveEmail = async (id) => {

    const response = await axios.patch(
        `${API_URL}/api/email/${id}/save`,
        {},
        {
            withCredentials: true
        }
    );

    return response.data;
};