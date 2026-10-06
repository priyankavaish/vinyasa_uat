import type { Metadata } from "next";

/** Blank fields keep the existing defaults; keyword input becomes a clean list. */
export function pageSeoMetadata(seo: Metadata, defaults: Metadata, absoluteTitle = false): Metadata {
  const result: Metadata = { ...seo };
  const title = typeof seo.title === "string" ? seo.title.trim() || defaults.title : seo.title ?? defaults.title;
  result.title = absoluteTitle && typeof title === "string" ? { absolute: title } : title;
  result.description = seo.description?.trim() || defaults.description || undefined;
  const keywords = typeof seo.keywords === "string" ? seo.keywords.split(",").map(word => word.trim()).filter(Boolean) : seo.keywords;
  result.keywords = keywords?.length ? keywords : defaults.keywords || undefined;
  const canonical = typeof seo.alternates?.canonical === "string" ? seo.alternates.canonical.trim() : seo.alternates?.canonical;
  result.alternates = { ...defaults.alternates, ...seo.alternates, canonical: canonical || defaults.alternates?.canonical };
  return result;
}
