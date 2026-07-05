const express = require("express");
const authMiddleware =  require("../middleware/auth.middleware")
const interViewController = require("../controllers/interview.controllers")
const upload = require("../middleware/file.middleware")

const InterviewRouter = express.Router()


/***
 * @routes POST/api/interview
 * @description generate new interview report on the bases of self description
 * @access private
 *
 * */

InterviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interViewController.generateInterViewReportController)

/***
 * @routes GET/api/:interviewID
 * @description generate i interview report by interbiew ID
 * @access private
 *
 * */

InterviewRouter.get("/:interviewId",authMiddleware.authUser,interViewController.GetInerviewReportByID)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
InterviewRouter.get("/", authMiddleware.authUser, interViewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
InterviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interViewController.generateResumePdfController)


module.exports = InterviewRouter;