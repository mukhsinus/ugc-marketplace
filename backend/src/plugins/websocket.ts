// backend/src/plugins/websocket.ts
import { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";
import { RawData, WebSocket } from "ws";

export async function registerWebsocket(app: FastifyInstance) {

  await app.register(websocket);

  const clients = new Map<string, Set<WebSocket>>();

  app.get<{ Params: { jobId: string } }>(
    "/ws/messages/:jobId",
    { websocket: true },
    (connection: any, req) => {

      const { jobId } = req.params;

      if (!clients.has(jobId)) {
        clients.set(jobId, new Set());
      }

      const sockets = clients.get(jobId)!;

      sockets.add(connection.socket);

      connection.socket.on("message", (raw: RawData) => {

        try {

          const payload = JSON.parse(raw.toString());

          if (
            payload.type === "typing_start" ||
            payload.type === "typing_stop"
          ) {

            for (const socket of sockets) {

              if (socket !== connection.socket) {

                socket.send(
                  JSON.stringify({
                    type: payload.type,
                    data: payload.data ?? null
                  })
                );

              }

            }

          }

        } catch (err) {
          console.error("WebSocket message parse error:", err);
          return;
        }

      });

      connection.socket.on("close", () => {

        sockets.delete(connection.socket);

        if (sockets.size === 0) {
          clients.delete(jobId);
        }

      });

    }
  );

  app.decorate("broadcastMessage", (jobId: string, message: any) => {

    const sockets = clients.get(jobId);

    if (!sockets) return;

    for (const socket of sockets) {

      try {

        socket.send(
          JSON.stringify({
            type: "message",
            data: message
          })
        );

      } catch (err) {

        console.error("Failed to broadcast message:", err);
        socket.close();

      }

    }

  });

  app.decorate("broadcastMessageSeen", (jobId: string, payload: any) => {

    const sockets = clients.get(jobId);

    if (!sockets) return;

    for (const socket of sockets) {

      try {

        socket.send(
          JSON.stringify({
            type: "message_seen",
            data: payload
          })
        );

      } catch (err) {

        console.error("Failed to broadcast message seen:", err);
        socket.close();

      }

    }

  });

  app.decorate("broadcastMessageDeleted", (jobId: string, payload: any) => {

    const sockets = clients.get(jobId);

    if (!sockets) return;

    for (const socket of sockets) {

      try {

        socket.send(
          JSON.stringify({
            type: "message_deleted",
            data: payload
          })
        );

      } catch (err) {

        console.error("Failed to broadcast message deleted:", err);
        socket.close();

      }

    }

  });

}