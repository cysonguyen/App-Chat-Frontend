export function createSocket(url) {
  if (!url || typeof WebSocket === "undefined") {
    return null
  }
  return new WebSocket(url)
}

export function closeSocket(socket) {
  if (!socket) {
    return
  }
  socket.close()
}
