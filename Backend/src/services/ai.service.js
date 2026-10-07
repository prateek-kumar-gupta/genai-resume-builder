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
    })).describe("A day wise preparation plan for the candidate to follow in order to crack the interview"),
    extractedResumeText: z.string().describe("The plain text extracted from the provided resume PDF, required for future downstream tasks.")
});

async function generateInterviewReport({ resumeBuffer, resumeMimeType, selfDescription, jobDescription }) {
    const promptText = `You are an elite, brutally honest FAANG technical interviewer and career coach.
Analyze the attached candidate's resume PDF against the given job description and generate a highly comprehensive, REALISTIC interview preparation report.

CRITICAL INSTRUCTION FOR PREPARATION PLAN:
Provide a TRULY REALISTIC, extensive, and highly practical day-by-day roadmap.
Due to system constraints, the total length of the plan MUST be strictly between 5 and 25 days.
- If they are missing major skills (e.g. System Design, Cloud, new languages), the plan MUST span exactly 20 to 25 days.
- If they are missing moderate skills, it MUST span 10 to 19 days.
- Even for very minor gaps, it MUST be exactly 5 to 9 days.
Never generate less than 5 days or more than 25 days.

FEASIBILITY REQUIREMENT:
The daily workload MUST be humanly feasible (e.g., assuming 2-3 hours of study per day). 
Do NOT cram 6 months of learning into a 25-day plan. If they have massive skill gaps, focus the plan on the most high-impact, interview-critical concepts for those skills rather than an impossible full mastery. Every day must have highly specific, achievable, and actionable tasks.

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
        "gemini-3-flash-preview"
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
        "gemini-3-flash-preview"
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

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4", 
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    });

const promptText = `Generate an ATS-friendly, professional resume for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

The response MUST be a JSON object with a single field "html" containing the HTML content of the resume. 

CRITICAL INSTRUCTIONS FOR QUALITY:
The HTML MUST include inline CSS styles for an elegant, professional, and clean design (use sans-serif fonts like Inter, Roboto, or Arial). 
Highlight the candidate's strengths and relevant experience based heavily on the Job Description. 
Do NOT sound like an AI. Make it sound like a real, high-quality human-written resume.
Zero Fluff or AI Buzzwords: Absolutely avoid robotic, overly-complex AI words (like "Spearheaded," "Synergized," "Delved", "Navigated"). Focus purely on concrete impact and metrics.
Length Constraint: The resume MUST perfectly fit on A4 paper and MUST NOT exceed 2 pages. Be concise and prioritize the most recent, relevant experience. Focus on quality over extreme detail.

CRITICAL INSTRUCTIONS FOR LAYOUT, STYLING, AND PAGINATION:
You MUST use the following exact CSS in the <head> of your HTML to ensure perfect styling and fix all pagination/blank space issues:

<style>
  @page { margin: 15mm; }
  body { font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; font-size: 11pt; line-height: 1.3; color: #111; margin: 0; padding: 0; }
  h1 { font-size: 24pt; font-weight: bold; margin: 0 0 5px 0; color: #111; }
  .contact-info { font-size: 10pt; margin-bottom: 15px; color: #333; }
  h2 { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #222; margin: 15px 0 10px 0; padding-bottom: 3px; page-break-after: avoid; }
  .entry { margin-bottom: 12px; page-break-inside: avoid; }
  .entry-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px; }
  .entry-subtitle { font-style: italic; margin-bottom: 4px; color: #444; }
  ul { margin: 0; padding-left: 18px; }
  li { margin-bottom: 4px; text-align: justify; }
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
</style>

HTML STRUCTURE RULES:
1. Contact Info MUST be a single line separated by pipes ( | ).
2. Use <h2> for section headers ("PROFESSIONAL SUMMARY", "WORK EXPERIENCE", etc.).
3. Wrap each individual job or education item in a <div class="entry">. This specific class fixes the massive blank space issue by preventing awkward page breaks inside a single job, while allowing breaks between different jobs.
4. Put the company and date in a <div class="entry-header">, and the role in a <div class="entry-subtitle">.
5. Technical Skills MUST be wrapped in <div class="skills-grid">.
6. Absolutely DO NOT add huge empty margins, <br> tags, or empty divs anywhere. Keep the layout dense and professional.`;

    const schema = typeof z.toJSONSchema === "function"
        ? z.toJSONSchema(resumePdfSchema)
        : zodToJsonSchema(resumePdfSchema);

    const modelsToTry = [
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-3-flash-preview"
    ];

    let lastError = null;
    let jsonContent = null;

    for (const model of modelsToTry) {
        try {
            console.log(`Attempting to generate Resume PDF HTML with model: ${model}`);
            const response = await ai.models.generateContent({
                model: model,
                contents: promptText,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            jsonContent = JSON.parse(response.text);
            break;
        } catch (error) {
            console.warn(`Model ${model} failed for Resume PDF: ${error.message}. Falling back...`);
            lastError = error;
        }
    }

    if (!jsonContent) {
        throw new Error(`Failed to generate resume HTML. Last error: ${lastError?.message}`);
    }

    // Return the raw HTML string instead of trying to run Puppeteer on Render
    return jsonContent.html;
}

module.exports = {
    generateInterviewReport,
    invokeGeminiAi,
    generateResumePdf
};

