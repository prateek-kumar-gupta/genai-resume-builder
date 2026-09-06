const express = require("express");


const app = express(); 

app.use(express.json());


// require all the  routes here
const authRouter =  require("./routes/auth.routes")


// usig all the routes here 
app.use("/api/auth", authRouter)



module.exports = app;
