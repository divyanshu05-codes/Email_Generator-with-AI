import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000/api",

    withCredentials: true
});


/*
|--------------------------------------------------------------------------
| Get Email History
|--------------------------------------------------------------------------
*/

export const getEmailHistory = async () => {

    const response = await API.get(
        "/history"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Email
|--------------------------------------------------------------------------
*/

export const getSingleEmail = async (id) => {

    const response = await API.get(
        `/history/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Email
|--------------------------------------------------------------------------
*/

export const deleteEmail = async (id) => {

    const response = await API.delete(
        `/history/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Save / Unsave Email
|--------------------------------------------------------------------------
*/

export const toggleSaveEmail = async (id) => {

    const response = await API.patch(
        `/email/${id}/save`
    );

    return response.data;
};