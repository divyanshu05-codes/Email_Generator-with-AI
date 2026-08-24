import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleEmail } from "../services/history.api";

const EmailDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getSingleEmail(id);
                setEmail(data.email);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to load email details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmail();
    }, [id]);

    const handleCopy = async () => {
        if (!email?.generatedEmail) return;
        try {
            await navigator.clipboard.writeText(email.generatedEmail);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="email-details-page">
                <div className="loading-container">
                    <div className="spinner" />
                    <p>Loading email details...</p>
                </div>
            </div>
        );
    }

    if (error || !email) {
        return (
            <div className="email-details-page">
                <div className="error-message">
                    ⚠️ {error || "Email not found."}
                </div>
                <button
                    className="secondary-button"
                    style={{ marginTop: "16px" }}
                    onClick={() => navigate("/history")}
                >
                    ← Back to History
                </button>
            </div>
        );
    }

    const formattedDate = email.createdAt
        ? new Date(email.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
          })
        : null;

    return (
        <div className="email-details-page">
            <div className="page-header">
                <div>
                    <h1>Email Details</h1>
                    <p>View the full details of your generated email.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate("/history")}
                    >
                        ← Back to History
                    </button>
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => navigate(`/generate/${email._id}`)}
                    >
                        ✏️ Edit / Regenerate
                    </button>
                </div>
            </div>

            <div className="email-details-card">
                <div className="card-header" style={{ marginBottom: "16px" }}>
                    <h2>{email.purpose || "Generated Email"}</h2>
                    <p>To: {email.recipient || "Recipient"}</p>
                </div>

                <div className="email-details-meta">
                    {email.tone && (
                        <span className="email-tag">Tone: {email.tone}</span>
                    )}
                    {email.length && (
                        <span className="email-tag">Length: {email.length}</span>
                    )}
                    {formattedDate && (
                        <span className="email-tag">📅 {formattedDate}</span>
                    )}
                    {email.isSaved && (
                        <span className="email-tag" style={{ background: "#fef3c7", color: "#b45309" }}>
                            ⭐ Saved
                        </span>
                    )}
                </div>

                {email.context && (
                    <div style={{ marginBottom: "20px", padding: "12px 14px", background: "var(--surface-soft)", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                        <strong style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Context provided:</strong>
                        <p style={{ fontSize: "13px", marginTop: "4px", color: "var(--text)" }}>{email.context}</p>
                    </div>
                )}

                <div className="email-content">
                    {email.generatedEmail}
                </div>

                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleCopy}
                    >
                        {copied ? "✓ Copied!" : "📋 Copy Email"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailDetails;