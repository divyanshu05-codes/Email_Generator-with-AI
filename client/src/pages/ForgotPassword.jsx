import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import {
    forgotPassword
} from "../services/auth.api";


const ForgotPassword = () => {

    const [email, setEmail] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const data =
                await forgotPassword(
                    email
                );


            setSuccess(
                data.message ||
                "If an account exists with this email, a password reset link has been sent."
            );


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to process your request."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <AuthLayout

            title="Forgot your password?"

            subtitle="Enter your email and we'll send you a secure reset link."

        >

            <form
                onSubmit={handleSubmit}
            >

                <div className="form-group">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

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
                        ? "Sending..."
                        : "Send Reset Link →"}

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


export default ForgotPassword;