const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

async function readJson(response, fallbackMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // ignore: handled below
  }

  if (!response.ok) {
    const error = new Error(data.message || fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

/* Public: count a visit for this email */
export const recordVisit = async (email, path) => {
  const response = await fetch(`${API_BASE_URL}/leads/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, path }),
  });

  return readJson(response, "Could not save your email.");
};

/* Admin: list leads */
export const fetchLeads = async (token) => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Session expired. Please log in again.");
    error.unauthorized = true;
    throw error;
  }

  return readJson(response, "Could not load leads.");
};

/* Visitor chat session (no login page) */
export const createChatSession = async ({ email, name, visitorKey }) => {
  const response = await fetch(`${API_BASE_URL}/auth/visitor-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, visitorKey }),
  });

  return readJson(response, "Could not start the chat.");
};
