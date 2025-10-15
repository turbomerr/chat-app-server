import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {server, app} from "./socket/socket.js"
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";

import {connectMongoDB} from "./db/connectDatabse.js"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config({path: '../.env'})
const PORT = process.env.PORT || 3000;

app.use(express.json())  // to parse the incoming requests with JSON payloads (from req.body)
app.use(cors())
app.use(helmet( {contentSecurityPolicy : false }))
app.use(morgan("dev"))
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello")
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes)

app.use((err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({success : false,message : err.message || "Internal server error"})
     
})

server.listen(PORT, () => {
    connectMongoDB()
    console.log("Server listening on port", PORT);
})

