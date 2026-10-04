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

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical interviewer and career coach.
Analyze the following candidate's profile against the given job description and generate a comprehensive interview preparation report.

Job Description:
${jobDescription}

Resume:
${resume}

Candidate Self Description:
${selfDescription}
`;

    const schema = typeof z.toJSONSchema === "function"
        ? z.toJSONSchema(interviewReportSchema)
        : zodToJsonSchema(interviewReportSchema);

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        },
    });

    const parsedData = JSON.parse(response.text);
    console.log(JSON.stringify(parsedData, null, 2));
    return parsedData;
}

async function invokeGeminiAi() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Hello gemini ! Explain What is Interview ?"
    });
    console.log(response.text);
    return response.text;
}

module.exports = {
    generateInterviewReport,
    invokeGeminiAi
};