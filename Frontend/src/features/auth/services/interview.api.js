import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

/***
 * @description : service to call generate interview api 
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)
    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

/**
 * @description : service to call get interview report by id api 
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * @description : service to call get all interview reports api 
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview");
    return response.data;
}

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post("/api/interview/resume/generate", 
        { interviewReportId },
        { responseType: "blob" } // IMPORTANT: to receive PDF buffer
    );
    return response.data;
}