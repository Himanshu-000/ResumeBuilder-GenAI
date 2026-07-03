import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.contex"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [error, setError] = useState(null)

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            const interviewReport = response?.interviewReport || null
            setReport(interviewReport)

            // Avoid touching browser storage during server render.
            if (typeof window !== 'undefined' && window.localStorage && interviewReport) {
                window.localStorage.setItem(
                    `interview-${interviewReport._id}`,
                    JSON.stringify(interviewReport)
                )
            }

            return interviewReport
        } catch (error) {
            console.log(error)
            setError(error?.message || 'Unable to generate the interview report right now.')
        } finally {
            setLoading(false)
        }

        return response?.interviewReport || null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            const interviewReport = response?.interviewReport || null
            setReport(interviewReport)

            if (typeof window !== 'undefined' && window.localStorage && interviewReport) {
                window.localStorage.setItem(`interview-${interviewId}`, JSON.stringify(interviewReport))
            }

            return interviewReport
        } catch (error) {
            console.log(error)
            setError(error?.message || 'Unable to load the interview report right now.')

            if (typeof window !== 'undefined' && window.localStorage && interviewId) {
                const cachedReport = window.localStorage.getItem(`interview-${interviewId}`)
                if (cachedReport) {
                    try {
                        const parsedReport = JSON.parse(cachedReport)
                        setReport(parsedReport)
                        return parsedReport
                    } catch (parseError) {
                        console.log(parseError)
                    }
                }
            }
        } finally {
            setLoading(false)
        }
        return response?.interviewReport || null
    }

     const getReports = async () => {
    setLoading(true);
    setError(null);

    try {
        const response = await getAllInterviewReports();
        setReports(response.interviewReports);

        return response.interviewReports;
    } catch (error) {
        console.log(error);
        setError(error?.message || 'Unable to load interview reports right now.')
    } finally {
        setLoading(false);
    }
};
const getResumePdf = async (interviewReportId) => {
    console.log("Interview Report ID:", interviewReportId);

    if (!interviewReportId) {
        console.error("Interview Report ID is undefined");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const response = await generateResumePdf({ interviewReportId });

        const url = window.URL.createObjectURL(
            new Blob([response], { type: "application/pdf" })
        );

        const link = document.createElement("a");
        link.href = url;
        link.download = `resume_${interviewReportId}.pdf`;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf }

}