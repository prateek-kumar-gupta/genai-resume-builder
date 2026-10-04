const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF file is required"
            });
        }

        const parser = new pdfParse.PDFParse({ data: req.file.buffer });
        const parsedPdf = await parser.getText();
        const resumeContent = parsedPdf.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        });
    }
}

module.exports = { generateInterviewReportController };