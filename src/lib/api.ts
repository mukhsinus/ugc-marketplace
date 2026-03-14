// src/lib/api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const TOKEN_KEY = "ugc_token";

async function request(
  path: string,
  options: RequestInit = {}
) {

  const token = localStorage.getItem(TOKEN_KEY);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      json?.error || `API error: ${res.status}`
    );
  }

  return json;
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