import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    generateEmail,
    toggleSaveEmail
} from "../services/email.api";

import {
    getSingleEmail
} from "../services/history.api";


const EmailGenerator = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        purpose: "",
        recipient: "",
        tone: "Professional",
        length: "Medium",
        context: ""
    });


    /* =====================================================
       EMAIL STATE
    ===================================================== */

    const [generatedEmail, setGeneratedEmail] = useState("");

    const [currentEmailId, setCurrentEmailId] = useState(
        id || ""
    );

    const [isSaved, setIsSaved] = useState(false);


    /* =====================================================
       UI STATE
    ===================================================== */

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       LOAD SAVED EMAIL
       Works after refresh on /generate/:id
    ===================================================== */

    useEffect(() => {

        if (!id) return;


        const loadSavedEmail = async () => {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getSingleEmail(id);


                if (!data?.email) {

                    throw new Error(
                        "Saved email not found."
                    );

                }


                const email = data.email;


                setFormData({

                    purpose:
                        email.purpose || "",

                    recipient:
                        email.recipient || "",

                    tone:
                        email.tone || "Professional",

                    length:
                        email.length || "Medium",

                    context:
                        email.context || ""

                });


                setGeneratedEmail(
                    email.generatedEmail || ""
                );


                setCurrentEmailId(
                    email._id || id
                );


                setIsSaved(
                    email.isSaved || false
                );


            } catch (error) {

                console.error(
                    "Load Saved Email Error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load saved email."
                );


            } finally {

                setLoading(false);

            }

        };


        loadSavedEmail();

    }, [id]);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (e) => {

        setFormData((previousData) => ({

            ...previousData,

            [e.target.name]:
                e.target.value

        }));

    };


    /* =====================================================
       GENERATE EMAIL
    ===================================================== */

    const handleGenerate = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);

            setError("");

            setGeneratedEmail("");

            setIsSaved(false);


            const data =
                await generateEmail(formData);


            if (!data?.email) {

                throw new Error(
                    "AI did not return an email."
                );

            }


            setGeneratedEmail(
                data.email
            );


            if (data.emailId) {

                setCurrentEmailId(
                    data.emailId
                );


                navigate(
                    `/generate/${data.emailId}`,
                    {
                        replace: true
                    }
                );

            }


            setIsSaved(
                data.isSaved || false
            );


        } catch (error) {

            console.error(
                "Generate Email Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to generate email. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       REGENERATE EMAIL
    ===================================================== */

    const handleRegenerate = async () => {

        try {

            setLoading(true);

            setError("");

            setIsSaved(false);


            const data =
                await generateEmail(formData);


            if (!data?.email) {

                throw new Error(
                    "AI did not return an email."
                );

            }


            setGeneratedEmail(
                data.email
            );


            if (data.emailId) {

                setCurrentEmailId(
                    data.emailId
                );


                navigate(
                    `/generate/${data.emailId}`,
                    {
                        replace: true
                    }
                );

            }


            setIsSaved(
                data.isSaved || false
            );


        } catch (error) {

            console.error(
                "Regenerate Email Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to regenerate email."
            );


        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       COPY EMAIL
    ===================================================== */

    const handleCopy = async () => {

        if (!generatedEmail) return;


        try {

            await navigator.clipboard.writeText(
                generatedEmail
            );


            alert(
                "Email copied successfully!"
            );


        } catch (error) {

            console.error(
                "Copy Email Error:",
                error
            );


            setError(
                "Unable to copy email."
            );

        }

    };


    /* =====================================================
       SAVE / UNSAVE EMAIL
    ===================================================== */

    const handleSave = async () => {

        const emailId =
            currentEmailId || id;


        if (!emailId) {

            setError(
                "Please generate the email first."
            );

            return;

        }


        try {

            setSaving(true);

            setError("");


            const data =
                await toggleSaveEmail(
                    emailId
                );


            setIsSaved(
                data.isSaved
            );


        } catch (error) {

            console.error(
                "Save Email Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to save email."
            );


        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       CLEAR GENERATOR
    ===================================================== */

    const handleClear = () => {

        setFormData({

            purpose: "",

            recipient: "",

            tone: "Professional",

            length: "Medium",

            context: ""

        });


        setGeneratedEmail("");

        setCurrentEmailId("");

        setIsSaved(false);

        setError("");


        navigate(
            "/generate",
            {
                replace: true
            }
        );

    };


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="generator-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        AI Email Generator
                    </h1>

                    <p>
                        Create professional emails in seconds
                        with the power of AI.
                    </p>

                </div>

            </div>


            {/* =================================================
                GENERATOR GRID
            ================================================= */}

            <div className="generator-grid">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="generator-card">


                    <div className="card-header">

                        <div>

                            <h2>
                                Create New Email
                            </h2>

                            <p>
                                Tell us what you want to say.
                            </p>

                        </div>

                    </div>


                    <form onSubmit={handleGenerate}>


                        {/* Purpose */}

                        <div className="form-group">

                            <label>
                                What is this email about?
                            </label>

                            <textarea
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                placeholder="Example: Ask HR about a software development internship..."
                                required
                            />

                        </div>


                        {/* Recipient */}

                        <div className="form-group">

                            <label>
                                Recipient
                            </label>

                            <input
                                type="text"
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                placeholder="Example: HR Manager"
                                required
                            />

                        </div>


                        {/* Tone + Length */}

                        <div className="form-row">


                            <div className="form-group">

                                <label>
                                    Tone
                                </label>

                                <select
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

                                    <option value="Persuasive">
                                        Persuasive
                                    </option>

                                    <option value="Apologetic">
                                        Apologetic
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Length
                                </label>

                                <select
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

                            <label>

                                Additional Context

                                <span>
                                    Optional
                                </span>

                            </label>

                            <textarea
                                name="context"
                                value={formData.context}
                                onChange={handleChange}
                                placeholder="Add important details, names, deadlines, achievements, etc."
                            />

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="error-message">

                                {error}

                            </div>

                        )}


                        {/* Form Buttons */}

                        <div className="form-actions">


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

                                {loading
                                    ? "✨ Generating..."
                                    : "✨ Generate Email"}

                            </button>

                        </div>


                    </form>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="result-card">


                    <div className="card-header">

                        <div>

                            <h2>
                                Generated Email
                            </h2>

                            <p>
                                Your AI-generated email will
                                appear here.
                            </p>

                        </div>

                    </div>


                    {/* Empty State */}

                    {!generatedEmail &&
                        !loading && (

                            <div className="empty-result">

                                <div className="empty-icon">
                                    ✨
                                </div>

                                <h3>
                                    Your email will appear here
                                </h3>

                                <p>
                                    Fill in the details and click
                                    Generate Email.
                                </p>

                            </div>

                        )}


                    {/* Loading State */}

                    {loading && (

                        <div className="empty-result">

                            <div className="loading-icon">
                                ✨
                            </div>

                            <h3>
                                Writing your email...
                            </h3>

                            <p>
                                Our AI is crafting the perfect
                                message for you.
                            </p>

                        </div>

                    )}


                    {/* Generated Email */}

                    {generatedEmail &&
                        !loading && (

                            <div className="generated-result">


                                <textarea
                                    value={generatedEmail}
                                    onChange={(e) =>
                                        setGeneratedEmail(
                                            e.target.value
                                        )
                                    }
                                />


                                {/* Result Actions */}

                                <div className="result-actions">


                                    {/* Copy */}

                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="secondary-button"
                                    >
                                        📋 Copy
                                    </button>


                                    {/* Save */}

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className={
                                            isSaved
                                                ? "saved-button"
                                                : "secondary-button"
                                        }
                                        disabled={saving}
                                    >

                                        {saving
                                            ? "Saving..."
                                            : isSaved
                                                ? "⭐ Saved"
                                                : "☆ Save"}

                                    </button>


                                    {/* Regenerate */}

                                    <button
                                        type="button"
                                        onClick={handleRegenerate}
                                        className="primary-button"
                                        disabled={loading}
                                    >
                                        🔄 Regenerate
                                    </button>


                                </div>

                            </div>

                        )}

                </div>

            </div>

        </div>

    );

};


export default EmailGenerator;