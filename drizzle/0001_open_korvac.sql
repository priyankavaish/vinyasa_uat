CREATE TABLE "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"block" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- "pages" already exists on every environment (added outside the migration
-- history via `drizzle-kit push` before this project tracked it). Create it
-- here too so a fresh clone still gets it, but never touch it if it's
-- already there — only add the new Stage 3 columns.
CREATE TABLE IF NOT EXISTS "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"layout" text DEFAULT 'boxed' NOT NULL,
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	"publish_at" timestamp with time zone,
	"unpublish_at" timestamp with time zone,
	"theme_tokens" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "publish_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "unpublish_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "theme_tokens" jsonb DEFAULT '{}'::jsonb NOT NULL;
