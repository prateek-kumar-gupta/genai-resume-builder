const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    title: z.string().describe("The title of the job for which the interview report is generated"),
    matchScore: z.number().describe("The candidate's match score against the job description from 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical questions can be asked in interview"),
        intention: z.string().describe("The intention of the interviewer while asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc")
    })).describe("The list of technical questions can be asked in interview"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral questions can be asked in interview"),
        intention: z.string().describe("The intention of the interviewer while asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc")
    })).describe("The list of behavioral questions can be asked in interview"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high", "Low", "Medium", "High"]).describe("The severity level of the skill gap")
    })).describe("The list of skill gaps the candidate is lacking along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from day 1"),
        focus: z.string().describe("The main focus for this day in preparation plan, could be any concept or skill etc"),
        tasks: z.array(z.string()).describe("The list of tasks to be completed for that day in preparation plan")
    })).describe("A day wise preparation plan for the candidate to follow in order to crack the interview")
});

async function generateInterviewReport({ resumeBuffer, resumeMimeType, selfDescription, jobDescription }) {
    const promptText = `You are an expert technical interviewer and career coach.
Analyze the attached candidate's resume PDF against the given job description and generate a comprehensive interview preparation report.

IMPORTANT INSTRUCTION FOR PREPARATION PLAN:
The length (number of days) of the preparationPlan MUST be entirely driven by the depth and volume of the candidate's skill gaps.
DO NOT use arbitrary short lengths like 3 or 4 days unless the candidate is literally 100% prepared and only needs a quick recap. 
Think carefully: "How many actual days of study would it realistically take a human to learn and practice these missing skills?"
If they are missing complex skills (e.g. System Design, Kubernetes, Advanced ML), the plan should genuinely span 14, 21, or even 30+ days.
If they are missing minor syntax knowledge, it might be 5-10 days.
Output the precise, realistic number of days required.

Job Description:
${jobDescription}

Candidate Self Description:
${selfDescription}
`;

    const schema = typeof z.toJSONSchema === "function"
        ? z.toJSONSchema(interviewReportSchema)
        : zodToJsonSchema(interviewReportSchema);

    const modelsToTry = [
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash"
    ];

    let lastError = null;

    for (const model of modelsToTry) {
        try {
            console.log(`Attempting to generate report with model: ${model}`);
            const response = await ai.models.generateContent({
                model: model,
                contents: [
                    promptText,
                    {
                        inlineData: {
                            data: resumeBuffer.toString("base64"),
                            mimeType: resumeMimeType || "application/pdf"
                        }
                    }
                ],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                },
            });

            // Parse and return immediately if successful
            const parsedData = JSON.parse(response.text);
            return parsedData;
        } catch (error) {
            console.warn(`Model ${model} failed: ${error.message}. Falling back to next model...`);
            lastError = error;
        }
    }

    // If all models failed, throw the last error
    throw new Error(`All fallback models failed. Last error: ${lastError?.message}`);
}

async function invokeGeminiAi() {
    const modelsToTry = [
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash"
    ];

    let lastError = null;

    for (const model of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: "Hello gemini ! Explain What is Interview ?"
            });
            console.log(`Success with ${model}:`, response.text);
            return response.text;
        } catch (error) {
            console.warn(`Model ${model} failed: ${error.message}`);
            lastError = error;
        }
    }

    throw new Error(`All fallback models failed. Last error: ${lastError?.message}`);
}

module.exports = {
    generateInterviewReport,
    invokeGeminiAi
};