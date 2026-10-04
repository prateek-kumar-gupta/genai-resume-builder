const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/generate-report
 * @description Generates a new interview report for a candidate based on their resume pdf, self-description, and job description
 * @access Private
 */
interviewRouter.post("/generate-report", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

module.exports = interviewRouter;