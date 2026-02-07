import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// 0:connecting
// 1:open the only state where data can be sent and received.
// 2:closing
// 3:closed

wss.on("connection", (socket, req) => {
 const ip = req.socket.remoteAddress;
});

console.log("WebSocket server is running on ws://localhost:8080"); 