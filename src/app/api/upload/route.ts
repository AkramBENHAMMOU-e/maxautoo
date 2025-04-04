import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    console.log("Début de la requête d'upload dans le système de fichiers local");
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été téléchargé" },
        { status: 400 }
      );
    }

    console.log("Fichier reçu:", {
      nom: file.name,
      taille: file.size,
      type: file.type
    });

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    try {
      // Générer un nom de fichier unique
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      
      // Chemin où l'image sera sauvegardée
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Créer le répertoire s'il n'existe pas
      try {
        await writeFile(path.join(uploadDir, ".keep"), "");
      } catch (error) {
        console.log("Le répertoire existe déjà ou ne peut pas être créé:", error);
      }
      
      const filePath = path.join(uploadDir, fileName);
      console.log("Chemin de sauvegarde:", filePath);
      
      // Écriture du fichier
      await writeFile(filePath, buffer);
      
      // URL de l'image uploadée (relative à la racine)
      const imageUrl = `/uploads/${fileName}`;
      console.log("Image sauvegardée avec succès:", imageUrl);
      
      return NextResponse.json({ 
        success: true, 
        url: imageUrl 
      });
    } catch (writeError) {
      console.error("Erreur lors de l'écriture du fichier:", writeError);
      
      // En cas d'échec, utiliser une URL par défaut
      const defaultImageUrl = "https://cdn-icons-png.flaticon.com/512/741/741407.png";
      console.log("Utilisation d'une URL d'image par défaut:", defaultImageUrl);
      
      return NextResponse.json({ 
        success: true, 
        url: defaultImageUrl,
        fallback: true
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors du téléchargement du fichier" },
      { status: 500 }
    );
  }
} 