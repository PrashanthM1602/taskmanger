import React, { useState, useEffect } from "react";
import "./Sticky.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import StickyNote from "../../components/StickyNote/StickyNote";
import StickyModal from "../../components/StickyModal/StickyModal";
import { Add } from "@mui/icons-material";

// 🔥 API IMPORT
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../../api";

const Sticky = () => {
  const [wall, setWall] = useState([]);
  const [modalOpen, setModalopen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // =========================
  // 📥 LOAD NOTES FROM BACKEND
  // =========================
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes();
      setWall(data);
    } catch (err) {
      console.error("Failed to load notes", err);
    }
  };

  // =========================
  // 🧩 MODAL CONTROL
  // =========================
  const openAddModal = () => {
    setEditingNote(null);
    setModalopen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setModalopen(true);
  };

  const closeModal = () => {
    setModalopen(false);
  };

  // =========================
  // ➕ CREATE / ✏️ UPDATE
  // =========================
  const handleSubmit = async (data) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, data);
      } else {
        await createNote(data);
      }

      loadNotes(); // 🔥 refresh UI
      closeModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong");
    }
  };

  // =========================
  // 🗑 DELETE
  // =========================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        loadNotes();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="sticky">
      <Sidebar />

      <div className="stickyContainer">
        <p className="title">Sticky Wall</p>

        <div className="row">
          {wall.map((note) => (
            <StickyNote
              key={note.id}
              title={note.title}
              content={note.content}
              color={note.color}
              onEdit={() => openEditModal(note)}
              onDelete={() => handleDelete(note.id)}
            />
          ))}

          {/* ➕ ADD NOTE BUTTON */}
          <div
            className="stickyNote addNote"
            onClick={openAddModal}
            style={{
              cursor: "pointer",
              backgroundColor: "lightgray",
            }}
          >
            <Add className="icon" />
          </div>
        </div>
      </div>

      {/* MODAL */}
      <StickyModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingNote}
      />
    </div>
  );
};

export default Sticky;