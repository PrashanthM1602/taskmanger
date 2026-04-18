// ==============================
// 🌐 BASE URLs
// ==============================

// 🔐 Auth server (LOGIN + REGISTER)
const AUTH_URL = "http://127.0.0.1:8000";

// 📦 Main backend (PDF, Notes, AI)
const BASE_URL = "http://127.0.0.1:8000";

// ==============================
// 🔐 TOKEN HELPER
// ==============================
const getToken = () => localStorage.getItem("token");

// Common headers with auth
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ==============================
// 🔐 REGISTER API (NEW 🔥)
// ==============================
export const registerUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
};

// ==============================
// 🔐 LOGIN API
// ==============================
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  // ✅ Store token
  localStorage.setItem("token", data.access_token);

  return data;
};

// ==============================
// 📤 Upload PDF
// ==============================
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload-pdf`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return res.json();
};

// ==============================
// 📋 Extract Tasks
// ==============================
export const extractTasks = async () => {
  const res = await fetch(`${BASE_URL}/pdf-to-tasks`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch AI tasks");

  const data = await res.json();
  return data.ai_task_group;
};

// ==============================
// 🧠 Ask PDF
// ==============================
export const askPDF = async ({ question = null, mode = null }) => {
  const res = await fetch(`${BASE_URL}/ask-pdf`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ question, mode }),
  });

  if (!res.ok) throw new Error("Ask PDF failed");

  return res.json();
};

// ==============================
// 📌 NOTES API
// ==============================

export const fetchNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch notes");

  return res.json();
};

export const createNote = async (data) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create note");

  return res.json();
};

export const updateNote = async (id, data) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update note");

  return res.json();
};

export const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete note");

  return res.json();
};