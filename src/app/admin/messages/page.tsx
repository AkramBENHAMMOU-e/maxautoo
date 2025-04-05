import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Inbox, RefreshCw } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

async function getMessages() {
  const messages = await prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return messages;
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter(message => message.status === "UNREAD").length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages de contact</h1>
          <p className="text-muted-foreground">
            Gérez les messages envoyés par les clients
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/messages" className="flex items-center gap-1">
            <RefreshCw size={16} />
            <span>Actualiser</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Inbox size={18} />
            <span>Boîte de réception</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {messages.length} message{messages.length > 1 ? 's' : ''} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Aucun message pour le moment
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    message.status === "UNREAD" 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{message.name}</div>
                      <div className="text-sm text-muted-foreground">{message.email}</div>
                      {message.status === "UNREAD" && (
                        <Badge>Non lu</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(message.createdAt), { 
                        addSuffix: true,
                        locale: fr 
                      })}
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-1">{message.subject}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/messages/${message.id}`}>
                        <Eye size={14} className="mr-1" />
                        Voir détails
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 