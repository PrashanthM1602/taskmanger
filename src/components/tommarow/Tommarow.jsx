import React, { useState } from "react";
import "./Tommarow.scss";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASKS } from "../../graphql/taskQueries";
import { COMPLETE_TASK, DELETE_TASK } from "../../graphql/taskMutations";
import { Delete } from "@mui/icons-material";

const Tomorrow = () => {
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 🔥 DATE CHECK
  const isTomorrow = (date) => {
    if (!date) return false;
    const d = new Date(date);

    return (
      d.getFullYear() === tomorrow.getFullYear() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getDate() === tomorrow.getDate()
    );
  };

  // 🔥 BUILD LIST
  const tomorrowList = tasks
    .filter((t) => t.parentId === null)
    .map((task) => {
      const rawDate = task.dueDate || task.due_date;

      const tomorrowSubs = (task.subtasks || []).filter((sub) =>
        isTomorrow(sub.dueDate || sub.due_date)
      );

      const isAI = tomorrowSubs.length > 0;
      const isManual = !isAI && isTomorrow(rawDate);

      return {
        ...task,
        rawDate,
        tomorrowSubs,
        isAI,
        isManual,
        show: isAI || isManual,
      };
    })
    .filter((t) => t.show);

  return (
    <div className="tomorrow">
      <p className="title">Tomorrow</p>

      {tomorrowList.length === 0 ? (
        <p>No tasks for tomorrow</p>
      ) : (
        tomorrowList.map((task) => (
          <div key={task.id} className="task-item">

            {/* ✅ CHECKBOX */}
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
                {task.isAI && <span className="ai-badge">AI</span>}
              </div>

              {/* ⏰ MANUAL DATE */}
              {task.isManual && task.rawDate && (
                <div className="date">
                  ⏰ {new Date(task.rawDate).toLocaleString()}
                </div>
              )}
            </div>

            {/* 🔥 SUBTASK BUTTON */}
            {task.isAI && (
              <button
                className="subtask-btn"
                onClick={() => setOpenTask(task)}
              >
                {task.tomorrowSubs.length} Subtasks
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
        ))
      )}

      {/* ========================= */}
      {/* 🔥 MODAL */}
      {/* ========================= */}
      {openTask && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>🤖 {openTask.title}</h3>

            {openTask.tomorrowSubs.map((sub) => (
              <div key={sub.id} className="modal-task">

                {/* ✅ CHECKBOX */}
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

                {/* 📌 CONTENT */}
                <div className="modal-content">
                  <span>{sub.title}</span>

                  <small>
                    ⏰ {new Date(
                      sub.dueDate || sub.due_date
                    ).toLocaleString()}
                  </small>
                </div>

                {/* ❌ DELETE */}
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

export default Tomorrow;