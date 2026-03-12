// src/pages/dashboard/JobMessages.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";

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

import { Send } from "lucide-react";

import { toast } from "sonner";

import { useJobMessages } from "@/hooks/useJobMessages";
import { messagesService } from "@/services/messages.service";

const JobMessages = () => {

  const { jobId } = useParams<{ jobId: string }>();

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { data, isLoading, refetch } = useJobMessages(jobId);

  const messages = data?.messages || [];
  const job = data?.job;

  const sendMessage = async () => {

    if (!jobId || !newMessage.trim()) return;

    try {

      setSending(true);

      await messagesService.sendMessage(jobId, newMessage.trim());

      setNewMessage("");

      await refetch();

    } catch {

      toast.error("Failed to send message");

    } finally {

      setSending(false);

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

              {messages.map((msg: any) => {

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

                      <p className="text-sm">
                        {msg.text}
                      </p>

                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.created_at)
                          .toLocaleTimeString()}
                      </p>

                    </div>

                  </div>

                );

              })}

              {!isLoading && messages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </p>
              )}

            </div>

          </ScrollArea>

          <div className="border-t border-border p-4 flex gap-2">

            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
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
                !newMessage.trim()
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