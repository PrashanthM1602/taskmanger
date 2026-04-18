import React from "react";
import "./New.scss";
import { Add } from "@mui/icons-material";

const New = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h2>Add New Task</h2>
        <div className="new">
          <div className="top">
            <p className="title">Task:</p>
            <input
              type="text"
              placeholder="Enter a Task"
              value=""
            /> <br /> <br />
            <textarea placeholder="Description" value=""></textarea>
          </div>

          <div className="center">
            <ul>
              <li>
                <p>Category</p>
                <select name="list" id="list" value="">
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="others">Others</option>
                </select>
              </li>
              <li>
                <p>Due Date</p>
                <input type="date" name="due_date" id="due_date" value="" />
              </li>

              <li>
                <p>Tags</p>
                <div className="tags">
                  <select
                    multiple
                    value=""
                    className="native-multi-select"
                    style={{
                      width: "100%",
                      height: "100px",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="1">Urgent</option>
                    <option value="2">Important</option>
                    <option value="3">Optional</option>
                  </select>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    <strong>Selected: </strong>
                    Urgent, Important
                  </div>
                </div>
                <p className="note" style={{ marginTop: "8px" }}>
                  <strong>Note:</strong> You can select multiple tags by holding
                  Ctrl (Cmd on Mac). Want to add a new tag? Go to the sidebar.
                </p>
              </li>
            </ul>
            <div className="subtasks">
              <p className="sub">Subtaks: </p>
              <ul>
                <li>
                  <input type="text" placeholder="Subtask 1" />
                </li>
                <li>
                  <input type="text" placeholder="Subtask 2" />
                </li>
                <li className="add-subtask">
                  <Add className="icon" /> <span>Add New subtask</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bottom">
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="delete">Delete</button>
            <button className="save">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;