import { useState } from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import {
    resetPassword
} from "../services/auth.api";


const ResetPassword = () => {

    const {
        token
    } = useParams();

    const navigate =
        useNavigate();


    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        try {

            setLoading(true);


            const data =
                await resetPassword(
                    token,
                    password
                );


            setSuccess(
                data.message ||
                "Password reset successfully."
            );


            setPassword("");

            setConfirmPassword("");


            setTimeout(() => {

                navigate("/login");

            }, 1800);


        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to reset password."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <AuthLayout

            title="Create a new password"

            subtitle="Choose a strong password for your MailMind AI account."

        >

            <form
                onSubmit={handleSubmit}
            >


                {/* Password */}

                <div className="form-group">

                    <label htmlFor="password">
                        New Password
                    </label>


                    <div className="password-input-wrapper">

                        <input
                            id="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            minLength="6"
                            required
                        />


                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >

                            {showPassword
                                ? "🙈"
                                : "👁️"}

                        </button>

                    </div>

                </div>


                {/* Confirm Password */}

                <div className="form-group">

                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>


                    <div className="password-input-wrapper">

                        <input
                            id="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            minLength="6"
                            required
                        />


                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                        >

                            {showConfirmPassword
                                ? "🙈"
                                : "👁️"}

                        </button>

                    </div>

                </div>


                {error && (

                    <div className="error-message">
                        ⚠️ {error}
                    </div>

                )}


                {success && (

                    <div className="success-message">
                        ✅ {success}
                    </div>

                )}


                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >

                    {loading
                        ? "Updating..."
                        : "Reset Password →"}

                </button>


            </form>


            <div className="auth-switch">

                Remember your password?{" "}

                <Link to="/login">
                    Back to Login
                </Link>

            </div>

        </AuthLayout>

    );

};


export default ResetPassword;