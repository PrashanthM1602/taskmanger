import React, { useState } from "react";
import "./AiToolsModal.scss";
import { uploadPDF, extractTasks } from "../api";

import { useQuery } from "@apollo/client/react";
import { GET_TASKS } from "../graphql/taskQueries";

const AiToolsModal = ({ onClose, openAssistant }) => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null); // 🔥 KEY STATE

  const { refetch } = useQuery(GET_TASKS);

  // =========================
  // 📤 UPLOAD PDF
  // =========================
  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");

    setLoading(true);
    try {
      await uploadPDF(file);
      setUploaded(true);
    } catch {
      alert("Upload failed");
    }
    setLoading(false);
  };

  // =========================
  // 🔥 GENERATE + FETCH REAL TASKS
  // =========================
  const handleGenerateTasks = async () => {
    setLoading(true);

    try {
      // Step 1: generate (backend saves)
      await extractTasks();

      // Step 2: fetch latest tasks
      const { data } = await refetch();

      const tasks = data?.tasks || [];

      // Step 3: find latest AI task group
      const latestAI = [...tasks]
        .reverse()
        .find((t) => t.parentId === null && t.subtasks?.length > 0);

      if (!latestAI) {
        alert("No AI tasks found");
        return;
      }

      setPreview(latestAI); // 🔥 SHOW PREVIEW

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