const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")


const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://resume-builder-gen-ai-blue.vercel.app",
  "https://resume-builder-gen-cv3en1gl1-himanshu001.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


//required all the auth routes
const auth_routes = require("./Routes/auth.routes");
const InterViewRouter = require("./Routes/interview.routes")


//using all the routes here
app.use("/api/auth",auth_routes);
app.use("/api/interview",InterViewRouter)

module.exports = app;