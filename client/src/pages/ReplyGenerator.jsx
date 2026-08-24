import { useState } from "react";

import { generateReply } from "../services/reply.api";

const ReplyGenerator = () => {

    const [formData, setFormData] = useState({
        originalEmail: "",
        tone: "Professional",
        length: "Medium",
        context: ""
    });

    const [reply, setReply] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [copied, setCopied] = useState(false);


    /* =====================================================
       HANDLE INPUT
    ===================================================== */

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    /* =====================================================
       GENERATE REPLY
    ===================================================== */

    const handleGenerate = async (e) => {

        e.preventDefault();

        if (!formData.originalEmail.trim()) {

            setError(
                "Please paste the email you received."
            );

            return;
        }

        try {

            setLoading(true);

            setError("");

            setReply("");

            setCopied(false);

            const data = await generateReply(
                formData
            );

            setReply(
                data.reply || ""
            );

        } catch (error) {

            console.error(
                "Reply Generation Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to generate reply. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       COPY REPLY
    ===================================================== */

    const handleCopy = async () => {

        if (!reply) return;

        try {

            await navigator.clipboard.writeText(
                reply
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Copy Error:",
                error
            );

            setError(
                "Unable to copy the reply."
            );

        }

    };


    /* =====================================================
       CLEAR FORM
    ===================================================== */

    const handleClear = () => {

        setFormData({
            originalEmail: "",
            tone: "Professional",
            length: "Medium",
            context: ""
        });

        setReply("");

        setError("");

        setCopied(false);

    };


    return (

        <div className="reply-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        AI Reply Generator
                    </h1>

                    <p>
                        Turn any received email into a thoughtful,
                        professional response with AI.
                    </p>

                </div>

            </div>


            {/* =================================================
                GENERATOR CARD
            ================================================= */}

            <div className="reply-card">

                <form
                    className="reply-form"
                    onSubmit={handleGenerate}
                >

                    {/* Received Email */}

                    <div className="form-group">

                        <label htmlFor="originalEmail">

                            Received Email

                            <span className="required-mark">
                                *
                            </span>

                        </label>

                        <textarea
                            id="originalEmail"
                            name="originalEmail"
                            value={
                                formData.originalEmail
                            }
                            onChange={handleChange}
                            placeholder="Paste the email you received..."
                            required
                        />

                        <span className="field-hint">
                            Paste the complete email you want
                            to reply to.
                        </span>

                    </div>


                    {/* Tone + Length */}

                    <div className="reply-options">

                        {/* Tone */}

                        <div className="form-group">

                            <label htmlFor="tone">
                                Reply Tone
                            </label>

                            <select
                                id="tone"
                                name="tone"
                                value={formData.tone}
                                onChange={handleChange}
                            >

                                <option value="Professional">
                                    Professional
                                </option>

                                <option value="Formal">
                                    Formal
                                </option>

                                <option value="Friendly">
                                    Friendly
                                </option>

                                <option value="Casual">
                                    Casual
                                </option>

                                <option value="Apologetic">
                                    Apologetic
                                </option>

                                <option value="Persuasive">
                                    Persuasive
                                </option>

                            </select>

                        </div>


                        {/* Length */}

                        <div className="form-group">

                            <label htmlFor="length">
                                Reply Length
                            </label>

                            <select
                                id="length"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                            >

                                <option value="Short">
                                    Short
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Detailed">
                                    Detailed
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Additional Context */}

                    <div className="form-group">

                        <label htmlFor="context">
                            Additional Context
                        </label>

                        <textarea
                            id="context"
                            name="context"
                            value={formData.context}
                            onChange={handleChange}
                            placeholder="Anything else the AI should know..."
                            className="context-textarea"
                        />

                        <span className="field-hint">
                            Add information such as your preferred
                            response, important details, or next steps.
                        </span>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="error-message">

                            ⚠️ {error}

                        </div>

                    )}


                    {/* Actions */}

                    <div className="reply-form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleClear}
                            disabled={loading}
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="button-spinner"></span>

                                    Generating...
                                </>

                            ) : (

                                <>
                                    ✨ Generate Reply
                                </>

                            )}

                        </button>

                    </div>

                </form>


                {/* =================================================
                    GENERATED REPLY
                ================================================= */}

                {reply && (

                    <div className="reply-result">

                        <div className="reply-result-header">

                            <div>

                                <h2>
                                    AI Generated Reply
                                </h2>

                                <p>
                                    Your personalized response is ready.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="secondary-button copy-button"
                                onClick={handleCopy}
                            >

                                {copied
                                    ? "✓ Copied"
                                    : "📋 Copy"}

                            </button>

                        </div>


                        <div className="reply-output">

                            {reply}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default ReplyGenerator;