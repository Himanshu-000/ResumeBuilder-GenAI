import { createContext,useState } from "react";


export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const getInterview = async (id) => {
    try {
        setLoading(true)

        const res = await axios.get(`/api/interview/${id}`, {
            withCredentials: true
        })

        setReport(res.data.interviewReport)
    }
    catch(err){
        console.log(err)
    }
    finally{
        setLoading(false)
    }
}
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, getInterview,setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    )
}