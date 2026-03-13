// src/hooks/useChatSocket.ts
import { useEffect, useRef } from "react";

type ChatEvent =
  | { type: "message"; data: any }
  | { type: "message_seen"; data: { messageId: string; seenAt: string } }
  | { type: "message_deleted"; data: { messageId: string } }
  | { type: "typing_start"; data?: { userId?: string; name?: string } }
  | { type: "typing_stop"; data?: { userId?: string } };

interface Handlers {
  onMessage?: (message: any) => void;
  onSeen?: (payload: { messageId: string; seenAt: string }) => void;
  onDelete?: (payload: { messageId: string }) => void;
  onTypingStart?: (payload?: { userId?: string; name?: string }) => void;
  onTypingStop?: (payload?: { userId?: string }) => void;
}

export function useChatSocket(
  jobId: string | undefined,
  handlers: Handlers
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const socket = new WebSocket(
      `ws://localhost:4000/ws/messages/${jobId}`
    );

    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const payload: ChatEvent = JSON.parse(event.data);

        if (payload.type === "message") {
          handlers.onMessage?.(payload.data);
        }

        if (payload.type === "message_seen") {
          handlers.onSeen?.(payload.data);
        }

        if (payload.type === "message_deleted") {
          handlers.onDelete?.(payload.data);
        }

        if (payload.type === "typing_start") {
          handlers.onTypingStart?.(payload.data);
        }

        if (payload.type === "typing_stop") {
          handlers.onTypingStop?.(payload.data);
        }
      } catch {
        console.error("Invalid websocket payload");
      }
    };

    socket.onerror = () => {
      console.error("WebSocket error");
    };

    socket.onclose = () => {
      socketRef.current = null;
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [jobId, handlers]);

  const sendTypingStart = (payload?: { userId?: string; name?: string }) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "typing_start",
          data: payload || null
        })
      );
    }
  };

  const sendTypingStop = (payload?: { userId?: string }) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "typing_stop",
          data: payload || null
        })
      );
    }
  };

  return {
    sendTypingStart,
    sendTypingStop
  };
}