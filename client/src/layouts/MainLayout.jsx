import { useEffect, useState } from "react";
import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const MainLayout = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        return (
            localStorage.getItem("mailmind-theme") ===
            "dark"
        );
    });


    /* =========================
       DARK MODE
    ========================= */

    useEffect(() => {

        document.documentElement.classList.toggle(
            "dark-mode",
            darkMode
        );

        localStorage.setItem(
            "mailmind-theme",
            darkMode ? "dark" : "light"
        );

    }, [darkMode]);


    /* =========================
       LOGOUT
    ========================= */

    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

        } finally {

            navigate("/login");

        }
    };


    return (

        <div className="app-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                {/* Logo */}

                <div className="logo">

                    <span className="logo-icon">
                        ✉
                    </span>

                    <span className="logo-text">
                        MailMind
                    </span>

                </div>


                {/* Navigation */}

                <nav className="sidebar-nav">

                    <NavLink to="/dashboard">
                        <span>🏠</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/generate">
                        <span>✨</span>
                        <span>Generate Email</span>
                    </NavLink>

                    <NavLink to="/reply">
                        <span>↩️</span>
                        <span>AI Reply</span>
                    </NavLink>

                    <NavLink to="/history">
                        <span>📜</span>
                        <span>Email History</span>
                    </NavLink>

                    <NavLink to="/reply-history">
                        <span>↩️</span>
                        <span>Reply History</span>
                    </NavLink>

                </nav>


                {/* =========================
                    SIDEBAR BOTTOM
                ========================= */}

                <div className="sidebar-bottom">

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </NavLink>


                    {/* User */}

                    <div className="user-info">

                        <div className="sidebar-user-details">

                            <strong>
                                {user?.name || "User"}
                            </strong>

                            <span>
                                {user?.email || ""}
                            </span>

                        </div>

                    </div>


                    {/* Logout */}

                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        🚪
                        <span>Logout</span>
                    </button>

                </div>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="main-content">

                {/* Top Navbar */}

                <header className="topbar">

                    <div className="topbar-title">
                        AI Email Assistant
                    </div>


                    <div className="topbar-actions">

                        {/* Dark Mode */}

                        <button
                            type="button"
                            className="theme-toggle"
                            onClick={() =>
                                setDarkMode(
                                    (previous) =>
                                        !previous
                                )
                            }
                            title={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            aria-label={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                        >
                            {darkMode
                                ? "☀️"
                                : "🌙"}
                        </button>


                        {/* User */}

                        <div className="topbar-user">

                            <div className="topbar-avatar">

                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}

                            </div>

                            <span>
                                {user?.name || "User"}
                            </span>

                        </div>


                        {/* Mobile Logout */}

                        <button
                            type="button"
                            className="mobile-logout"
                            onClick={handleLogout}
                            title="Logout"
                            aria-label="Logout"
                        >
                            🚪
                        </button>

                    </div>

                </header>


                {/* Page Content */}

                <section className="page-content">

                    <Outlet />

                </section>

            </main>

        </div>

    );
};

export default MainLayout;