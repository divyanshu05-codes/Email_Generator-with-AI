const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({
    apiKey
});

/*
 * Wait helper for retry logic
 */
const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

/*
 * Generate AI email with automatic retry
 */
const generateEmail = async ({
    purpose,
    recipient,
    tone = "Professional",
    length = "Medium",
    context = ""
}) => {

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

    let response;

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        try {

            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });

            // Successful response
            break;

        } catch (error) {

            console.error(
                `Gemini request failed (attempt ${attempt}/${maxAttempts}):`,
                error.message
            );

            /*
             * Retry temporary Gemini errors:
             *
             * 503 = Service temporarily unavailable
             * 429 = Too many requests / rate limit
             */
            const shouldRetry =
                error.status === 503 ||
                error.status === 429;

            /*
             * If this is not a temporary error,
             * immediately throw it.
             */
            if (!shouldRetry) {
                throw error;
            }

            /*
             * If we've reached the final attempt,
             * stop retrying.
             */
            if (attempt === maxAttempts) {
                throw error;
            }

            /*
             * Exponential backoff:
             *
             * Attempt 1 → wait 1 second
             * Attempt 2 → wait 2 seconds
             */
            const delay = 1000 * Math.pow(2, attempt - 1);

            console.log(
                `Gemini temporarily unavailable. Retrying in ${delay / 1000} seconds...`
            );

            await sleep(delay);
        }
    }

    if (!response || !response.text) {
        throw new Error(
            "Gemini returned an empty response."
        );
    }

    return response.text;
};

const generateReply = async ({
    originalEmail,
    tone,
    length,
    context
}) => {

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

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
};

module.exports = {
    generateEmail,
    generateReply
};