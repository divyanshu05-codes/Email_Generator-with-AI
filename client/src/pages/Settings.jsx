import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    updateProfile,
    changePassword
} from "../services/auth.api";

const Settings = () => {
    const { user, setUser } = useAuth();

    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mailmind-theme") === "dark";
    });

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const [profileError, setProfileError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || ""
            });
        }
    }, [user]);

    const handleThemeChange = (dark) => {
        setIsDarkMode(dark);
        document.documentElement.classList.toggle("dark-mode", dark);
        localStorage.setItem("mailmind-theme", dark ? "dark" : "light");
    };

    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage("");
        setProfileError("");

        try {
            setProfileLoading(true);
            const data = await updateProfile(profile);

            if (setUser && data.user) {
                setUser(data.user);
            }

            setProfileMessage("Profile updated successfully.");
        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        if (password.newPassword !== password.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        try {
            setPasswordLoading(true);
            const data = await changePassword({
                currentPassword: password.currentPassword,
                newPassword: password.newPassword
            });

            setPasswordMessage(
                data.message || "Password changed successfully."
            );

            setPassword({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your MailMind AI account and preferences.</p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Profile */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">👤</div>
                        <div>
                            <h2>Profile Information</h2>
                            <p>Update your personal information.</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={profile.name}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        {profileError && (
                            <div className="error-message">
                                ⚠️ {profileError}
                            </div>
                        )}

                        {profileMessage && (
                            <div className="success-message">
                                ✓ {profileMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={profileLoading}
                        >
                            {profileLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </section>

                {/* Password */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">🔐</div>
                        <div>
                            <h2>Change Password</h2>
                            <p>Keep your account secure.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={password.currentPassword}
                                onChange={handlePasswordChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handlePasswordChange}
                                minLength="6"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={password.confirmPassword}
                                onChange={handlePasswordChange}
                                minLength="6"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        {passwordError && (
                            <div className="error-message">
                                ⚠️ {passwordError}
                            </div>
                        )}

                        {passwordMessage && (
                            <div className="success-message">
                                ✓ {passwordMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </section>

                {/* Appearance */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">🎨</div>
                        <div>
                            <h2>Appearance</h2>
                            <p>Customize how MailMind AI looks.</p>
                        </div>
                    </div>

                    <div className="appearance-options">
                        <button
                            type="button"
                            className={`appearance-option ${!isDarkMode ? "active" : ""}`}
                            onClick={() => handleThemeChange(false)}
                        >
                            <span className="appearance-option-icon">☀️</span>
                            <span>
                                <strong>Light Mode</strong>
                                <small>Clean and crisp interface</small>
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`appearance-option ${isDarkMode ? "active" : ""}`}
                            onClick={() => handleThemeChange(true)}
                        >
                            <span className="appearance-option-icon">🌙</span>
                            <span>
                                <strong>Dark Mode</strong>
                                <small>Easy on the eyes</small>
                            </span>
                        </button>
                    </div>
                </section>

                {/* Account Details */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-icon">⚙️</div>
                        <div>
                            <h2>Account Details</h2>
                            <p>Your MailMind AI account summary.</p>
                        </div>
                    </div>

                    <div className="account-info">
                        <div className="account-info-item">
                            <span>Account Name</span>
                            <strong>{user?.name || "User"}</strong>
                        </div>

                        <div className="account-info-item">
                            <span>Email Address</span>
                            <strong>{user?.email || "user@example.com"}</strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;