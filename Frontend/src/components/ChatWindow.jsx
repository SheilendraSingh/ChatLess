export default function ChatWindow({ messages }) {
  return (
    <div
      style={{
        height: "400px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              padding: "5px",
              margin: "3px 0",
              background: "#f1f1f1",
              borderRadius: "5px",
            }}
          >
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
}
