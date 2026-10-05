const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @description Generates a new interview report for a candidate based on their resume pdf, self-description, and job description
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/my-reports
 * @description Get all interview reports for the current user
 * @access Private
 */
interviewRouter.get("/my-reports", authMiddleware.authUser, interviewController.getMyInterviewReportsController);

/**
 * @route GET /api/interview/:id
 * @description Get a specific interview report by ID
 * @access Private
 */
interviewRouter.get("/:id", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

module.exports = interviewRouter;