import { useEffect, useRef, useState } from "react"
import { useSocket } from "../contexts/SocketContext"

export function useVideoCall() {
    const { socket, connected } = useSocket()

    const pcRef = useRef(null)
    const localStreamRef = useRef(null)
    const remoteStreamRef = useRef(null)

    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [inCall, setInCall] = useState(false)
    const pendingCandidates = useRef([])


    // ========================
    // INIT PEER CONNECTION
    // ========================
    const createPeerConnection = () => {
        if (pcRef.current) return pcRef.current

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        })

        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit("call:ice", {
                    toUserId: pc._remoteUserId,
                    candidate: event.candidate,
                })
            }
        }

        pc.ontrack = (event) => {
            const stream = event.streams[0]
            remoteStreamRef.current = stream
            setRemoteStream(stream)
        }

        pc.onconnectionstatechange = () => {
            console.log("🔗 PC state:", pc.connectionState)
        
            if (pc.connectionState === "failed" || pc.connectionState === "closed") {
                cleanup()
            }
        }

        pcRef.current = pc
        return pc
    }

    // ========================
    // GET MEDIA
    // ========================
    const getLocalMedia = async () => {
        if (localStreamRef.current) return localStreamRef.current

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })

            localStreamRef.current = stream
            setLocalStream(stream)

            return stream
        } catch (error) {
            console.error("❌ getLocalMedia error", error)
            return null
        }
    }

    // ========================
    // CALL (caller)
    // ========================
    const callUser = async (toUserId) => {
        if (!socket || !connected) return

        const pc = createPeerConnection()
        pc._remoteUserId = toUserId

        const stream = await getLocalMedia()
        stream.getTracks().forEach(t => pc.addTrack(t, stream))

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        socket.emit("call:offer", {
            toUserId,
            offer,
        })

        setInCall(true)
    }

    // ========================
    // ACCEPT CALL (callee)
    // ========================
    const acceptCall = async ({ fromUserId, offer }) => {
        if (!socket || !connected) return

        const pc = createPeerConnection()
        pc._remoteUserId = fromUserId

        const stream = await getLocalMedia()
        stream.getTracks().forEach((t) => pc.addTrack(t, stream))

        await pc.setRemoteDescription(offer)

        pendingCandidates.current.forEach((candidate) => {
            pc.addIceCandidate(candidate)
        })
        pendingCandidates.current = []

        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        socket.emit("call:answer", {
            toUserId: fromUserId,
            answer,
        })

        setInCall(true)
    }

    // ========================
    // HANG UP
    // ========================
    const hangup = () => {
        if (socket && pcRef.current?._remoteUserId) {
            socket.emit("call:hangup", {
                toUserId: pcRef.current._remoteUserId,
            })
        }
        cleanup()
    }

    // ========================
    // CLEANUP
    // ========================
    const cleanup = () => {
        pcRef.current?.getSenders().forEach(sender => {
            pcRef.current.removeTrack(sender)
        })

        pcRef.current?.close()
        pcRef.current = null

        localStreamRef.current?.getTracks().forEach(t => t.stop())
        localStreamRef.current = null
        remoteStreamRef.current = null
        pendingCandidates.current = []

        setLocalStream(null)
        setRemoteStream(null)
        setInCall(false)
    }
    // ========================
    // SOCKET LISTENERS
    // ========================
    useEffect(() => {
        if (!socket || !connected) return

        socket.on("call:offer", acceptCall)

        socket.on("call:answer", async ({ answer }) => {
            console.log("📥 call:answer received")
            if (pcRef.current) {
                console.log("✅ Remote description set (answer)")
                await pcRef.current.setRemoteDescription(answer)
                pendingCandidates.current.forEach((candidate) => {
                    pcRef.current.addIceCandidate(candidate)
                })
                pendingCandidates.current = []
            }
            console.log("❌ No PC connection available")
        })

        socket.on("call:ice", ({ candidate }) => {
            if (!pcRef.current) return

            if (pcRef.current.remoteDescription) {
                pcRef.current.addIceCandidate(candidate)
            } else {
                pendingCandidates.current.push(candidate)
            }
        })

        socket.on("call:hangup", cleanup)

        return () => {
            socket.off("call:offer", acceptCall)
            socket.off("call:answer")
            socket.off("call:ice")
            socket.off("call:hangup")
        }
    }, [socket, connected])

    return {
        localStream,
        remoteStream,
        inCall,
        callUser,
        hangup,
    }
}
