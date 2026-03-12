// src/pages/dashboard/JobMessages.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import DashboardLayout from "@/components/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Send, Paperclip } from "lucide-react";

import { toast } from "sonner";

import { useJobMessages } from "@/hooks/useJobMessages";
import { messagesService, Attachment } from "@/services/messages.service";
import { uploadService } from "@/services/upload.service";
import { useChatSocket } from "@/hooks/useChatSocket";

const JobMessages = () => {

  const { jobId } = useParams<{ jobId: string }>();

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messagesState, setMessagesState] = useState<any[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimer = useRef<any>(null);

  const { data, isLoading, refetch } = useJobMessages(jobId);

  const job = data?.job;

  useEffect(() => {
    if (data?.messages) {
      setMessagesState(data.messages);
    }
  }, [data]);

  const {
    sendTypingStart,
    sendTypingStop
  } = useChatSocket(jobId, {

    onMessage: (message) => {
      setMessagesState((prev) => [...prev, message]);
    },

    onSeen: ({ messageId }) => {
      setMessagesState((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, seen_at: new Date().toISOString() }
            : m
        )
      );
    },

    onTypingStart: (payload) => {
      setTypingUser(payload?.name || "User");
    },

    onTypingStop: () => {
      setTypingUser(null);
    }

  });

  const sendMessage = async () => {

    if (!jobId || (!newMessage.trim() && attachments.length === 0)) return;

    try {

      setSending(true);

      await messagesService.sendMessage(
        jobId,
        newMessage.trim() || undefined,
        attachments
      );

      setNewMessage("");
      setAttachments([]);

      sendTypingStop();

      await refetch();

    } catch {

      toast.error("Failed to send message");

    } finally {

      setSending(false);

    }

  };

  const handleTyping = (value: string) => {

    setNewMessage(value);

    sendTypingStart({ name: "User" });

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    typingTimer.current = setTimeout(() => {
      sendTypingStop();
    }, 2000);

  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    try {

      setUploading(true);

      const uploaded = await uploadService.uploadFile(file);

      setAttachments((prev) => [...prev, uploaded]);

    } catch {

      toast.error("File upload failed");

    } finally {

      setUploading(false);

    }

  };

  return (

    <DashboardLayout
      title={job?.title ? `Chat: ${job.title}` : "Messages"}
    >

      <Card className="h-[calc(100vh-12rem)] flex flex-col">

        <CardHeader className="border-b border-border pb-4">

          <CardTitle className="text-base">
            {job?.title || "Loading..."}
          </CardTitle>

          {job && (
            <p className="text-sm text-muted-foreground">
              with {job.brand?.company_name || job.brand?.name}
            </p>
          )}

        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">

          <ScrollArea className="flex-1 p-4">

            <div className="space-y-4">

              {isLoading && (
                <p className="text-center text-muted-foreground">
                  Loading messages...
                </p>
              )}

              {messagesState.map((msg: any) => {

                const isMe = msg.isMine;

                return (

                  <div
                    key={msg.id}
                    className={`flex ${
                      isMe
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >

                      <p className="text-xs font-medium mb-1 opacity-70">
                        {msg.sender?.name || "User"}
                      </p>

                      {msg.text && (
                        <p className="text-sm">
                          {msg.text}
                        </p>
                      )}

                      {msg.attachments?.map((a: any, i: number) => (

                        <div key={i} className="mt-2">

                          {a.type === "image" && (
                            <img
                              src={a.url}
                              alt={a.name}
                              className="rounded-lg max-h-48"
                            />
                          )}

                          {a.type === "video" && (
                            <video
                              src={a.url}
                              controls
                              className="rounded-lg max-h-48"
                            />
                          )}

                          {a.type === "file" && (
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-sm"
                            >
                              {a.name}
                            </a>
                          )}

                        </div>

                      ))}

                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.created_at)
                          .toLocaleTimeString()}
                      </p>

                      {msg.seen_at && isMe && (
                        <p className="text-[10px] opacity-50 mt-1">
                          ✓✓ seen
                        </p>
                      )}

                    </div>

                  </div>

                );

              })}

              {typingUser && (
                <p className="text-sm text-muted-foreground px-2">
                  {typingUser} is typing...
                </p>
              )}

              {!isLoading && messagesState.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </p>
              )}

            </div>

          </ScrollArea>

          {attachments.length > 0 && (
            <div className="px-4 pb-2 text-xs text-muted-foreground">
              {attachments.map((a, i) => (
                <div key={i}>{a.name}</div>
              ))}
            </div>
          )}

          <div className="border-t border-border p-4 flex gap-2">

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileSelect}
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) =>
                handleTyping(e.target.value)
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  sendMessage();
                }

              }}
            />

            <Button
              onClick={sendMessage}
              disabled={
                sending ||
                uploading ||
                (!newMessage.trim() && attachments.length === 0)
              }
            >

              <Send className="w-4 h-4" />

            </Button>

          </div>

        </CardContent>

      </Card>

    </DashboardLayout>

  );

};

export default JobMessages;