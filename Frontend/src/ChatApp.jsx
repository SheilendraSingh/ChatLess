import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatApp() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState([]);
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Join room when roomId changes
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
      scrollToBottom();
    });

    socket.on("receive_previous_messages", (msgs) => {
      setChat(msgs);
      scrollToBottom();
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_previous_messages");
    };
  }, []);

  const joinRoom = () => {
    if (!username.trim()) return alert("Enter a username!");
    // Automatically create a personal room using username
    const personalRoom = username + "_room";
    setRoom(personalRoom);
    socket.emit("join_room", personalRoom);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = {
      room,
      message,
      author: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.emit("send_message", msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage("");
  };

  if (!joined) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Enter Your Username</h2>
        <input
          type="text"
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinRoom}>Join Personal Room</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{username}'s Personal Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        {chat.map((c, i) => (
          <p key={i}>
            <strong>{c.author}</strong>: {c.message}{" "}
            <span style={{ fontSize: "0.8em", color: "gray" }}>({c.time})</span>
          </p>
        ))}
        <div ref={chatEndRef} />
      </div>
      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
