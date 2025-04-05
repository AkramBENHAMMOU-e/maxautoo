import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Récupération des données du formulaire
    const data = await req.json();
    const { name, email, phone, subject, message } = data;

    // Validation des données requises
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Veuillez fournir une adresse email valide" },
        { status: 400 }
      );
    }

    // Sauvegarde du message dans la base de données
    const contactMessage = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: "UNREAD"
      }
    });

    console.log("Message de contact enregistré dans la base de données:", contactMessage.id);

    // En environnement de production, vous pourriez aussi envoyer un email 
    // avec ces données
    // Exemple avec une API d'email, commenté car pas encore implémenté
    /*
    const emailResponse = await fetch('https://api.email-service.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        to: 'contact@maxiauto.ma',
        from: 'noreply@maxiauto.ma',
        subject: `Nouveau message de contact: ${subject}`,
        text: `
          Nom: ${name}
          Email: ${email}
          Téléphone: ${phone || 'Non fourni'}
          Message: ${message}
        `
      })
    });
    
    if (!emailResponse.ok) {
      throw new Error("Échec de l'envoi de l'email");
    }
    */

    // Réponse de succès
    return NextResponse.json({ 
      success: true, 
      message: "Votre message a été envoyé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors du traitement du message:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du message" },
      { status: 500 }
    );
  }
} 