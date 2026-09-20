/** Only image URL fields use upload controls; alt text and captions stay text. */
export function isEditorialImageField(path: string, value: string): boolean {
  if (/\.(mp4|webm|mov)(\?|$)/i.test(value)) return false;
  const field = path.split(".").pop() ?? "";
  return /\.(jpe?g|png|webp|gif|svg|avif)(\?|$)/i.test(value) || /^(image|photo|logo|poster|src)(?:_\d+)?$/i.test(field);
}

/** A background/looping video URL (e.g. the home hero) — shown with a small
 *  preview player instead of a generic text box. No upload here: these files
 *  are typically far larger than the image-upload endpoint's limit. */
export function isEditorialVideoField(path: string, value: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(value);
}

/** Fields no editor should ever need to touch day-to-day — kept out of the
 *  main form, tucked under "Advanced" instead of mixed in with real content. */
export function isEditorialAdvancedField(path: string): boolean {
  const field = path.split(".").pop() ?? "";
  return /^aria_label(?:_\d+)?$/i.test(field);
}
