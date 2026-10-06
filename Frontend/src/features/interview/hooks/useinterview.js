import { getAllInterviewReports, getInterviewReportById, generateInterviewReport } from "../../auth/services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"



export const useInterview = () => {
    const context = useContext(InterviewContext)

    if(!context) {
        throw new Error("useInterview must be used within InterviewProvider")
    }
    
    const {loading , setLoading , report , setReport , reports , setReports} = context;

    // generate interview report
    const generateReport = async ({jobDescription , selfDescription , resumeFile}) => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({jobDescription , selfDescription , resumeFile});
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // get all interview reports
    const getReports = async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // get interview report by id
    const getReportById = async (interviewId) => {
        setLoading(true);
        try {
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        getReports,
        getReportById,
        generateReport
    };
}