import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getReplyHistory,
    deleteReply
} from "../services/replyHistory.api";


const ReplyHistory = () => {

    const [replies, setReplies] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const navigate =
        useNavigate();


    const fetchReplies = async () => {

        try {

            setLoading(true);
            setError("");


            const data =
                await getReplyHistory();


            setReplies(
                data.replies || []
            );

        } catch (error) {

            console.error(
                "Reply History Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load reply history."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchReplies();

    }, []);


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this reply?"
            );


        if (!confirmed) return;


        try {

            await deleteReply(id);


            setReplies(
                previousReplies =>
                    previousReplies.filter(
                        reply =>
                            reply._id !== id
                    )
            );

        } catch (error) {

            console.error(
                "Delete Reply Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to delete reply."
            );

        }

    };


    if (loading) {

        return (

            <div className="history-page">

                <div className="page-header">

                    <div>

                        <h1>
                            Reply History
                        </h1>

                        <p>
                            View and manage your
                            previously generated replies.
                        </p>

                    </div>

                </div>


                <div className="history-loading">

                    <div className="spinner"></div>

                    <p>
                        Loading your replies...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="history-page">


            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>
                        Reply History
                    </h1>

                    <p>
                        View and manage your
                        previously generated AI replies.
                    </p>

                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        navigate("/reply")
                    }
                >
                    ↩️ New Reply
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="error-message history-error">

                    ⚠️ {error}

                </div>

            )}


            {/* Empty */}

            {replies.length === 0 ? (

                <div className="history-empty">

                    <div className="history-empty-icon">
                        ↩️
                    </div>


                    <h2>
                        No replies yet
                    </h2>


                    <p>
                        You haven't generated any
                        AI replies yet. Create your
                        first intelligent reply.
                    </p>


                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate("/reply")
                        }
                    >
                        ↩️ Generate Your First Reply
                    </button>

                </div>

            ) : (

                <div className="history-list">

                    {replies.map((reply) => {

                        const formattedDate =
                            reply.createdAt
                                ? new Date(
                                    reply.createdAt
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
                                key={reply._id}
                            >

                                <div className="history-info">

                                    <div className="history-title-row">

                                        <div className="history-email-icon">
                                            ↩️
                                        </div>


                                        <div className="history-title-content">

                                            <h3>
                                                AI Reply
                                            </h3>


                                            <p>
                                                {reply.originalEmail
                                                    ?.slice(0, 100)
                                                    || "Original email"}
                                                {reply.originalEmail?.length > 100
                                                    ? "..."
                                                    : ""}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="history-meta">

                                        <span className="badge badge-primary">

                                            {reply.tone ||
                                                "Professional"}

                                        </span>


                                        {reply.length && (

                                            <span className="history-length">

                                                {reply.length}

                                            </span>

                                        )}


                                        <span className="history-date">

                                            📅 {formattedDate}

                                        </span>

                                    </div>

                                </div>


                                <div className="history-actions">

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            navigate(
                                                `/reply-history/${reply._id}`
                                            )
                                        }
                                    >
                                        👁️ View
                                    </button>


                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() =>
                                            handleDelete(
                                                reply._id
                                            )
                                        }
                                    >
                                        🗑️ Delete
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

};


export default ReplyHistory;