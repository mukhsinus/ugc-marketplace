// src/pages/dashboard/MessagesList.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const MessagesList = () => {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      // Get jobs where user is involved (as brand or accepted creator)
      let jobIds: string[] = [];
      
      if (profile.role === "brand") {
        const { data } = await supabase.from("jobs").select("id, title").eq("brand_id", profile.id);
        jobIds = data?.map(j => j.id) || [];
        setConversations(data || []);
      } else {
        const { data } = await supabase
          .from("proposals")
          .select("job_id, jobs(id, title, profiles!jobs_brand_id_fkey(name, company_name))")
          .eq("creator_id", profile.id)
          .eq("status", "accepted");
        setConversations(data?.map(p => ({ id: (p.jobs as any)?.id, title: (p.jobs as any)?.title, brand: (p.jobs as any)?.profiles })) || []);
      }
    };
    load();
  }, [profile]);

  return (
    <DashboardLayout title="Messages">
      <div className="space-y-3">
        {conversations.map((conv) => (
          <Link key={conv.id} to={`/dashboard/messages/${conv.id}`}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{conv.title}</h3>
                  {conv.brand && <p className="text-sm text-muted-foreground">{(conv.brand as any)?.company_name || (conv.brand as any)?.name}</p>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {conversations.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No active conversations yet. Accept a proposal to start chatting!</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessagesList;
