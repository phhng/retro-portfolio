import { callApi } from "../services/api";

export interface GalleryImage {
  id: string;
  title: string;
  mimeType: string;
  base64: string;
}

const GALLERY_PLACEHOLDER_URLS: Record<string, string> = {
  "placeholder-1": "https://picsum.photos/seed/retro-gallery-1/320/200",
  "placeholder-2": "https://picsum.photos/seed/retro-gallery-2/320/200",
  "placeholder-3": "https://picsum.photos/seed/retro-gallery-3/320/200",
};

export function getGalleryImageUri(image: GalleryImage): string {
  return image.base64
    ? `data:${image.mimeType};base64,${image.base64}`
    : GALLERY_PLACEHOLDER_URLS[image.id] ?? "";
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const response = await callApi<{ images: GalleryImage[] }>("/api/gallery");
  return response.images;
}
