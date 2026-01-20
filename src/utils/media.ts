// Mock media upload service
export interface MediaUploadResult {
  id: string;
  url: string;
  type: 'image' | 'video';
  originalName: string;
  createdAt: string;
}

export async function uploadMedia(file: File, type: 'image' | 'video'): Promise<MediaUploadResult> {
  await new Promise(r => setTimeout(r, 500));
  return {
    id: 'media_' + Math.random().toString(36).slice(2),
    url: URL.createObjectURL(file),
    type,
    originalName: file.name,
    createdAt: new Date().toISOString()
  };
}
