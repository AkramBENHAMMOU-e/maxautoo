// Suppression de 'use client' pour permettre l'utilisation côté serveur

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult | null> {
  try {
    if (!file) {
      console.error('Erreur: Aucun fichier fourni pour l\'upload vers Cloudinary');
      return null;
    }
    
    console.log('Tentative d\'upload vers Cloudinary:', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type 
    });

    // Configuration Cloudinary avec un preset non authentifié
    const cloudName = 'dz7wjdmgy';
    const uploadPreset = 'car_rental_app';
    
    console.log('Configuration Cloudinary:', { cloudName, uploadPreset });
    
    // Conversion du fichier en ArrayBuffer/Blob si nécessaire
    let fileToUpload: File | Blob = file;
    
    // Création du FormData
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', uploadPreset);
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    console.log('URL d\'upload Cloudinary:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    console.log('Réponse Cloudinary (brute):', responseText);

    if (!response.ok) {
      throw new Error(`Erreur d'upload: ${response.status} ${response.statusText} - ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Données parsées:', data);
      
      if (!data.secure_url) {
        console.error('Erreur: URL sécurisée manquante dans la réponse de Cloudinary');
        throw new Error('La réponse de Cloudinary ne contient pas d\'URL d\'image');
      }
      
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
      };
    } catch (parseError) {
      console.error('Erreur de parsing de la réponse JSON:', parseError);
      throw new Error(`Erreur de parsing de la réponse: ${responseText}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload vers Cloudinary:', error);
    return null;
  }
} 