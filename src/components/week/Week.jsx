import React, { useState } from "react";
import { Delete } from "@mui/icons-material";
import "./week.scss";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASKS } from "../../graphql/taskQueries";
import { COMPLETE_TASK, DELETE_TASK } from "../../graphql/taskMutations";

const Week = () => {
  const { data, loading, error } = useQuery(GET_TASKS);

  const [openTask, setOpenTask] = useState(null);
  const [checkedMap, setCheckedMap] = useState({});

  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  const tasks = data?.tasks || [];

  // ✅ WEEK RANGE
  const today = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(today.getDate() + 7);

  const isInWeek = (date) => {
    if (!date) return false;
    const d = new Date(date);
    return d >= today && d <= weekEnd;
  };

  // 🔥 MAIN LOGIC (SAME AS TOMORROW)
  const finalList = tasks
    .filter((t) => t.parentId === null)
    .map((task) => {
      const matchingSubs = (task.subtasks || []).filter((sub) =>
        isInWeek(sub.dueDate)
      );

      const isManual = isInWeek(task.dueDate);
      const isAI = matchingSubs.length > 0;

      return {
        ...task,
        matchingSubs,
        isManual,
        isAI,
        show: isManual || isAI,
      };
    })
    .filter((t) => t.show);

  return (
    <div className="week">
      <p className="title">This Week</p>

      
      {/* <div className="task-item add">
        <Add />
        <span>Add New Task</span>
      </div> */}

      {finalList.length === 0 ? (
        <p>No tasks this week</p>
      ) : (
        finalList.map((task) => {
          const rawDate = task.dueDate || task.due_date;

          return (
            <div key={task.id} className="task-item">

              {/* ✅ CHECK */}
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() =>
                  completeTask({ variables: { taskId: task.id } })
                }
              />

              {/* 📌 CONTENT */}
              <div className="task-content">
                <div className="title">
                  {task.title}

                  {/* 🤖 AI BADGE */}
                  {task.isAI && <span className="ai-badge">AI</span>}
                </div>

                {/* ✅ MANUAL DATE */}
                {task.isManual && rawDate && (
                  <div className="date">
                    ⏰ {new Date(rawDate).toLocaleString()}
                  </div>
                )}
              </div>

              {/* 🔥 SUBTASK BUTTON */}
              {task.isAI && (
                <button
                  className="subtask-btn"
                  onClick={() => setOpenTask(task)}
                >
                  {task.matchingSubs.length} Subtasks
                </button>
              )}

              {/* ❌ DELETE */}
              <Delete
                className="delete"
                onClick={() =>
                  deleteTask({ variables: { taskId: task.id } })
                }
              />
            </div>
          );
        })
      )}

      {/* 🔥 MODAL */}
      {openTask && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>🤖 {openTask.title}</h3>

            {openTask.matchingSubs.map((sub) => (
              <div key={sub.id} className="modal-task">

                <input
  type="checkbox"
  checked={
    checkedMap[sub.id] !== undefined
      ? checkedMap[sub.id]
      : sub.status === "completed"
  }
  onChange={() => {
    setCheckedMap((prev) => ({
      ...prev,
      [sub.id]: !(
        checkedMap[sub.id] ?? sub.status === "completed"
      ),
    }));

    completeTask({ variables: { taskId: sub.id } });
  }}
/>

                <div className="modal-content">
                  <span>{sub.title}</span>

                  <small>
                    ⏰ {new Date(sub.dueDate).toLocaleString()}
                  </small>
                </div>

                <Delete
                  className="delete"
                  onClick={() =>
                    deleteTask({ variables: { taskId: sub.id } })
                  }
                />
              </div>
            ))}

            <button onClick={() => setOpenTask(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Week;