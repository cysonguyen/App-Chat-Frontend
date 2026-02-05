import { io } from "socket.io-client"

export function createSocket(url, socketToken) {
  return io(url, {
    transports: ["websocket"],
    auth: {
      token: socketToken,
    },
    autoConnect: true,
  })
}

export function closeSocket(socket) {
  if (socket) {
    socket.disconnect()
  }
}