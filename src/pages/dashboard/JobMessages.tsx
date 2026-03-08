import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";

const JobMessages = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const loadData = async () => {
      const [jobRes, msgRes] = await Promise.all([
        supabase.from("jobs").select("*, profiles!jobs_brand_id_fkey(name, company_name)").eq("id", jobId).single(),
        supabase.from("messages").select("*, profiles!messages_sender_id_fkey(name, avatar_url, role)").eq("job_id", jobId).order("created_at", { ascending: true }),
      ]);
      setJob(jobRes.data);
      setMessages(msgRes.data || []);
    };
    loadData();

    // Real-time subscription
    const channel = supabase
      .channel(`messages-${jobId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `job_id=eq.${jobId}` }, async (payload) => {
        const { data } = await supabase
          .from("messages")
          .select("*, profiles!messages_sender_id_fkey(name, avatar_url, role)")
          .eq("id", payload.new.id)
          .single();
        if (data) setMessages((prev) => [...prev, data]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [jobId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !profile || !jobId) return;
    setLoading(true);
    const { error } = await supabase.from("messages").insert({
      job_id: jobId,
      sender_id: profile.id,
      text: newMessage.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
  };

  return (
    <DashboardLayout title={job?.title ? `Chat: ${job.title}` : "Messages"}>
      <Card className="h-[calc(100vh-12rem)] flex flex-col">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base">{job?.title || "Loading..."}</CardTitle>
          {job && <p className="text-sm text-muted-foreground">with {(job.profiles as any)?.company_name || (job.profiles as any)?.name}</p>}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender_id === profile?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p className="text-xs font-medium mb-1 opacity-70">{(msg.profiles as any)?.name || "User"}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-50 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</p>
              )}
            </div>
          </ScrollArea>
          <div className="border-t border-border p-4 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default JobMessages;
