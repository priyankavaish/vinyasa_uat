import { managedPages } from "@/lib/editorial/pages";
export const ROUTING_KEY = "page-routing";
export const routablePages = managedPages.filter(p => p.path.startsWith("/") && !p.path.includes("["));
export type PageSettings = { title: string; path: string; menuLabel: string; menuHref: string; aliases: string[] };
export type PageSettingsMap = Record<string, PageSettings>;
export const reservedPaths = ["/admin", "/api", "/_next", "/media", "/corporate", "/icon", "/icon.png", "/apple-icon", "/apple-icon.png", "/opengraph-image", "/robots", "/sitemap", "/manifest", "/favicon"];
export function normalisePagePath(input: string): string {
  const path = "/" + input.trim().replace(/^\/+|\/+$/g, "");
  if (path !== "/" && !/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) throw new Error("Use a simple URL such as /our-story: lowercase letters, numbers and hyphens.");
  if (reservedPaths.includes(path)) throw new Error("This URL is reserved for the website system.");
  return path;
}
export function validateNavigationHref(input: string): string {
  const href = input.trim();
  if (!href) return "";
  if (/^\/(?!\/)[^\s\\]*$/.test(href) || /^#[^\s]+$/.test(href)) return href;
  try { const url = new URL(href); if (["https:", "http:", "mailto:", "tel:"].includes(url.protocol)) return href; } catch {}
  throw new Error("Navigation link must be a website path, #section, or a valid http, https, email or phone URL.");
}
export function settingsFor(id: string, map: PageSettingsMap): PageSettings {
  const page = routablePages.find(p => p.id === id);
  if (!page) throw new Error("This page does not have an editable website URL.");
  return map[id] ?? { title: page.title, path: page.path, menuLabel: "", menuHref: "", aliases: [] };
}
export function readSettingsMap(value: unknown): PageSettingsMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: PageSettingsMap = {};
  for (const page of routablePages) {
    const entry = (value as Record<string, unknown>)[page.id] as Partial<PageSettings> | undefined;
    if (!entry || typeof entry.path !== "string") continue;
    try {
      result[page.id] = {
        title: typeof entry.title === "string" && entry.title.trim() ? entry.title : page.title,
        path: normalisePagePath(entry.path),
        menuLabel: typeof entry.menuLabel === "string" ? entry.menuLabel : "",
        menuHref: validateNavigationHref(typeof entry.menuHref === "string" ? entry.menuHref : ""),
        aliases: Array.isArray(entry.aliases) ? entry.aliases.filter((p): p is string => typeof p === "string").map(normalisePagePath).filter(p => p !== entry.path) : [],
      };
    } catch { /* Invalid records must not interfere with the existing routes. */ }
  }
  return result;
}
export function pageForPath(path: string, map: PageSettingsMap) {
  return routablePages.find(p => p.path === path || settingsFor(p.id, map).path === path || settingsFor(p.id, map).aliases.includes(path));
}
export function routingDecision(path: string, map: PageSettingsMap): { kind: "redirect" | "rewrite"; path: string } | null {
  const page = pageForPath(path, map);
  if (!page) return null;
  const settings = settingsFor(page.id, map);
  if (path !== settings.path) return { kind: "redirect", path: settings.path };
  if (path !== page.path) return { kind: "rewrite", path: page.path };
  return null;
}
export function resolvePageHref(href: string, map: PageSettingsMap): string {
  const match = href.match(/^(\/[^?#]*)([?#].*)?$/);
  if (!match) return href;
  const page = pageForPath(match[1], map);
  return page ? settingsFor(page.id, map).path + (match[2] ?? "") : href;
}
export function assertPathAvailable(path: string, id: string, map: PageSettingsMap, customPaths: string[] = []) {
  for (const page of routablePages) {
    if (page.id === id) continue;
    const settings = settingsFor(page.id, map);
    if ([page.path, settings.path, ...settings.aliases].includes(path)) throw new Error("This URL belongs to another page. Choose a different URL.");
  }
  if (customPaths.includes(path)) throw new Error("A custom page already uses this URL.");
}
export function nextPageSettings(id: string, input: { title: string; path: string; menuLabel: string; menuHref: string }, map: PageSettingsMap, customPaths: string[] = []): PageSettings {
  const previous = settingsFor(id, map);
  const title = input.title.trim();
  if (!title || title.length > 160) throw new Error("Enter a page name (maximum 160 characters).");
  const path = normalisePagePath(input.path);
  assertPathAvailable(path, id, map, customPaths);
  if (input.menuLabel.trim().length > 120) throw new Error("Navigation label must be at most 120 characters.");
  const aliases = [...new Set([...previous.aliases, ...(previous.path !== path ? [previous.path] : [])])].filter(p => p !== path);
  return { title, path, menuLabel: input.menuLabel.trim(), menuHref: validateNavigationHref(input.menuHref), aliases };
}
/** Update existing links and explicit menu labels without altering layout or content. */
export function applyPageLinks<T>(value: T, map: PageSettingsMap, navigation = false): T {
  function transform(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(transform);
    if (!node || typeof node !== "object") return node;
    const old = node as Record<string, unknown>;
    const result = Object.fromEntries(Object.entries(old).map(([key, child]) => [
      key, typeof child === "string" && (/^href(?:_\d+)?$/.test(key) || key === "canonical") ? resolvePageHref(child, map) : transform(child),
    ]));
    if (navigation && typeof old.href === "string") {
      const page = pageForPath(old.href.split(/[?#]/)[0], map);
      if (page) {
        const settings = settingsFor(page.id, map);
        if (settings.menuLabel && typeof old.label === "string") result.label = settings.menuLabel;
        if (settings.menuHref) result.href = resolvePageHref(settings.menuHref, map);
      }
    }
    if (navigation) for (const [hrefKey, labelKey] of [["href_11", "text_12"], ["href_20", "text_21"]]) {
      if (typeof old[hrefKey] !== "string") continue;
      const page = pageForPath((old[hrefKey] as string).split(/[?#]/)[0], map);
      if (!page) continue;
      const settings = settingsFor(page.id, map);
      if (settings.menuLabel) result[labelKey] = settings.menuLabel;
      if (settings.menuHref) result[hrefKey] = resolvePageHref(settings.menuHref, map);
    }
    return result;
  }
  return transform(value) as T;
}
