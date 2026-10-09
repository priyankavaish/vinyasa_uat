import { defaults } from "./defaults/app__site__events__slug__page";
export const eventEditorialKey = "app/(site)/events/[slug]/page";
export function eventDetailScope(slug: string): { key: string; child?: string } | null {
  if (slug === "artist-in-residence") return {key:"ARTIST_IN_RESIDENCE"};
  if (slug === "artist-unite") return {key:"ARTIST_UNITE"};
  if (Object.hasOwn(defaults.SEASONAL_EVENTS, slug)) return {key:"SEASONAL_EVENTS",child:slug};
  if (slug === "the-pause-within") return {key:"PAUSE_WITHIN_CONTENT"};
  if (Object.hasOwn(defaults.EDITORIAL_EVENTS,slug)) return {key:"EDITORIAL_EVENTS",child:slug};
  return null;
}
export function eventDetailValue(content: typeof defaults, slug: string): unknown {
  const scope = eventDetailScope(slug); if (!scope) return null;
  const group = (content as Record<string, unknown>)[scope.key];
  return scope.child ? (group as Record<string, unknown>)[scope.child] : group;
}
