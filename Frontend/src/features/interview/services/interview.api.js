import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

/**
 * Generate a new interview report by sending resume file, job description, and optional self description
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export async function generateInterviewReportApi(formData) {
    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

/**
 * Fetch all interview reports for the logged in user
 * @returns {Promise<Object>}
 */
export async function getMyInterviewReportsApi() {
    const response = await api.get("/api/interview/my-reports");
    return response.data;
}

/**
 * Fetch a specific interview report by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getInterviewReportByIdApi(id) {
    const response = await api.get(`/api/interview/${id}`);
    return response.data;
}
