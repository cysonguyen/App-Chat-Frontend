export function readJson(key, fallback = null) {
  if (typeof localStorage === "undefined") {
    return fallback
  }
  const value = localStorage.getItem(key)
  if (!value) {
    return fallback
  }
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  if (typeof localStorage === "undefined") {
    return
  }
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeJson(key) {
  if (typeof localStorage === "undefined") {
    return
  }
  localStorage.removeItem(key)
}
