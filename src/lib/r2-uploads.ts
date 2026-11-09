import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Only the calls the uploads code makes, so this file does not depend on Cloudflare's type package.
export type UploadsBucket = {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer>; httpMetadata?: { contentType?: string } } | null>;
};

// Cloudflare R2 bucket bound as UPLOADS in wrangler.jsonc. Null on local dev or when the binding is missing.
export async function uploadsBucket(): Promise<UploadsBucket | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { UPLOADS?: UploadsBucket }).UPLOADS ?? null;
  } catch {
    return null;
  }
}
