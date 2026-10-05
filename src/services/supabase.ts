import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  'https://jxiobglxrlodfngwrpjc.supabase.co';

const SUPABASE_ANON_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aW9iZ2x4cmxvZGZuZ3dycGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMjA3NzQsImV4cCI6MjEwNjc5Njc3NH0.cqpfyqjqvoMzULnB5_Ecp1n5YBJKmzEpSNDRbO2qEy4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a base64 or blob photo to Supabase storage bucket `reading-photos`.
 * If it's already a public URL or SVG, returns the original URL.
 */
export async function uploadReadingPhoto(photoDataUrl: string, prefix: string = 'verse'): Promise<string> {
  if (!photoDataUrl || !photoDataUrl.startsWith('data:image/')) {
    return photoDataUrl;
  }

  try {
    // Convert Data URL to Blob
    const res = await fetch(photoDataUrl);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('reading-photos')
      .upload(fileName, blob, {
        contentType: blob.type,
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload error, falling back to data URL:', error.message);
      return photoDataUrl;
    }

    const { data: publicData } = supabase.storage
      .from('reading-photos')
      .getPublicUrl(data.path);

    return publicData.publicUrl || photoDataUrl;
  } catch (err) {
    console.warn('Failed to upload to Supabase storage, using local data URL:', err);
    return photoDataUrl;
  }
}
