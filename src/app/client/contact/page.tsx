"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Envoyer les données du formulaire à l'API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de l\'envoi du message');
      }

      // Succès
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi du message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Vous avez des questions sur nos services de location de voitures au Maroc ? Notre équipe est là pour vous accompagner dans vos déplacements à travers le Royaume. Utilisez le formulaire ci-dessous ou contactez-nous directement.
        </p>
      </div>

      {/* Map Section */}
      <div className="mb-12 overflow-hidden rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Notre Agence Principale à Casablanca</h2>
        <div className="aspect-video h-[400px] w-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.747859745796!2d-7.6185503!3d33.589758899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2836cd5afe7%3A0xf2bbf16d26e05e9a!2sAv.%20Hassan%20II%2C%20Casablanca%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1690368598932!5m2!1sfr!2sfr"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
            title="MaxiAuto Casablanca"
          ></iframe>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Merci !</h3>
                  <p className="text-gray-600 mb-6">
                    Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Envoyer un Autre Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold mb-6">Envoyez-nous un Message</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom Complet*
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse Email*
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="votre.email@exemple.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Sujet*
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        placeholder="Comment pouvons-nous vous aider ?"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message*
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formState.message}
                        onChange={handleInputChange}
                        placeholder="Veuillez fournir des détails sur votre demande..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Envoyer le Message"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <Card className="bg-blue-50 border-0">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Informations de Contact</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow mr-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Notre Adresse</h3>
                    <address className="not-italic text-gray-600 mt-1">
                      <p>27 Avenue Hassan II</p>
                      <p>Casablanca, 20000</p>
                      <p>Maroc</p>
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow mr-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Numéros de Téléphone</h3>
                    <div className="text-gray-600 mt-1">
                      <p>Service Client : +212 522 123 456</p>
                      <p>Réservations : +212 522 234 567</p>
                      <p>Support d'Urgence : +212 661 345 678</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow mr-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Adresses Email</h3>
                    <div className="text-gray-600 mt-1">
                      <p>Informations Générales : info@maxiauto.ma</p>
                      <p>Support Client : support@maxiauto.ma</p>
                      <p>Réservations : reservations@maxiauto.ma</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow mr-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Heures d'Ouverture</h3>
                    <div className="text-gray-600 mt-1">
                      <p>Lundi - Vendredi : 8h00 - 19h00</p>
                      <p>Samedi : 9h00 - 17h00</p>
                      <p>Dimanche : 10h00 - 15h00</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Other Locations */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Nos Autres Agences au Maroc</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Marrakech</h3>
              <address className="not-italic text-gray-600 mb-3">
                <p>15 Avenue Mohammed V</p>
                <p>Marrakech, 40000</p>
                <p>Tél: +212 524 123 456</p>
              </address>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Rabat</h3>
              <address className="not-italic text-gray-600 mb-3">
                <p>8 Rue des FAR</p>
                <p>Rabat, 10000</p>
                <p>Tél: +212 537 123 456</p>
              </address>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Tanger</h3>
              <address className="not-italic text-gray-600 mb-3">
                <p>42 Boulevard Mohammed VI</p>
                <p>Tanger, 90000</p>
                <p>Tél: +212 539 123 456</p>
              </address>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
