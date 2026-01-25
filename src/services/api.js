const BASE_URL = import.meta.env.VITE_API_URL || ""

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "API request failed")
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

export function apiGet(path, options) {
  return request(path, { ...options, method: "GET" })
}

export function apiPost(path, body, options) {
  return request(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  })
}
