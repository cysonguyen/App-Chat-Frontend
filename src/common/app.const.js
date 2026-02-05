export const APP_NAME = "Chat App"
export const CONVERSATION_EVENT = {
    CONVERSATION_JOIN: "conversation:join",
    CONVERSATION_LEAVE: "conversation:leave",
}
export const MESSAGE_EVENT = {
    MESSAGE_NEW: "message:new",
    MESSAGE_READ_UPDATED: "message:read:updated",
    MESSAGE_SEND: "message:send",
    MESSAGE_READ: "message:read",
}
export const USER_EVENT = {
    USER_NOTIFICATION: "user:notification",
    USER_ONLINE: "user:online",
    USER_OFFLINE: "user:offline",
}
export const SOCKET_EVENT = {
    ...CONVERSATION_EVENT,
    ...MESSAGE_EVENT,
    ...USER_EVENT,
}