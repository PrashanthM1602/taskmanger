import React, { useState, useRef, useEffect } from "react";
import "./PdfAssistantModal.scss";
import { askPDF, createNote } from "../api";

const PdfAssistantModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState(null);

  const chatRef = useRef(null);

  // 🔥 Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  // 🔥 Clean AI text
  const cleanText = (text) => {
    return text.replace(/\*\*/g, "").replace(/\n/g, "\n\n");
  };

  // =========================
  // 🧠 SEND TO AI
  // =========================
  const handleSend = async (payload) => {
    setLoading(true);

    try {
      const res = await askPDF(payload);

      const modeLabelMap = {
        task: "📋 Task Mode",
        insight: "📊 Insight Mode",
        study: "🧠 Study Mode",
        risk: "⚠️ Risk Mode",
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: payload.question || modeLabelMap[payload.mode],
        },
        {
          role: "ai",
          text: cleanText(res.answer),
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("AI failed");
    }

    setLoading(false);
  };

  // =========================
  // 📩 USER INPUT
  // =========================
  const handleSubmit = () => {
    if (!input.trim()) return;

    handleSend({ question: input });
    setInput("");
    setActiveMode(null);
  };

  // =========================
  // 🔘 MODE CLICK
  // =========================
  const handleMode = (mode) => {
    setActiveMode(mode);
    handleSend({ mode });
  };

  // =========================
  // 📌 SAVE NOTE
  // =========================
  const handleSaveNote = async (text) => {
    try {
      await createNote({
        title: "AI Note",
        content: text,
        color: "#fff3a0",
      });

      alert("Saved to Sticky Wall ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  // =========================
  // 🔥 SMART MODES (UPDATED)
  // =========================
  const modes = [
    { key: "task", label: "📋 Task Mode" },
    { key: "insight", label: "📊 Insight Mode" },
    { key: "study", label: "🧠 Study Mode" },
    { key: "risk", label: "⚠️ Risk Mode" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal chat-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>🧠 PDF Assistant</h3>
          <span onClick={onClose}>✖</span>
        </div>

        {/* 🔥 SMART MODES */}
        <div className="smart-buttons">
          {modes.map((mode) => (
            <button
              key={mode.key}
              className={activeMode === mode.key ? "active" : ""}
              onClick={() => handleMode(mode.key)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* CHAT */}
        <div className="chat-body" ref={chatRef}>
          {messages.length === 0 && (
            <p className="placeholder">
              Ask anything about your PDF...
            </p>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <div>{msg.text}</div>

              {/* SAVE BUTTON */}
              {msg.role === "ai" && (
                <button
                  className="save-note-btn"
                  onClick={() => handleSaveNote(msg.text)}
                >
                  📌 Save as Note
                </button>
              )}
            </div>
          ))}

          {loading && <div className="loading">AI is thinking...</div>}
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
          />
          <button onClick={handleSubmit}>Send</button>
        </div>

      </div>
    </div>
  );
};

export default PdfAssistantModal;