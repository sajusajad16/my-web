import React, { useEffect, useMemo, useRef, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:3000";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    const handleOpen = () => setConnectionStatus("Connected");
    const handleClose = () => setConnectionStatus("Disconnected");
    const handleError = () => setConnectionStatus("Error");
    const handleMessage = (event) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          text: event.data,
          timestamp: new Date().toLocaleTimeString(),
          sender: "received",
        },
      ]);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, []);

  const canSend = useMemo(() => inputValue.trim().length > 0, [inputValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSend || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const trimmedMessage = inputValue.trim();
    socketRef.current.send(trimmedMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: crypto.randomUUID(),
        text: trimmedMessage,
        timestamp: new Date().toLocaleTimeString(),
        sender: "sent",
      },
    ]);
    setInputValue("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Live Chat</h1>
            <p style={styles.subtitle}>WebSocket connection status: {connectionStatus}</p>
          </div>
          <span
            style={{
              ...styles.statusDot,
              backgroundColor:
                connectionStatus === "Connected"
                  ? "#22c55e"
                  : connectionStatus === "Connecting..."
                  ? "#f59e0b"
                  : "#ef4444",
            }}
            aria-hidden="true"
          />
        </header>

        <section style={styles.messageList}>
          {messages.length === 0 ? (
            <p style={styles.emptyState}>No messages yet. Say hello!</p>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                style={{
                  ...styles.messageItem,
                  ...(message.sender === "sent" ? styles.sentMessage : styles.receivedMessage),
                }}
              >
                <div style={styles.messageText}>{message.text}</div>
                <div style={styles.messageTime}>
                  {message.sender === "sent" ? "You" : "Server"} · {message.timestamp}
                </div>
              </article>
            ))
          )}
        </section>

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            style={styles.input}
            aria-label="Chat message"
          />
          <button type="submit" style={styles.button} disabled={!canSend}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    color: "#e2e8f0",
  },
  card: {
    width: "min(720px, 100%)",
    background: "#0f172a",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.45)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },
  statusDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  messageList: {
    background: "rgba(15, 23, 42, 0.7)",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    padding: "20px",
    minHeight: "240px",
    maxHeight: "360px",
    overflowY: "auto",
    display: "grid",
    gap: "16px",
    marginBottom: "24px",
  },
  emptyState: {
    margin: 0,
    color: "#94a3b8",
    textAlign: "center",
  },
  messageItem: {
    background: "rgba(30, 41, 59, 0.8)",
    padding: "12px 16px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sentMessage: {
    alignItems: "flex-end",
    background: "rgba(56, 189, 248, 0.2)",
  },
  receivedMessage: {
    alignItems: "flex-start",
  },
  messageText: {
    fontSize: "15px",
  },
  messageTime: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  form: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: "#0b1220",
    color: "#e2e8f0",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#38bdf8",
    color: "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default App;
