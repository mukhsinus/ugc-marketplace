// src/pages/dashboard/MessagesList.tsx
import { Link } from "react-router-dom";

import DashboardLayout from "@/components/DashboardLayout";

import { Card, CardContent } from "@/components/ui/card";

import { MessageSquare } from "lucide-react";

import { useConversations } from "@/hooks/useConversations";

const MessagesList = () => {

  const { data: conversations, isLoading } = useConversations();

  return (

    <DashboardLayout title="Messages">

      <div className="space-y-3">

        {isLoading && (
          <p className="text-center py-12 text-muted-foreground">
            Loading conversations...
          </p>
        )}

        {conversations?.map((conv: any) => (

          <Link
            key={conv.id}
            to={`/dashboard/messages/${conv.id}`}
          >

            <Card className="hover:border-primary/30 transition-colors cursor-pointer">

              <CardContent className="flex items-center gap-4 py-4">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">

                  <MessageSquare className="w-5 h-5 text-primary" />

                </div>

                <div>

                  <h3 className="font-medium">
                    {conv.title}
                  </h3>

                  {conv.brand && (
                    <p className="text-sm text-muted-foreground">
                      {conv.brand.company_name || conv.brand.name}
                    </p>
                  )}

                </div>

              </CardContent>

            </Card>

          </Link>

        ))}

        {!isLoading && conversations?.length === 0 && (

          <p className="text-center text-muted-foreground py-16">
            No active conversations yet. Accept a proposal to start chatting!
          </p>

        )}

      </div>

    </DashboardLayout>

  );

};

export default MessagesList;