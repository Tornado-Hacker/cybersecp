import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ContactMessage } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Mail, Reply } from "lucide-react";

export default function ContactMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, message }: { id: number; message: string }) => {
      const res = await apiRequest(`/api/contact-messages/${id}/reply`, "POST", { replyMessage: message });
      if (!res.ok) {
        throw new Error("Failed to send reply");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      setReplyingTo(null);
      setReplyMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReply = (messageId: number) => {
    if (replyMessage.trim()) {
      replyMutation.mutate({ id: messageId, message: replyMessage });
    }
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <p className="text-gray-600">Manage and reply to visitor messages.</p>
      </div>

      <div className="space-y-4">
        {messages?.map((message) => (
          <Card key={message.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{message.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {message.replied ? (
                    <Badge variant="secondary">
                      <Reply className="h-3 w-3 mr-1" />
                      Replied
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                <span className="font-medium">{message.email}</span> • 
                <span className="ml-1">{new Date(message.createdAt || "").toLocaleDateString()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Message:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{message.message}</p>
              </div>

              {message.replied && message.replyMessage && (
                <div>
                  <h4 className="font-medium mb-2">Your Reply:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                    {message.replyMessage}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sent on {new Date(message.repliedAt || "").toLocaleDateString()}
                  </p>
                </div>
              )}

              {!message.replied && (
                <div className="border-t pt-4">
                  {replyingTo === message.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleReply(message.id)}
                          disabled={replyMutation.isPending || !replyMessage.trim()}
                        >
                          {replyMutation.isPending ? "Sending..." : "Send Reply"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyMessage("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setReplyingTo(message.id)}
                      variant="outline"
                      className="w-full"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply to {message.name}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {messages?.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No messages yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}