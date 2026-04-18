// ==============================
// 🌐 BASE URL (PRODUCTION READY)
// ==============================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://taskmanager-backend-quuh.onrender.com";

const AUTH_URL = BASE_URL;

// ==============================
// 🔐 TOKEN HELPERS
// ==============================

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ==============================
// 🔧 COMMON FETCH HANDLER
// ==============================

const handleResponse = async (res) => {
  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
};

// ==============================
// 🔐 REGISTER
// ==============================

export const registerUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
};

// ==============================
// 🔐 LOGIN
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

  const data = await handleResponse(res);

  // ✅ Store token safely
  localStorage.setItem("token", data.access_token);

  return data;
};

// ==============================
// 📤 UPLOAD PDF
// ==============================

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();

  const res = await fetch(`${BASE_URL}/upload-pdf`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  return handleResponse(res);
};

// ==============================
// 📋 EXTRACT TASKS
// ==============================

export const extractTasks = async () => {
  const res = await fetch(`${BASE_URL}/pdf-to-tasks`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.ai_task_group;
};

// ==============================
// 🧠 ASK PDF
// ==============================

export const askPDF = async ({ question = null, mode = null }) => {
  const res = await fetch(`${BASE_URL}/ask-pdf`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ question, mode }),
  });

  return handleResponse(res);
};

// ==============================
// 📌 NOTES APIs
// ==============================

export const fetchNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};

export const createNote = async (data) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const updateNote = async (id, data) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

export const deleteNote = async (id) => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return handleResponse(res);
};