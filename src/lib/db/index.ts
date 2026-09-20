import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Two backends, chosen by DATABASE_URL:
//   - postgres:// or postgresql://          -> Neon serverless HTTP driver (production)
//   - "pglite" / "pglite:<dir>" / "file:<dir>" -> embedded local Postgres (PGlite),
//                                                a zero-setup file-backed DB for dev
//   - unset -> no database; public site falls back to bundled seed content
const url = process.env.DATABASE_URL?.trim() || "";

// The two drivers expose the same Drizzle query builder, so every call site is
// happy with the Neon type. (PGlite's type is structurally compatible here.)
type Db = NeonHttpDatabase<typeof schema>;

// Next.js reloads server modules during development. Keep one connection per
// URL for the lifetime of this process so PGlite never opens the same files twice.
const databaseGlobal = globalThis as typeof globalThis & {
  vinyasaDatabases?: Map<string, Db>;
};
const databases = databaseGlobal.vinyasaDatabases ??= new Map<string, Db>();

function isPglite(u: string) {
  return u === "pglite" || u.startsWith("pglite:") || u.startsWith("file:");
}

function pgliteDir(u: string) {
  const rest = u.startsWith("pglite:")
    ? u.slice(7)
    : u.startsWith("file:")
      ? u.slice(5)
      : "";
  return rest || "./.pglite/data";
}

export function getDb(): Db {
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Use a Neon connection string, or `pglite` for a local database."
    );
  }
  let db = databases.get(url);
  if (!db) {
    if (isPglite(url)) {
      const dir = pgliteDir(url);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("fs").mkdirSync(dir, { recursive: true });
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PGlite } = require("@electric-sql/pglite");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { drizzle } = require("drizzle-orm/pglite");
      db = drizzle(new PGlite(dir), { schema }) as unknown as Db;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { neon } = require("@neondatabase/serverless");
      db = drizzleNeon(neon(url), { schema });
    }
  }
  databases.set(url, db);
  return db;
}

export function hasDb(): boolean {
  return Boolean(url);
}

export function isLocalDb(): boolean {
  return isPglite(url);
}

export function localDbDir(): string {
  return pgliteDir(url);
}

export { schema };
