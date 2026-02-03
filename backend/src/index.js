const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", () => {
  console.log("WebSocket client connected");
});

server.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
