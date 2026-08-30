import { config } from "dotenv";

// Next.js loads .env.local automatically; the standalone db scripts (run via
// tsx) do not, so load it here first, then fall back to .env.
config({ path: ".env.local" });
config();
