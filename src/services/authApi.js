const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/auth`;

// console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
// console.log("API_BASE_URL =", API_BASE_URL);
// console.log("API_URL =", API_URL);

/* ==============================
   CHECK EMAIL
============================== */

export const checkEmail = async (email) => {
  const response = await fetch(`${API_URL}/check-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check email");
  }

  return data;
};

/* ==============================
   SEND CUSTOMER OTP
============================== */

export const sendOTP = async (name, email) => {
  const response = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send OTP");
  }

  return data;
};

/* ==============================
   VERIFY CUSTOMER OTP
============================== */

export const verifyOTP = async (name, email, otp) => {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      otp,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
};

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