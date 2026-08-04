const API = import.meta.env.VITE_API_URL;

export const sendContactMessage = async (form) => {
  const response = await fetch(`${API}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to send message.");
  }

  return data;
};