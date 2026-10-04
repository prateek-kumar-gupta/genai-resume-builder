require("dotenv").config()
const app = require("./src/app")
const connectTODB = require("./src/config/database")
const { resume, selfDescription, jobDescription } = require("./src/services/temp")
const { generateInterviewReport } = require("./src/services/ai.service")

connectTODB()


generateInterviewReport({ resume, selfDescription, jobDescription })

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})