const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description controller to genrate the interview report based on Resume + Self-Description + Job-Description
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

        const parsedPdf = await pdfParse(req.file.buffer);
        const resumeText = parsedPdf.text || "";

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim()
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim(),
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (err) {
        console.error("Error in generateInterviewReportController:", err);
        res.status(500).json({
            message: err.message || "Failed to generate interview report"
        });
    }
}
/** 
 * @route Get /api/interview 
 * @description controller to get all interview reports of the logged-in user
 * @access Private 
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const reports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behaviouralQuestions  -skillGaps -preparationPlan");
        res.status(200).json({ reports });
    } catch (err) {
        console.error("Error in getAllInterviewReportsController:", err);
        res.status(500).json({ message: err.message || "Failed to retrieve reports" });
    }
}

/**
 * @description controller to get the interview report by interview id
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    if (!interviewId || !interviewId.trim()) {
        return res.status(400).json({ message: "Interview id is required" });
    }

    try {
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }
        res.status(200).json({ interviewReport });
    } catch (err) {
        console.error("Error in getInterviewReportByIdController:", err);
        res.status(500).json({ message: err.message || "Failed to retrieve report" });
    }
}

module.exports = {
    generateInterviewReportController,
    getAllInterviewReportsController,
    getInterviewReportByIdController
};