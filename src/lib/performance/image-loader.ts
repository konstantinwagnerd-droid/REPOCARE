/**
 * Custom Next.js Image Loader.
 * Use by configuring images.loader = "custom" in next.config and importing
 * this as loader on <Image> components.
 */
export interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function careAiImageLoader({ src, width, quality }: LoaderProps): string {
  const q = Math.min(Math.max(quality ?? 80, 50), 95);
  if (/^https?:/.test(src)) return src;
  const clean = src.startsWith("/") ? src : `/${src}`;
  return `${clean}?w=${width}&q=${q}`;
}
