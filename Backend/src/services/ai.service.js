const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The candidate's match score against the job description from 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical questions can be asked in interview"),
        intention: z.string().describe("The intention of the interviewer while asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc")
    })).describe("The list of technical questions can be asked in interview"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The behavioural questions can be asked in interview"),
        intention: z.string().describe("The intention of the interviewer while asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc")
    })).describe("The list of behavioural questions can be asked in interview"),
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

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical interviewer and career coach.
Analyze the following candidate's profile against the given job description and generate a comprehensive interview preparation report.

Job Description:
${jobDescription || "Not provided"}

Resume:
${resume || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: typeof z.toJSONSchema === "function"
                ? z.toJSONSchema(interviewReportSchema)
                : zodToJsonSchema(interviewReportSchema),
        },
    });

    const parsedData = JSON.parse(response.text);

    // Normalize for mongoose interviewReportModel compatibility
    if (parsedData.behaviouralQuestions && !parsedData.behavioralQuestions) {
        parsedData.behavioralQuestions = parsedData.behaviouralQuestions;
    }
    if (Array.isArray(parsedData.skillGaps)) {
        parsedData.skillGaps = parsedData.skillGaps.map((item) => ({
            ...item,
            severity: typeof item.severity === "string" ? item.severity.toLowerCase() : item.severity,
        }));
    }
    if (Array.isArray(parsedData.preparationPlan)) {
        parsedData.preparationPlan = parsedData.preparationPlan.map((item) => ({
            ...item,
            task: item.task || item.tasks || [],
        }));
    }

    return parsedData;
}

async function invokeGeminiAi() {
    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Hello gemini ! Explain What is Interview ?"
    });
    console.log(response.text);
    return response.text;
}

module.exports = {
    generateInterviewReport,
    invokeGeminiAi,
    interviewReportSchema
};
