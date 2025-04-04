import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Début de la requête d'upload proxy Cloudinary");
    
    // Récupérer le fichier envoyé dans la requête
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      console.error("Aucun fichier n'a été fourni");
      return NextResponse.json(
        { error: "Aucun fichier n'a été fourni" },
        { status: 400 }
      );
    }
    
    console.log("Fichier reçu par le proxy:", {
      nom: file.name,
      taille: file.size,
      type: file.type
    });
    
    // Cloudinary settings (hardcoded pour assurer la cohérence)
    const cloudName = "dnha4cj0w";
    const uploadPreset = "car_rental_app";
    
    // Préparer le nouveau FormData pour Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);
    
    // Faire la requête vers Cloudinary via le serveur
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    console.log("URL d'upload Cloudinary:", cloudinaryUrl);
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData,
    });
    
    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error("Erreur réponse Cloudinary:", errorText);
      return NextResponse.json(
        { error: `Échec de l'upload vers Cloudinary: ${cloudinaryResponse.status}` },
        { status: 500 }
      );
    }
    
    const result = await cloudinaryResponse.json();
    console.log("Réponse Cloudinary (success):", {
      secure_url: result.secure_url,
      public_id: result.public_id
    });
    
    if (!result.secure_url) {
      console.error("URL sécurisée manquante dans la réponse Cloudinary");
      return NextResponse.json(
        { error: "Échec de l'upload vers Cloudinary: URL manquante" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Erreur lors de l'upload vers Cloudinary:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'upload" },
      { status: 500 }
    );
  }
} 