import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été téléchargé" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // Chemin où l'image sera sauvegardée
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);
    
    // Écriture du fichier
    await writeFile(filePath, buffer);
    
    // URL de l'image uploadée (relative à la racine)
    const imageUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl 
    });
    
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors du téléchargement du fichier" },
      { status: 500 }
    );
  }
} 