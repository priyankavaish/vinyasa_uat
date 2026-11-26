import "server-only";

const UAT_HOST = "vinyasa-uat.vercel.app";
export const ARTIST_ESCAPE_UAT_ORIGIN = "https://" + UAT_HOST;

export function isHostedArtistEscapeUat() {
  return process.env.VERCEL_ENV === "production" && (
    process.env.VERCEL_PROJECT_PRODUCTION_URL === UAT_HOST ||
    process.env.SITE_ORIGIN === ARTIST_ESCAPE_UAT_ORIGIN ||
    (process.env.VERCEL_GIT_REPO_OWNER === "priyankavaish" && process.env.VERCEL_GIT_REPO_SLUG === "vinyasa_uat")
  );
}
