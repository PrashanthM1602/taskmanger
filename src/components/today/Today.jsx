import React, { useState } from "react";
import "./Today.scss";
import { Add, Delete } from "@mui/icons-material";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASKS } from "../../graphql/taskQueries";
import {
  CREATE_TASK,
  COMPLETE_TASK,
  DELETE_TASK,
} from "../../graphql/taskMutations";

const Today = () => {
  const { data, loading, error } = useQuery(GET_TASKS);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [openTask, setOpenTask] = useState(null);
  const [checkedMap, setCheckedMap] = useState({});

  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  const tasks = data?.tasks || [];
  const today = new Date();

  // =========================
  // 📅 DATE CHECK
  // =========================
  const isToday = (date) => {
    if (!date) return false;
    const d = new Date(date);

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  // =========================
  // 📋 BUILD TODAY LIST
  // =========================
  const todayList = tasks
    .filter((t) => t.parentId === null)
    .map((task) => {
      const rawDate = task.dueDate || task.due_date;

      const todaySubs = (task.subtasks || []).filter((sub) =>
        isToday(sub.dueDate || sub.due_date)
      );

      const isAI = todaySubs.length > 0;
      const isManualToday = !isAI && isToday(rawDate);

      return {
        ...task,
        rawDate,
        todaySubs,
        isAI,
        isManualToday,
        show: isAI || isManualToday,
      };
    })
    .filter((t) => t.show);

  // =========================
  // ➕ ADD TASK
  // =========================
  const handleAddTask = async () => {
    if (!title.trim()) return;

    await createTask({
      variables: {
        title,
        dueDate: dueDate
          ? new Date(dueDate).toISOString()
          : null,
      },
    });

    setTitle("");
    setDueDate("");
  };

  // =========================
  // 📊 ANALYTICS
  // =========================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="today">
      <h2>Today</h2>

      {/* ===================== */}
      {/* 📊 ANALYTICS */}
      {/* ===================== */}
      <div className="analytics">
        <div className="card">
          <h4>Total</h4>
          <p>{totalTasks}</p>
        </div>

        <div className="card">
          <h4>Completed</h4>
          <p>{completedTasks}</p>
        </div>

        <div className="card">
          <h4>Pending</h4>
          <p>{pendingTasks}</p>
        </div>
      </div>

      {/* ===================== */}
      {/* ➕ ADD TASK */}
      {/* ===================== */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={handleAddTask}>
          <Add />
        </button>
      </div>

      {/* ===================== */}
      {/* 📋 TASK LIST */}
      {/* ===================== */}
      {todayList.length === 0 ? (
        <p>No tasks for today</p>
      ) : (
        todayList.map((task) => {

          // =========================
          // ✅ FIXED PROGRESS (TODAY ONLY)
          // =========================
          const total = task.todaySubs?.length || 0;

          const completed = task.todaySubs?.filter(
            (t) => t.status === "completed"
          ).length;

          const percent = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

          let status = "On Track";
          let color = "#6c63ff";

          const now = new Date();

          const hasLateTask = task.todaySubs?.some(
            (t) =>
              t.status !== "completed" &&
              new Date(t.dueDate || t.due_date) < now
          );

          if (percent === 100 && total > 0) {
            status = "Completed";
            color = "#22c55e";
          } else if (hasLateTask) {
            status = "Behind";
            color = "#ef4444";
          }

          return (
            <div key={task.id} className="task-item">

              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() =>
                  completeTask({ variables: { taskId: task.id } })
                }
              />

              <div className="task-content">

                <div className="title">
                  {task.title}
                  {task.isAI && <span className="ai-badge">AI</span>}
                </div>

                {/* 🔥 FIXED PROGRESS */}
                {task.isAI && total > 0 && (
                  <div className="progress-wrapper">

                    <div className="progress-header">
                      <span>{completed}/{total} done</span>
                      <span className={`status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percent}%`,
                          background: color,
                        }}
                      />
                    </div>

                  </div>
                )}

                {task.isManualToday && task.rawDate && (
                  <div className="date">
                    ⏰ {new Date(task.rawDate).toLocaleString()}
                  </div>
                )}
              </div>

              {task.isAI && (
                <button
                  className="subtask-btn"
                  onClick={() => setOpenTask(task)}
                >
                  {task.todaySubs.length} Subtasks
                </button>
              )}

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

      {/* ===================== */}
      {/* 🔥 MODAL */}
      {/* ===================== */}
      {openTask && (
  <div className="modal-overlay">
    <div className="modal">

      {/* HEADER */}
      <div className="modal-header">
        <h3>🤖 {openTask.title}</h3>
        <span onClick={() => setOpenTask(null)}>✖</span>
      </div>

      {/* BODY */}
      <div className="modal-body">
        {openTask.todaySubs.map((sub) => (
          <div key={sub.id} className="modal-task">

            <input
              type="checkbox"
                checked={
               checkedMap[sub.id] !== undefined
                ? checkedMap[sub.id]
                : sub.status === "completed"
              }
              onChange={() => {
              // instant UI update
              setCheckedMap((prev) => ({
              ...prev,
              [sub.id]: !(
              checkedMap[sub.id] ?? sub.status === "completed"
              ),
              }));

            // backend call
            completeTask({ variables: { taskId: sub.id } });
            }}
          />

            <div className="modal-content">
              <span>{sub.title}</span>

              <small>
                ⏰ {new Date(
                  sub.dueDate || sub.due_date
                ).toLocaleString()}
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
      </div>

      {/* FOOTER */}
      <div className="modal-footer">
        <button onClick={() => setOpenTask(null)}>
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default Today;