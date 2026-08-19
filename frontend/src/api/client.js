function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function ensureCsrf() {
  if (!getCookie("csrf_token")) {
    await apiFetch("/api/csrf");
  }
}

export async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };

  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
    headers["x-csrf-token"] = getCookie("csrf_token") || "";
  }

  const response = await fetch(path, {
    ...options,
    method,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || data?.message || "Une erreur est survenue.";
    throw new Error(message);
  }

  return data;
}
