const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/auth`;

// console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
// console.log("API_BASE_URL =", API_BASE_URL);
// console.log("API_URL =", API_URL);

/* ==============================
   ADMIN LOGIN
============================== */

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/admin-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin login failed");
  }

  return data;
};