const { GoogleGenAI } = require("@google/genai");

const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured on the server. Please check your environment variables."
        );
    }
    return new GoogleGenAI({ apiKey });
};

/*
 * Wait helper for retry logic
 */
const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const MODELS_TO_TRY = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];

/*
 * Generate AI email with automatic retry and model fallback
 */
const generateEmail = async ({
    purpose,
    recipient,
    tone = "Professional",
    length = "Medium",
    context = ""
}) => {
    const ai = getAIClient();

    const prompt = `
You are an expert professional email writer.

Generate a professional email based on the information below.

Purpose:
${purpose}

Recipient:
${recipient}

Tone:
${tone}

Length:
${length}

Additional Context:
${context || "None"}

Requirements:
- Generate a clear and natural email.
- Include an appropriate subject line.
- Do not invent personal information.
- Do not add explanations outside the email.
- Make the email grammatically correct.
- Match the requested tone and length.
- Keep the email natural and human-like.
- Do not use unnecessary placeholders unless information is genuinely missing.

Return the response in exactly this format:

Subject: <email subject>

Body:
<email body>
`;

    let lastError;

    for (const model of MODELS_TO_TRY) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: prompt
                });

                if (response?.text) {
                    return response.text;
                }
            } catch (error) {
                lastError = error;
                console.error(
                    `Gemini request failed (model: ${model}, attempt ${attempt}/2):`,
                    error.message || error
                );

                const shouldRetry =
                    error.status === 503 ||
                    error.status === 429 ||
                    (error.message && error.message.includes("high demand"));

                if (shouldRetry && attempt < 2) {
                    const delay = 1000 * attempt;
                    await sleep(delay);
                } else {
                    // Break out of retry loop to try the next model
                    break;
                }
            }
        }
    }

    throw lastError || new Error("Failed to generate email with Gemini API.");
};

/*
 * Generate AI reply with automatic retry and model fallback
 */
const generateReply = async ({
    originalEmail,
    tone,
    length,
    context
}) => {
    const ai = getAIClient();

    const prompt = `
You are an expert professional email communication assistant.

Read the email below and generate an appropriate reply.

Original Email:
${originalEmail}

Reply Tone:
${tone}

Reply Length:
${length}

Additional Context:
${context || "None"}

Requirements:
- Understand the original email before replying.
- Write a natural and professional response.
- Do not invent facts or commitments.
- Match the requested tone.
- Keep the response appropriate to the original email.
- Do not include explanations outside the reply.

Return only the reply email.
`;

    let lastError;

    for (const model of MODELS_TO_TRY) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: prompt
                });

                if (response?.text) {
                    return response.text;
                }
            } catch (error) {
                lastError = error;
                console.error(
                    `Gemini reply failed (model: ${model}, attempt ${attempt}/2):`,
                    error.message || error
                );

                const shouldRetry =
                    error.status === 503 ||
                    error.status === 429 ||
                    (error.message && error.message.includes("high demand"));

                if (shouldRetry && attempt < 2) {
                    const delay = 1000 * attempt;
                    await sleep(delay);
                } else {
                    break;
                }
            }
        }
    }

    throw lastError || new Error("Failed to generate reply with Gemini API.");
};

module.exports = {
    generateEmail,
    generateReply
};