import React from "react";
import "./StickyNote.scss";
import { Delete, Edit } from "@mui/icons-material";

const StickyNote = ({ title, content, color, onEdit, onDelete }) => {
  return (
    <div className="stickyNote" style={{ backgroundColor: color }}>
      <div className="stickyNote-header">
        <h3 className="stickyNote-title">{title}</h3>
        <div className="stickyNote-icons">                 
          <Edit className="icon" onClick={onEdit} titleAccess="Edit" />
          <Delete className="icon" onClick={onDelete} titleAccess="Delete" />
        </div>
      </div>
      <div className="stickyNote-body">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default StickyNote;