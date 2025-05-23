import express from "express"
import http from "http"
import {Server} from "socket.io"


export const app = express();

export const server = http.createServer(app); //create a server

const io = new Server(server, {
    cors : {
       origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log("UserId connected: ", socket.id)
})