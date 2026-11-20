const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

async function readJson(response, fallbackMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // handled below
  }

  if (!response.ok) {
    const error = new Error(data.message || fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/* Screenshot paths from the server are relative to the API address. */
export const imageUrl = (path) => `${API_BASE_URL}${path}`;

export const fetchPublicProjects = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/projects`, { signal });
  const data = await readJson(response, "Could not load projects.");

  return data.projects || [];
};

export const fetchAllProjects = async (token) => {
  const response = await fetch(`${API_BASE_URL}/projects/manage/all`, {
    headers: authHeaders(token),
  });
  const data = await readJson(response, "Could not load projects.");

  return data.projects || [];
};

export const createProject = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  return readJson(response, "Could not save the project.");
};

export const updateProject = async (token, id, payload) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  return readJson(response, "Could not update the project.");
};

export const deleteProject = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  return readJson(response, "Could not delete the project.");
};
