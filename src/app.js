const express =require("express");
const cookieParser =require("cookie-parser");
const cors =require("cors");
const app =express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"https://jobready-opal.vercel.app",
    credentials:true
}))
const authRouter =require("./routes/auth.routes");
const interviewRouter =require("./routes/Interview.routes")
app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter);
module.exports =app;