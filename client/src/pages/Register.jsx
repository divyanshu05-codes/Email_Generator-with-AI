import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import AuthLayout from "../components/AuthLayout";

const Register = () => {

    const { register } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

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

            await register(formData);

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout
            title="Create your account"
            subtitle="Start writing better emails with AI."
        >

            <form onSubmit={handleSubmit}>

                {/* Name */}

                <div className="form-group">

                    <label htmlFor="name">
                        Full Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        autoComplete="name"
                        required
                    />

                </div>

                {/* Email */}

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

                {/* Password */}

                <div className="form-group">

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength="6"
                        required
                    />

                </div>

                {/* Error */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}

                {/* Submit */}

                <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                >

                    {loading
                        ? "Creating account..."
                        : "Create Account →"
                    }

                </button>

            </form>

            <div className="auth-switch">

                Already have an account?{" "}

                <Link to="/login">
                    Sign in
                </Link>

            </div>

        </AuthLayout>

    );
};

export default Register;