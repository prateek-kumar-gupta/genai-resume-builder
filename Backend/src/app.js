const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


// require all the  routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


// usig all the routes here 
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


app.use((err, req, res, next) => {
    console.error('Unhandled Express Error:', err);
    require('fs').writeFileSync('express_error.log', err.stack || err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
