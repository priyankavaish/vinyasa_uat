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

// PGlite is a single-process embedded database: two processes opening the
// same directory at once (e.g. a leftover `npm run db:seed` next to a running
// `next dev`) corrupt it beyond repair. A PID lockfile turns that silent
// corruption into a clear error instead.
export function claimPgliteLock(dir: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  const lockFile = path.join(dir, ".vinyasa-lock");

  const isRunning = (pid: number) => {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  };

  if (fs.existsSync(lockFile)) {
    const heldBy = Number(fs.readFileSync(lockFile, "utf8").trim());
    if (heldBy && heldBy !== process.pid && isRunning(heldBy)) {
      throw new Error(
        `Local database at "${dir}" is already open in another process (PID ${heldBy}). ` +
          `Stop it before starting a new one — running two at once corrupts the database.`
      );
    }
  }

  fs.writeFileSync(lockFile, String(process.pid));
  const release = () => {
    try {
      if (fs.readFileSync(lockFile, "utf8").trim() === String(process.pid)) fs.unlinkSync(lockFile);
    } catch {
      // best-effort cleanup
    }
  };
  process.once("exit", release);
  process.once("SIGINT", () => { release(); process.exit(0); });
  process.once("SIGTERM", () => { release(); process.exit(0); });
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
      claimPgliteLock(dir);
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
