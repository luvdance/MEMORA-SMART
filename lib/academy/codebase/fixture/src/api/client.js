const BASE_URL = import.meta.env.VITE_API_URL || "";

// Every call to the API goes through here, so errors are handled one way.
export async function request(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
  return data;
}
