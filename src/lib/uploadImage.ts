'use client';

import { uploadImage as cloudinaryUpload } from './cloudinary';

export async function uploadImage(file: File): Promise<string> {
  try {
    return await cloudinaryUpload(file);
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    throw new Error('Échec du téléchargement de l\'image');
  }
} 