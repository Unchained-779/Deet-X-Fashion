/**
 * Cloudinary & Editorial Image Helper
 * Injects automatic format, quality, dimensions, and generates warm blurred placeholders
 * to eliminate grey loading skeletons and maintain luxury aesthetics.
 */

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
}

// Warm alabaster/stone luxury fallback placeholder (data URL SVG)
export const LUXURY_FALLBACK_BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='100%25' height='100%25' fill='%23F3EFEA'/%3E%3Crect width='100%25' height='100%25' fill='%239E7B4F' opacity='0.08'/%3E%3C/svg%3E";

/**
 * Transforms a raw Cloudinary URL into an optimized delivery URL.
 * Example input: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
 * Injects: f_auto,q_auto,w_{width},c_fill
 */
export function getCloudinaryUrl(
  rawUrl: string | null | undefined,
  options: CloudinaryTransformOptions = {}
): string {
  if (!rawUrl) {
    return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop";
  }

  const {
    width = 800,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  // Handle Cloudinary URLs
  if (rawUrl.includes("res.cloudinary.com") && rawUrl.includes("/upload/")) {
    const parts = rawUrl.split("/upload/");
    const transforms = [
      `f_${format}`,
      `q_${quality}`,
      `w_${width}`,
      height ? `h_${height}` : "",
      crop ? `c_${crop}` : "",
    ]
      .filter(Boolean)
      .join(",");

    return `${parts[0]}/upload/${transforms}/${parts[1]}`;
  }

  // Handle Unsplash images
  if (rawUrl.includes("images.unsplash.com")) {
    const url = new URL(rawUrl);
    url.searchParams.set("w", width.toString());
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", "80");
    return url.toString();
  }

  return rawUrl;
}

/**
 * Generates an ultra-low-resolution blurred thumbnail URL for Next.js `blurDataURL`.
 * Injects `w_50,e_blur:1000,q_auto:low` into Cloudinary URLs.
 */
export function getCloudinaryBlurPlaceholder(rawUrl: string | null | undefined): string {
  if (!rawUrl) {
    return LUXURY_FALLBACK_BLUR;
  }

  if (rawUrl.includes("res.cloudinary.com") && rawUrl.includes("/upload/")) {
    const parts = rawUrl.split("/upload/");
    const blurTransforms = "f_auto,q_auto:low,w_50,e_blur:1000,c_fill";
    return `${parts[0]}/upload/${blurTransforms}/${parts[1]}`;
  }

  if (rawUrl.includes("images.unsplash.com")) {
    const url = new URL(rawUrl);
    url.searchParams.set("w", "50");
    url.searchParams.set("blur", "100");
    url.searchParams.set("q", "20");
    return url.toString();
  }

  return LUXURY_FALLBACK_BLUR;
}
