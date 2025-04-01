'use client';

import { CldUploadWidget } from 'next-cloudinary';

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
}

export function CloudinaryUploadWidget({ onUpload }: CloudinaryUploadWidgetProps) {
  return (
    <CldUploadWidget
      uploadPreset="car_rental"
      options={{
        maxFiles: 1,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          }
        }
      }}
      onSuccess={(result: any) => {
        if (result.info && result.info.secure_url) {
          onUpload(result.info.secure_url);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => open()}
        >
          Télécharger une image
        </button>
      )}
    </CldUploadWidget>
  );
} 