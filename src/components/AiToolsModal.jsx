import React, { useState } from "react";
import "./AiToolsModal.scss";
import { uploadPDF, extractTasks } from "../api";

import { useQuery } from "@apollo/client/react";
import { GET_TASKS } from "../graphql/taskQueries";

const AiToolsModal = ({ onClose, openAssistant }) => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  // 🔥 NEW: store uploaded PDF ID
  const [pdfId, setPdfId] = useState(null);

  const { refetch } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only", // 🔥 important
  });

  // =========================
  // 📤 UPLOAD PDF
  // =========================
  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");

    setLoading(true);

    try {
      const res = await uploadPDF(file);

      // 🔥 STORE PDF ID
      setPdfId(res.pdf_id);

      setUploaded(true);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  // =========================
  // 🔥 GENERATE + FETCH REAL TASKS
  // =========================
  const handleGenerateTasks = async () => {
    if (!pdfId) {
      alert("PDF not found. Please upload again.");
      return;
    }

    setLoading(true);

    try {
      // 🔥 PASS PDF ID (CRITICAL FIX)
      await extractTasks(pdfId);

      // 🔥 wait for DB commit
      await new Promise((res) => setTimeout(res, 500));

      // 🔥 fetch updated tasks
      const { data } = await refetch();

      const tasks = data?.tasks || [];

      // 🔥 find latest AI parent task
      const latestAI = [...tasks]
        .reverse()
        .find((t) => t.parentId === null && t.subtasks?.length > 0);

      if (!latestAI) {
        alert("No AI tasks found");
        return;
      }

      setPreview(latestAI);

    } catch (err) {
      console.error(err);
      alert("Task generation failed");
    }

    setLoading(false);
  };

  // =========================
  // 💾 SAVE
  // =========================
  const handleSave = () => {
    alert("Tasks ready 🚀");
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal ai-tools">

        {/* HEADER */}
        <div className="modal-header">
          <h3>🤖 AI Tools</h3>
          <span className="close-btn" onClick={onClose}>✖</span>
        </div>

        {/* ========================= */}
        {/* 🔥 PREVIEW MODE */}
        {/* ========================= */}
        {preview ? (
          <div className="preview-container">

            <h3 className="preview-title">📌 {preview.title}</h3>

            <div className="preview-list">
              {preview.subtasks.map((task) => (
                <div key={task.id} className="preview-item">

                  <input type="checkbox" />

                  <div className="preview-content">
                    <p>{task.title}</p>

                    <div className="meta">
                      ⏰ {new Date(
                        task.dueDate || task.due_date
                      ).toLocaleDateString()}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <button className="save-btn" onClick={handleSave}>
              ✅ Save Tasks
            </button>

          </div>
        ) : !uploaded ? (
          <div className="upload-section">

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={handleUpload}>
              {loading ? "Uploading..." : "Upload PDF"}
            </button>

          </div>
        ) : (
          <div className="action-section">

            <p className="success-text">✅ PDF uploaded</p>

            <button
              className="task-btn"
              onClick={handleGenerateTasks}
              disabled={loading}
            >
              {loading ? "Generating..." : "📋 Generate Tasks"}
            </button>

            <button
              className="assistant-btn"
              onClick={() => {
                onClose();
                openAssistant();
              }}
            >
              🧠 Ask PDF Assistant
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default AiToolsModal;
