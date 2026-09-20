export type EditorialOverrides = Record<string, unknown>;
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
/** Missing fields inherit defaults; explicit empty strings/arrays remain empty. */
export function mergeEditorial<T>(defaults: T, value: unknown): T {
  if (value === undefined || value === null) return defaults;
  if (Array.isArray(defaults)) return (Array.isArray(value) ? value : defaults) as T;
  if (isObject(defaults)) {
    if (!isObject(value)) return defaults;
    return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, mergeEditorial(fallback, value[key])])) as T;
  }
  return (typeof value === typeof defaults ? value : defaults) as T;
}
