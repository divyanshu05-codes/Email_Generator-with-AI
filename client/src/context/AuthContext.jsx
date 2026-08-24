import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser
} from "../services/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const register = async (userData) => {

        const data =
            await registerUser(userData);

        setUser(data.user);

        return data;
    };


    const login = async (userData) => {

        const data =
            await loginUser(userData);

        if (!data?.user) {
            throw new Error(
                "Login response did not contain user data."
            );
        }

        setUser(data.user);

        return data;
    };


    const logout = async () => {

        try {

            await logoutUser();

        } finally {

            setUser(null);

        }

    };


    const checkAuth = async () => {

        try {

            const data =
                await getCurrentUser();

            setUser(data.user || null);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        checkAuth();

    }, []);


    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>

    );
};


export const useAuth = () => {

    return useContext(AuthContext);

};