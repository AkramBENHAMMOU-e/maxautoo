"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, User, Calendar, Check } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MessageDetailPage({ params }: { params: any }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/contact/${id}`);
        
        if (!response.ok) {
          throw new Error("Message non trouvé");
        }
        
        const data = await response.json();
        setMessage(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le message",
          variant: "destructive",
        });
        router.push("/admin/messages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessage();
  }, [id, router, toast]);
  
  const markAsRead = async () => {
    if (!message || message.status !== "UNREAD") return;
    
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "READ" }),
      });
      
      if (!response.ok) {
        throw new Error("Échec de la mise à jour du statut");
      }
      
      setMessage({ ...message, status: "READ" });
      
      toast({
        title: "Message marqué comme lu",
        description: "Le statut du message a été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du message",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }
  
  if (!message) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Message non trouvé</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/messages">Retour aux messages</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/messages" className="flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Retour aux messages</span>
          </Link>
        </Button>
        
        {message.status === "UNREAD" && (
          <Button onClick={markAsRead} size="sm" className="flex items-center gap-1">
            <Check size={16} />
            <span>Marquer comme lu</span>
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{message.subject}</CardTitle>
            {message.status === "UNREAD" ? (
              <Badge>Non lu</Badge>
            ) : (
              <Badge variant="outline">Lu</Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:gap-8 bg-slate-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <User size={18} className="text-slate-500 mt-0.5" />
              <div>
                <div className="text-sm text-slate-500">De</div>
                <div className="font-medium">{message.name}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail size={18} className="text-slate-500 mt-0.5" />
              <div>
                <div className="text-sm text-slate-500">Email</div>
                <div className="font-medium">{message.email}</div>
              </div>
            </div>
            
            {message.phone && (
              <div className="flex items-start gap-2">
                <Phone size={18} className="text-slate-500 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Téléphone</div>
                  <div className="font-medium">{message.phone}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <Calendar size={18} className="text-slate-500 mt-0.5" />
              <div>
                <div className="text-sm text-slate-500">Date</div>
                <div className="font-medium">
                  {format(new Date(message.createdAt), "PPP à HH:mm", { locale: fr })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Message</h3>
            <div className="bg-white p-6 rounded-lg border whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" asChild>
            <Link href="/admin/messages">Retour</Link>
          </Button>
          
          <Button asChild>
            <Link href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
              Répondre par email
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 