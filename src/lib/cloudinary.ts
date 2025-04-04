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

    // Utiliser les variables d'environnement pour la configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnha4cj0w';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'car_rental_app';
    
    console.log('Configuration Cloudinary:', { 
      cloudName, 
      uploadPreset,
      envVarSet: {
        cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      }
    });
    
    // Conversion du fichier en ArrayBuffer/Blob si nécessaire
    const fileToUpload: File | Blob = file;
    
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
      console.error(`Erreur d'upload Cloudinary: ${response.status} ${response.statusText}`);
      console.error('Détails de la réponse:', responseText);
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

// Version client pour upload direct sans passer par l'API
export async function uploadToCloudinaryDirect(file: File): Promise<CloudinaryUploadResult | null> {
  try {
    if (!file) {
      console.error('Erreur: Aucun fichier fourni pour l\'upload direct vers Cloudinary');
      return null;
    }
    
    // Valeurs hardcodées pour l'upload direct côté client
    const cloudName = 'dnha4cj0w';
    const uploadPreset = 'car_rental_app';
    
    console.log('Upload direct vers Cloudinary avec:', { 
      cloudName, 
      uploadPreset,
      fileName: file.name, 
      fileSize: file.size 
    });
    
    // Création du FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur d'upload direct: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('La réponse ne contient pas d\'URL d\'image');
    }
    
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error('Erreur lors de l\'upload direct vers Cloudinary:', error);
    return null;
  }
} 