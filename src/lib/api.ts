// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

async function request(
  path: string,
  options: RequestInit = {}
) {

  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {

    const error = await res.json().catch(() => ({}));

    throw new Error(
      error.message || `API error: ${res.status}`
    );

  }

  return res.json();
}

export const api = {

  get(path: string) {
    return request(path);
  },

  post(path: string, body?: any) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  patch(path: string, body?: any) {
    return request(path, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  },

  delete(path: string) {
    return request(path, {
      method: "DELETE"
    });
  }

};