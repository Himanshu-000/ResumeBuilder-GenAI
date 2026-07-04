const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")


const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = process.env.CLIENT_URLS.split(",");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
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