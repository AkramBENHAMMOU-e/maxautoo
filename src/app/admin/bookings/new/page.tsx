"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const formSchema = z.object({
  userId: z.string().min(1, "L'utilisateur est requis"),
  carId: z.string().min(1, "La voiture est requise"),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date({ required_error: "La date de fin est requise" }),
  totalPrice: z.coerce.number().positive("Le prix doit être supérieur à 0"),
  status: z.enum(["pending", "confirmed", "cancelled"], {
    required_error: "Le statut est requis",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewBookingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [cars, setCars] = useState<{ id: string; brand: string; model: string; price: number }[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      totalPrice: 0,
    },
  });

  // Charger les utilisateurs et les voitures au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les utilisateurs
        const usersResponse = await fetch("/api/admin/clients");
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          console.error("Réponse API clients non valide:", usersResponse.status, errorText);
          throw new Error(`Erreur lors du chargement des utilisateurs: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);

        // Charger les voitures
        const carsResponse = await fetch("/api/admin/cars");
        if (!carsResponse.ok) {
          const errorText = await carsResponse.text();
          console.error("Réponse API voitures non valide:", carsResponse.status, errorText);
          throw new Error(`Erreur lors du chargement des voitures: ${carsResponse.status}`);
        }
        const carsData = await carsResponse.json();
        console.log("Données voitures reçues:", carsData);
        
        if (!carsData.cars || !Array.isArray(carsData.cars)) {
          console.error("Format de données invalide:", carsData);
          setCars([]);
          toast.error("Format de données des voitures invalide");
          return;
        }
        
        const availableCars = carsData.cars.filter((car: any) => car.status === "available");
        console.log(`${availableCars.length} voitures disponibles sur ${carsData.cars.length} voitures`);
        setCars(availableCars);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error(error instanceof Error ? error.message : "Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, []);

  // Calculer le prix total en fonction de la voiture et des dates
  useEffect(() => {
    const values = form.getValues();
    const { carId, startDate, endDate } = values;
    
    if (carId && startDate && endDate) {
      const car = cars.find(c => c.id === carId);
      if (car) {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.price;
        form.setValue("totalPrice", totalPrice);
      }
    }
  }, [form.watch("carId"), form.watch("startDate"), form.watch("endDate"), cars, form]);

  const handleFormSubmit = (data: FormValues) => {
    setFormData(data);
    setIsConfirmOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      toast.success("Réservation créée avec succès");
      router.push("/admin/bookings");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Créer une nouvelle réservation</h1>
        <Card>
          <CardHeader>
            <CardTitle>Informations de réservation</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sélection de l'utilisateur */}
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sélection de la voiture */}
                  <FormField
                    control={form.control}
                    name="carId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Véhicule</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un véhicule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cars.map((car) => (
                              <SelectItem
                                key={car.id}
                                value={car.id}
                                className="flex items-center py-2"
                              >
                                {car.brand} {car.model} - {car.price}DH/jour
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date de début */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de début</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              locale={fr}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date de fin */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues().startDate;
                                return startDate ? date < startDate : date < new Date();
                              }}
                              locale={fr}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Prix total */}
                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix total (DH)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Statut */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
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
                    onClick={() => router.push("/admin/bookings")}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    Créer la réservation
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmer la création de la réservation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir créer cette réservation ?
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