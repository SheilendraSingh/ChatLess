import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (!msg.trim()) return;
    onSend(msg);
    setMsg("");
  };

  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "10px",
          padding: "8px 12px",
          border: "none",
          background: "#007bff",
          color: "white",
          borderRadius: "5px",
        }}
      >
        Send
      </button>
    </div>
  );
}
