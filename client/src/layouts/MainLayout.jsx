import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("mailmind-theme") === "dark";
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
            navigate("/login");
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="app-layout">

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={closeMobileMenu}
                />
            )}

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside
                className={`sidebar ${
                    mobileMenuOpen ? "mobile-open" : ""
                }`}
            >

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

                    <NavLink
                        to="/dashboard"
                        onClick={closeMobileMenu}
                    >
                        <span>🏠</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/generate"
                        onClick={closeMobileMenu}
                    >
                        <span>✨</span>
                        <span>Generate Email</span>
                    </NavLink>

                    <NavLink
                        to="/reply"
                        onClick={closeMobileMenu}
                    >
                        <span>↩️</span>
                        <span>AI Reply</span>
                    </NavLink>

                    <NavLink
                        to="/history"
                        onClick={closeMobileMenu}
                    >
                        <span>📜</span>
                        <span>Email History</span>
                    </NavLink>

                    <NavLink
                        to="/reply-history"
                        onClick={closeMobileMenu}
                    >
                        <span>↩️</span>
                        <span>Reply History</span>
                    </NavLink>

                </nav>

                {/* Sidebar Bottom */}

                <div className="sidebar-bottom">

                    <NavLink
                        to="/settings"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </NavLink>

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

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        🚪
                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="main-content">

                <header className="topbar">

                    {/* Mobile Menu Button */}

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileMenuOpen(true)
                        }
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    <div className="topbar-title">
                        AI Email Assistant
                    </div>

                    <div className="topbar-actions">

                        {/* Dark Mode */}

                        <button
                            type="button"
                            className="theme-toggle"
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                            title={
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

                        {/* Logout */}

                        <button
                            type="button"
                            className="mobile-logout"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            🚪
                        </button>

                    </div>

                </header>

                {/* Page */}

                <section className="page-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
};

export default MainLayout;