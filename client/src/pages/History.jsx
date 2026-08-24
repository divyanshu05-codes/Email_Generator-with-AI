import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getEmailHistory,
    deleteEmail,
    toggleSaveEmail
} from "../services/history.api";


const History = () => {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [emails, setEmails] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("all");

    const [savingId, setSavingId] = useState(null);


    /* =====================================================
       FETCH HISTORY
    ===================================================== */

    const fetchHistory = async () => {

        try {

            setLoading(true);

            setError("");


            const data =
                await getEmailHistory();


            setEmails(
                data.emails || []
            );


        } catch (error) {

            console.error(
                "History Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load email history."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchHistory();

    }, []);


    /* =====================================================
       DELETE EMAIL
    ===================================================== */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this email?"
            );


        if (!confirmed) return;


        try {

            setError("");


            await deleteEmail(id);


            setEmails(
                (previousEmails) =>
                    previousEmails.filter(
                        (email) =>
                            email._id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Delete Email Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to delete email."
            );

        }

    };


    /* =====================================================
       SAVE / UNSAVE
    ===================================================== */

    const handleToggleSave = async (id) => {

        try {

            setSavingId(id);

            setError("");


            const data =
                await toggleSaveEmail(id);


            setEmails(
                (previousEmails) =>
                    previousEmails.map(
                        (email) =>
                            email._id === id
                                ? {
                                    ...email,
                                    isSaved:
                                        data.isSaved
                                }
                                : email
                    )
            );


        } catch (error) {

            console.error(
                "Save Email Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to update saved email."
            );


        } finally {

            setSavingId(null);

        }

    };


    /* =====================================================
       FILTER + SEARCH
    ===================================================== */

    const filteredEmails =
        useMemo(() => {

            return emails.filter(
                (email) => {

                    const searchText =
                        search
                            .trim()
                            .toLowerCase();


                    const matchesSearch =
                        !searchText ||
                        email.purpose
                            ?.toLowerCase()
                            .includes(searchText) ||
                        email.recipient
                            ?.toLowerCase()
                            .includes(searchText) ||
                        email.tone
                            ?.toLowerCase()
                            .includes(searchText);


                    const matchesFilter =
                        filter === "all" ||
                        email.isSaved === true;


                    return (
                        matchesSearch &&
                        matchesFilter
                    );

                }
            );

        }, [
            emails,
            search,
            filter
        ]);


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="history-page">

                <div className="page-header">

                    <div>

                        <h1>
                            Email History
                        </h1>

                        <p>
                            View and manage your
                            previously generated emails.
                        </p>

                    </div>

                </div>


                <div className="history-loading">

                    <div className="spinner"></div>

                    <p>
                        Loading your emails...
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="history-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Email History
                    </h1>

                    <p>
                        View and manage your previously
                        generated emails.
                    </p>

                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        navigate("/generate")
                    }
                >
                    ✨ New Email
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-message history-error">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            {emails.length > 0 && (

                <div className="history-toolbar">


                    {/* Search */}

                    <div className="history-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search emails..."
                        />

                        {search && (

                            <button
                                type="button"
                                className="search-clear"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>


                    {/* Filters */}

                    <div className="history-filters">

                        <button
                            type="button"
                            className={
                                filter === "all"
                                    ? "history-filter active"
                                    : "history-filter"
                            }
                            onClick={() =>
                                setFilter("all")
                            }
                        >
                            All
                            <span>
                                {emails.length}
                            </span>
                        </button>


                        <button
                            type="button"
                            className={
                                filter === "saved"
                                    ? "history-filter active"
                                    : "history-filter"
                            }
                            onClick={() =>
                                setFilter("saved")
                            }
                        >
                            ⭐ Saved
                            <span>
                                {
                                    emails.filter(
                                        (email) =>
                                            email.isSaved
                                    ).length
                                }
                            </span>
                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                NO EMAILS
            ================================================= */}

            {emails.length === 0 && (

                <div className="history-empty">

                    <div className="history-empty-icon">
                        📭
                    </div>

                    <h2>
                        No emails yet
                    </h2>

                    <p>
                        You haven't generated any AI
                        emails yet. Create your first
                        professional email in seconds.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate("/generate")
                        }
                    >
                        ✨ Generate Your First Email
                    </button>

                </div>

            )}


            {/* =================================================
                FILTERED EMPTY STATE
            ================================================= */}

            {emails.length > 0 &&
                filteredEmails.length === 0 && (

                    <div className="history-empty">

                        <div className="history-empty-icon">
                            🔍
                        </div>

                        <h2>
                            No matching emails
                        </h2>

                        <p>

                            {filter === "saved"
                                ? "You don't have any saved emails yet."
                                : "Try searching with a different keyword."}

                        </p>


                        {filter === "saved" && (

                            <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                    navigate("/generate")
                                }
                            >
                                ✨ Generate Email
                            </button>

                        )}

                    </div>

                )}


            {/* =================================================
                EMAIL LIST
            ================================================= */}

            {filteredEmails.length > 0 && (

                <div className="history-list">

                    {filteredEmails.map(
                        (email) => {

                            const formattedDate =
                                email.createdAt
                                    ? new Date(
                                        email.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "Unknown date";


                            return (

                                <div
                                    className="history-item"
                                    key={email._id}
                                >


                                    {/* =================================================
                                        EMAIL INFORMATION
                                    ================================================= */}

                                    <div className="history-info">


                                        <div className="history-title-row">


                                            <div className="history-email-icon">

                                                {email.isSaved
                                                    ? "⭐"
                                                    : "✉️"}

                                            </div>


                                            <div className="history-title-content">

                                                <div className="history-title-with-save">

                                                    <h3>

                                                        {email.purpose ||
                                                            "Untitled Email"}

                                                    </h3>


                                                    {email.isSaved && (

                                                        <span className="saved-label">
                                                            Saved
                                                        </span>

                                                    )}

                                                </div>


                                                <p>

                                                    To:{" "}

                                                    <span>
                                                        {email.recipient ||
                                                            "Unknown recipient"}
                                                    </span>

                                                </p>

                                            </div>

                                        </div>


                                        {/* Meta */}

                                        <div className="history-meta">


                                            <span className="badge badge-primary">

                                                {email.tone ||
                                                    "Professional"}

                                            </span>


                                            {email.length && (

                                                <span className="history-length">

                                                    {email.length}

                                                </span>

                                            )}


                                            <span className="history-date">

                                                📅 {formattedDate}

                                            </span>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

                                    <div className="history-actions">


                                        {/* Save */}

                                        <button
                                            type="button"
                                            className={
                                                email.isSaved
                                                    ? "saved-button"
                                                    : "secondary-button"
                                            }
                                            disabled={
                                                savingId ===
                                                email._id
                                            }
                                            onClick={() =>
                                                handleToggleSave(
                                                    email._id
                                                )
                                            }
                                        >

                                            {savingId ===
                                                email._id
                                                ? "Saving..."
                                                : email.isSaved
                                                    ? "⭐ Saved"
                                                    : "☆ Save"}

                                        </button>


                                        {/* View */}

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                navigate(
                                                    `/history/${email._id}`
                                                )
                                            }
                                        >
                                            👁️ View
                                        </button>


                                        {/* Delete */}

                                        <button
                                            type="button"
                                            className="danger-button"
                                            onClick={() =>
                                                handleDelete(
                                                    email._id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            )}

        </div>

    );

};


export default History;