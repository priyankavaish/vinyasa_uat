// Browser-only. Vercel serverless functions reject request bodies over ~4.5 MB
// (FUNCTION_PAYLOAD_TOO_LARGE), so downscale and re-encode large photos before
// they are uploaded. Small files and animated GIFs pass through untouched.

const MAX_DIMENSION = 3200;
const TARGET_BYTES = 3.5 * 1024 * 1024;
const PASSTHROUGH_BYTES = 3.5 * 1024 * 1024;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = url;
  });
}

export async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= PASSTHROUGH_BYTES) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    let quality = 0.95;
    let blob = await toBlob(canvas, quality);
    while (blob && blob.size > TARGET_BYTES && quality > 0.75) {
      quality -= 0.05;
      blob = await toBlob(canvas, quality);
    }
    // Keep detailed photos within the upload limit without dropping quality heavily.
    for (let attempt = 0; blob && blob.size > TARGET_BYTES && attempt < 8; attempt++) {
      canvas.width = Math.max(1, Math.round(canvas.width * 0.85));
      canvas.height = Math.max(1, Math.round(canvas.height * 0.85));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      blob = await toBlob(canvas, quality);
    }
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}
