"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@prisma/client";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  }).optional().or(z.literal("")),
  role: z.enum(["USER", "ADMIN"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientFormProps {
  client?: User;
}

export function ClientForm({ client }: ClientFormProps = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!client;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  // Initialiser le formulaire avec les valeurs existantes si en mode édition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: client?.email || "",
      password: "",  // Toujours vide en mode édition
      role: (client?.role as "USER" | "ADMIN") || "USER",
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    setFormData(data);
    setIsConfirmOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Supprimer le mot de passe vide en mode édition
      if (isEditMode && !data.password) {
        delete data.password;
      }

      const response = await fetch(
        isEditMode ? `/api/admin/clients/${client.id}` : "/api/admin/clients",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      toast.success(
        isEditMode
          ? "Client mis à jour avec succès"
          : "Client créé avec succès"
      );
      
      router.push("/admin/clients");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du client:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="email@exemple.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isEditMode 
                          ? "Mot de passe (laisser vide pour ne pas changer)" 
                          : "Mot de passe"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={isEditMode ? "••••••••" : "Mot de passe"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">Utilisateur</SelectItem>
                          <SelectItem value="ADMIN">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/clients")}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isEditMode ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditMode ? "Confirmer la modification" : "Confirmer la création"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode 
                ? `Êtes-vous sûr de vouloir modifier le client avec l'email ${formData?.email} ?`
                : `Êtes-vous sûr de vouloir créer un nouveau client avec l'email ${formData?.email} ?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (formData) {
                  onSubmit(formData);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <span>Chargement...</span>
              ) : (
                <span>Confirmer</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 