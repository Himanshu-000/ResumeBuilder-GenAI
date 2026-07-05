const pdfParse = require("pdf-parse")
const {generateInterviewReport , generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interview.model")
const { id } = require("zod/v4/locales")

async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })        

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

async function GetInerviewReportByID(req, res) {

    const { interviewId } = req.params

    if (!interviewId) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    try {
        const interviewReport = await interviewReportModel.findById(interviewId)

        if (!interviewReport || interviewReport.user?.toString() !== req.user.id) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        return res.status(200).json({
            message: "Interview fetch successfully",
            interviewReport
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch interview report",
            error: error.message
        })
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}


module.exports = {generateInterViewReportController , GetInerviewReportByID , getAllInterviewReportsController , generateResumePdfController}