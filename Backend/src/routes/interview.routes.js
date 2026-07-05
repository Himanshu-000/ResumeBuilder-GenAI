const express = require("express");
const authMiddleweare =  require("../middleweare/auth.middleweare")
const interViewController = require("../contollers/interview.controller")
const upload = require("../middleweare/file.middleweare")

const InterviewRouter = express.Router()


/***
 * @routes POST/api/interview
 * @description generate new interview report on the bases of self description
 * @access private
 *
 * */

InterviewRouter.post("/",authMiddleweare.authUser,upload.single("resume"),interViewController.generateInterViewReportController)

/***
 * @routes GET/api/:interviewID
 * @description generate i interview report by interbiew ID
 * @access private
 *
 * */

InterviewRouter.get("/:interviewId",authMiddleweare.authUser,interViewController.GetInerviewReportByID)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
InterviewRouter.get("/", authMiddleweare.authUser, interViewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
InterviewRouter.post("/resume/pdf/:interviewReportId", authMiddleweare.authUser, interViewController.generateResumePdfController)


module.exports = InterviewRouter;