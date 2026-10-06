const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume PDF file is required" });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Job description is required" });
        }

        // We pass the raw PDF to Gemini to extract the report AND the plain text
        const interviewReportByAi = await generateInterviewReport({
            resumeBuffer: req.file.buffer,
            resumeMimeType: req.file.mimetype,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim()
        });

        // We pull the extracted text out so we can save it to the DB instead of "PDF Document Processed by AI"
        // This ensures generateResumePdf has access to the raw resume content later.
        const { extractedResumeText, ...reportData } = interviewReportByAi;

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: extractedResumeText || "PDF Document Processed by AI",
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim(),
            ...reportData
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("Error in generateInterviewReportController:", err);
        const errorText = err instanceof Error ? (err.stack || err.message) : String(err);
        require('fs').writeFileSync('error.log', errorText || "Unknown error");
        res.status(500).json({
            message: "Failed to parse PDF or generate report. Please ensure you uploaded a valid PDF file.",
            error: errorText
        });
    }
}

/** 
 * @route Get /api/interview 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
            
        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports // Matched user sample property name
        });
    } catch (err) {
        console.error("Error in getAllInterviewReportsController:", err);
        res.status(500).json({ message: err.message || "Failed to retrieve reports" });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    if (!interviewId || !interviewId.trim()) {
        return res.status(400).json({ message: "Interview id is required" });
    }

    try {
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }
        
        res.status(200).json({ 
            message: "Interview report fetched successfully.",
            interviewReport 
        });
    } catch (err) {
        console.error("Error in getInterviewReportByIdController:", err);
        res.status(500).json({ message: err.message || "Failed to retrieve report" });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    try {
        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ 
            resume: resume || "", 
            jobDescription: jobDescription || "", 
            selfDescription: selfDescription || "" 
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("Error in generateResumePdfController:", err);
        res.status(500).json({ message: err.message || "Failed to generate Resume PDF" });
    }
}

module.exports = {
    generateInterviewReportController,
    getAllInterviewReportsController,
    getInterviewReportByIdController,
    generateResumePdfController
};