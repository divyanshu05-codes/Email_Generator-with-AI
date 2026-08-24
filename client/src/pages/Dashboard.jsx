import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { getDashboardStats } from "../services/stats.api";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        aiEmails: 0,
        aiReplies: 0,
        savedEmails: 0
    });

    const [loadingStats, setLoadingStats] = useState(true);

    /* =====================================================
       FETCH DASHBOARD STATS
    ===================================================== */
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                const data = await getDashboardStats();

                setStats({
                    aiEmails: data.aiEmails || 0,
                    aiReplies: data.aiReplies || 0,
                    savedEmails: data.savedEmails || 0
                });
            } catch (error) {
                console.error("Dashboard Stats Error:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-page">
            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}
            <div className="page-header dashboard-header">
                <div className="dashboard-welcome">
                    <h1>
                        Good to see you, {user?.name || "User"} 👋
                    </h1>
                    <p>
                        What would you like to write today?
                    </p>
                </div>

                <button
                    className="primary-button new-email-button"
                    onClick={() => navigate("/generate")}
                >
                    ✨ New Email
                </button>
            </div>

            {/* =================================================
                STATISTICS
            ================================================= */}
            <div className="stats-grid">
                {/* AI Emails */}
                <div className="stat-card">
                    <div className="stat-icon email-stat-icon">
                        ✉️
                    </div>
                    <div className="stat-content">
                        <span>AI Emails</span>
                        <strong>
                            {loadingStats ? "..." : stats.aiEmails}
                        </strong>
                    </div>
                </div>

                {/* AI Replies */}
                <div className="stat-card">
                    <div className="stat-icon reply-stat-icon">
                        ↩️
                    </div>
                    <div className="stat-content">
                        <span>AI Replies</span>
                        <strong>
                            {loadingStats ? "..." : stats.aiReplies}
                        </strong>
                    </div>
                </div>

                {/* Saved Emails */}
                <div className="stat-card">
                    <div className="stat-icon saved-stat-icon">
                        📜
                    </div>
                    <div className="stat-content">
                        <span>Saved Emails</span>
                        <strong>
                            {loadingStats ? "..." : stats.savedEmails}
                        </strong>
                    </div>
                </div>
            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}
            <div className="section-heading">
                <h2>Quick Actions</h2>
                <p>Get started with MailMind AI</p>
            </div>

            <div className="quick-actions action-grid">
                {/* Write Email */}
                <div
                    className="action-card"
                    onClick={() => navigate("/generate")}
                >
                    <div className="action-icon">
                        ✨
                    </div>
                    <div className="action-content">
                        <h3>Write an Email</h3>
                        <p>
                            Generate a professional email from a simple description.
                        </p>
                    </div>
                    <span className="action-arrow">→</span>
                </div>

                {/* Generate Reply */}
                <div
                    className="action-card"
                    onClick={() => navigate("/reply")}
                >
                    <div className="action-icon reply-icon reply-action-icon">
                        ↩️
                    </div>
                    <div className="action-content">
                        <h3>Generate a Reply</h3>
                        <p>
                            Create an intelligent response to an email you received.
                        </p>
                    </div>
                    <span className="action-arrow">→</span>
                </div>

                {/* Email History */}
                <div
                    className="action-card"
                    onClick={() => navigate("/history")}
                >
                    <div className="action-icon history-icon history-action-icon">
                        📜
                    </div>
                    <div className="action-content">
                        <h3>Email History</h3>
                        <p>
                            View and manage your previously generated emails.
                        </p>
                    </div>
                    <span className="action-arrow">→</span>
                </div>
            </div>

            {/* =================================================
                AI PROMO BANNER / TIP
            ================================================= */}
            <div className="dashboard-tip ai-promo-banner">
                <div className="tip-icon ai-promo-icon">
                    💡
                </div>
                <div className="ai-promo-content">
                    <h3>Write less. Communicate better.</h3>
                    <p>
                        Describe what you want to say and let MailMind AI turn your idea into a polished email.
                    </p>
                </div>
                <button
                    className="secondary-button ai-promo-button"
                    onClick={() => navigate("/generate")}
                >
                    Try it now →
                </button>
            </div>
        </div>
    );
};

export default Dashboard;