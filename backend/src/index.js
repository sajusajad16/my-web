const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    const text = message.toString();
    console.log(`WebSocket message received: ${text}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
