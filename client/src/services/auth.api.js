import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000/api",

    withCredentials: true
});


/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const registerUser = async (userData) => {

    const response = await API.post(
        "/auth/register",
        userData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginUser = async (userData) => {

    const response = await API.post(
        "/auth/login",
        userData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logoutUser = async () => {

    const response = await API.post(
        "/auth/logout"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser = async () => {

    const response = await API.get(
        "/auth/me"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPassword = async (email) => {

    const response = await API.post(
        "/auth/forgot-password",
        {
            email
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPassword = async (
    token,
    password
) => {

    const response = await API.post(
        `/auth/reset-password/${token}`,
        {
            password
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateProfile = async (userData) => {

    const response = await API.put(
        "/auth/profile",
        userData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = async (
    passwordData
) => {

    const response = await API.put(
        "/auth/change-password",
        passwordData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Account
|--------------------------------------------------------------------------
*/

export const deleteAccount = async () => {

    const response = await API.delete(
        "/auth/account"
    );

    return response.data;
};