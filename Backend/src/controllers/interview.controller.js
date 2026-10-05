const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

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

async function getMyInterviewReportsController(req, res) {
    try {
        const reports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ reports });
    } catch (err) {
        console.error("Error in getMyInterviewReportsController:", err);
        res.status(500).json({ message: err.message || "Failed to retrieve reports" });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const report = await interviewReportModel.findOne({ _id: req.params.id, user: req.user.id });
        if (!report) {
            return res.status(404).json({ message: "Interview report not found" });
        }
        res.status(200).json({ report });
    } catch (err) {
        console.error("Error in getInterviewReportByIdController:", err);
        res.status(500).json({ message: err.message || "Failed to retrieve report" });
    }
}

module.exports = {
    generateInterviewReportController,
    getMyInterviewReportsController,
    getInterviewReportByIdController
};