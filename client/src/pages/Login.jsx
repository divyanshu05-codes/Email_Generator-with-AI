import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthLayout from "../components/AuthLayout";

const Login = () => {

    const { login } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setLoading(true);

            await login(formData);

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue to your AI workspace."
        >

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

                </div>

                <div className="form-group">

                    <div className="password-label">

                        <label htmlFor="password">
                            Password
                        </label>

                        <Link to="/forgot-password">
                            Forgot password?
                        </Link>

                    </div>

                    <div className="password-input-wrapper">

                        <input
                            id="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>

                    </div>

                </div>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >
                    {loading
                        ? "Signing in..."
                        : "Sign In →"}
                </button>

            </form>

            <div className="auth-divider">
                <span>or</span>
            </div>

            <div className="auth-switch">

                Don't have an account?{" "}

                <Link to="/register">
                    Create one
                </Link>

            </div>

        </AuthLayout>
    );
};

export default Login;