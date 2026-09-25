import "./load-env";
import { mkdirSync } from "fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { localDbDir, isLocalDb, claimPgliteLock } from "./index";

// Applies the SQL migrations in ./drizzle to the local PGlite database.
// Run once (npm run db:setup:local) before db:seed on a dev machine.
async function main() {
  if (!isLocalDb()) {
    console.error(
      "DATABASE_URL is not a local pglite target. Set DATABASE_URL=pglite in .env.local, or use `npm run db:migrate` for a hosted database."
    );
    process.exit(1);
  }
  const dir = localDbDir();
  mkdirSync(dir, { recursive: true });
  claimPgliteLock(dir);
  const db = drizzle(new PGlite(dir), {});
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log(`✓ local database ready at ${dir}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
