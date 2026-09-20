# CMS / Custom Pages — roadmap & reference

**Current model (Stage 6): a custom page is edited exactly like a blog
post** — title, one rich-text body (TipTap), an optional cover image, SEO
fields, scheduling, optional per-page colour overrides, version history.
`src/components/admin/page-builder.tsx` is the editor; `src/app/(site)/
[slug]/page.tsx` (and `app/(site)/page.tsx` for the home page) render it.

Stages 1–4 below describe an **earlier, block-based** editor (Gutenberg-style:
Hero / Columns / Card-grid / Button / Spacer / Form blocks, drag-drop,
reusable sections) that **was fully removed in Stage 6** — kept here only as
history, since the tables/columns those stages added (`page_sections`,
`layout`, the old `blocks` jsonb usage) are now dead weight in the schema.
Do not build against Stages 1–4 as if that system still exists.

Hand this file back with a change request and point at the relevant stage.

---

## Status

| Stage | Scope | State |
|------|-------|-------|
| ~~1~~ | ~~Block model, `/[slug]` renderer, 4 blocks, admin builder~~ | Superseded by Stage 6 |
| ~~2~~ | ~~WYSIWYG text, Hero / Columns / Button / Spacer blocks, drag-drop, live preview, image upload~~ | Superseded by Stage 6 |
| ~~3~~ | ~~Reusable sections, per-page theme tokens, scheduling~~ | Theme tokens + scheduling carried into Stage 6; reusable sections removed |
| ~~4~~ | ~~Revisions & rollback, form block + submissions, media library~~ | Revisions carried into Stage 6; form block removed; media library kept |
| **5** | Convert Home / About / Work From Farm / Useful Links from hardcoded React pages into block-based `pages` rows | Superseded — those rows were converted again to plain rich-text in Stage 6 |
| **6** | Replace the whole block editor with a single title + rich-text-body editor, matching the blog editor | **Shipped** — see below |

---

## Stage 6 — one rich-text body, not blocks

**User call, made explicitly after seeing the block editor in use**: too many
moving pieces (block types, per-block colour/spacing/width settings, card and
column sub-forms) for what should be as simple as writing a blog post. This
replaced the entire Stage 1–4 block system with the same editor shape the
blog already used.

### What a page is now

- `pages` table: `title, slug, status, coverUrl, bodyHtml, seoTitle,
  seoDescription, publishAt, unpublishAt, themeTokens` (+ timestamps).
  `layout` and `blocks` columns are **still in the schema** (removing a
  column is a real migration; leaving two unused columns isn't worth that
  risk) but nothing reads or writes them for new pages.
- Editing: `src/components/admin/page-builder.tsx` — a plain form
  (no client-side block state) using the same pieces the blog editor uses:
  `ImageField` (cover image), `RichEditorField` → TipTap (`rich-editor.tsx`)
  for the body. Advanced stuff (SEO, scheduling, per-page colours, version
  history) lives under a collapsed `<details>` / `<PageHistoryPanel>`, kept
  from Stage 3/4 since they're genuinely useful and don't add clutter when
  collapsed.
- Saving: `savePage` in `src/lib/admin/actions.ts` sanitises `bodyHtml` with
  the **same allow-list `cleanHtml` the blog uses** (`p, br, strong, em, u,
  s, h2-h4, ul, ol, li, blockquote, a, img, span, hr, figure, figcaption` —
  no `<script>`, no `<video>`/`<iframe>`, no forms).
- Rendering: `src/app/(site)/[slug]/page.tsx` and `app/(site)/page.tsx`
  (home) — cover image, `<h1>{title}</h1>`, then `<RichContent
  html={bodyHtml}>`. No block-type branching, no layout width variants.

### What this cost, on top of Stage 5's losses

Stage 5 already traded away Home's interactive carousels, About's flip-book,
and all scroll/parallax animation for editability (see below). Stage 6 goes
one step further: **the video hero is also gone**, because a plain rich-text
body has no `<video>` field — the hero `block` type that carried it in
Stage 1–4 no longer exists. Home's top section is now a cover image (or
nothing) + heading + body text, same shape as every other page.

### Removed entirely

- `src/lib/blocks.ts`, `src/components/blocks/block-renderer.tsx`,
  `src/components/blocks/form-block.tsx`, `src/app/api/forms/submit/route.ts`
  — deleted (not just unused; the user asked for the block system itself
  gone). `@dnd-kit/*` uninstalled (only the block builder's drag-reorder used
  it).
- "Reusable sections" (`saveSection`/`deleteSection`, the "Save as section" /
  "Insert reusable section" UI) — a block-model-specific idea, doesn't
  translate to single-body pages. The `page_sections` table is still in the
  schema (unused, harmless) for the same don't-drop-a-column-lightly reason
  as `layout`/`blocks`.
- The `form` block and its submissions endpoint. `form_submissions` table
  and **Admin → Form submissions** page are still there (harmless, shows
  whatever was captured before this change) but nothing writes to it anymore.

### Migrating existing content

`src/lib/db/seed-static-pages.ts` (idempotent, upsert-by-slug — safe to
re-run) now writes hand-authored `bodyHtml` for Home / About / Work From
Farm / Useful Links directly, rather than a block array. Run it against any
environment that doesn't have current rows yet:
```
npm run db:seed-static-pages
```
If you had already run the Stage 5 version of this script (block arrays),
re-running the Stage 6 version overwrites those rows with the new
`bodyHtml` — that's expected, not a bug.

---

## Stage 5 — Home / About / Work From Farm / Useful Links are now `pages` rows

**This was a deliberate, user-requested trade: real content editability for
those pages' bespoke design and interactivity.** Explicitly confirmed twice
before doing it (see conversation history) — the following was accepted as a
known loss, not an oversight:

- Home's autoplay video **hero is preserved** (the `hero` block supports a
  video background), but the interactive cottages carousel, testimonials
  carousel, upcoming-events carousel, photo-masonry carousel and all
  scroll/parallax animations are gone — replaced with static `card-grid` /
  `columns` blocks.
- About's 3D page-turning family flip-book (`family-bookshelf.tsx`) is gone —
  replaced with a plain `card-grid` of the same six people.
- The old React section components (`hero.tsx`'s `HomeHero`,
  `cottages-interactive.tsx`, `connect-section.tsx`, `community-section.tsx`,
  `work-from-farm-section.tsx`, `upcoming-events-interactive.tsx`,
  `testimonials-section.tsx`, `photo-masonry.tsx`, `gallery-section.tsx`,
  `family-bookshelf.tsx`, and the old `app/(site)/about|work-from-farm|
  useful-links/page.tsx` route files) were **not deleted** — only stopped
  being imported/rendered. They're dead code, kept as a reference for
  reconstructing any of this by hand later. `src/lib/editorial/defaults/
  app__site__{page,about_page,work_from_farm_page,useful_links_page}.ts` and
  their `catalog.ts` entries are similarly orphaned but harmless.

**What stayed as real code, on purpose** (functionality, not just design,
would have broken): **Book** (Razorpay payment flow), **Contact** and
**Corporate/Volunteer** (both submit to the `leads` table via `LeadForm`,
shown at Admin → Contact queries), **Stays** and **Events** listings (live,
admin-managed cottages/events tables), **Blogs** index (the DB-backed blog
list added earlier). None of these are `pages` rows and none should become
one without first replacing their form/listing with an equivalent block type.

### How the conversion works

- `src/app/(site)/page.tsx` (the root, `/`) now fetches `getPublishedPage("home")`
  and renders `<BlockRenderer>` — same pattern as `/[slug]`, just with a
  hardcoded slug since `/[slug]` can't match an empty segment.
- `src/app/(site)/[slug]/page.tsx` treats `"home"` as a reserved slug (404s
  it) so the page isn't reachable at both `/` and `/home`.
- Both routes skip the generic `<h1>{page.title}</h1>` wrapper when the
  page's first block is `hero` (the hero block renders its own `<h1>`) —
  otherwise a page starting with a hero would show two headings.
- `src/lib/db/seed-static-pages.ts` is the (idempotent, upsert-by-slug)
  migration that wrote the four `pages` rows. **Run it once against any
  environment that doesn't have these rows yet** (a fresh clone, or
  production before its first deploy after this change):
  ```
  npx tsx src/lib/db/seed-static-pages.ts
  ```
  It's safe to re-run — it upserts by slug, it won't duplicate rows.
- The Home page's `slug` field is locked (read-only) in the page builder
  (`src/components/admin/page-builder.tsx`) since the root route hardcodes
  `"home"` — renaming it there would 404 the whole site.
- `src/lib/editorial/pages.ts` (`managedPages`) no longer lists Home / About /
  Work From Farm / Useful Links — they're edited via **Manage Pages → (their
  row) → Edit**, the same block builder as any custom page, not the old
  field-by-field editorial screen.

---

## Stage 1 — what exists now

### Data
- **`pages` table** (`src/lib/db/schema.ts`): `id, slug, title, status(draft|published),
  layout(boxed|full|narrow), blocks(jsonb), seoTitle, seoDescription, timestamps`.
- Migration: after schema changes run
  `npm run db:generate` then `npm run db:setup:local` (pglite) / `npm run db:migrate` (Neon).

### Rendering
- `src/lib/blocks.ts` — pure block **types + helpers** (`Block`, `emptyBlock`,
  `coerceBlocks`, class maps). Imported by both admin editor and renderer, no server deps.
- `src/components/blocks/block-renderer.tsx` — server component. Renders each block in a
  `<section>` with inline `background`/`color`, padding + width classes. Re-sanitises HTML.
- `src/app/(site)/[slug]/page.tsx` — catch-all. `getPublishedPage(slug)` → `notFound()` if
  missing/draft. `generateStaticParams` + `revalidate = 300` + SEO metadata.
  Static routes (`/about`, `/stays`, …) always win over this.
- `src/lib/cms.ts` — `getBuilderPages()` (all, for admin), `getPublishedPage(slug)`.
  Both `unstable_cache` tagged `"pages"`.

### Admin
- `src/app/admin/pages/page.tsx` — list + "New page" + "Edit site copy" link.
- `src/app/admin/pages/new/page.tsx`, `.../[id]/page.tsx` — render `<PageBuilder>`.
- `src/app/admin/pages/copy/page.tsx` — the old fixed site-copy editor (moved here).
- `src/components/admin/page-builder.tsx` — client editor: page fields, add / reorder (↑↓) /
  remove blocks, per-block settings (bg + text colour pickers, padding, align, width),
  per-type fields, card repeater with per-card colour.
- `src/lib/admin/actions.ts` — `savePage(FormData)` (blocks come as a JSON string in a hidden
  input; `coerceBlocks` + `stripDangerous` on save), `deletePage(id)`. Revalidates tag
  `"pages"` and `/` layout.

### Blocks
| type | fields | notes |
|------|--------|-------|
| `rich-text` | `html` | **TipTap WYSIWYG** (Stage 2); sanitised to safe tags on save |
| `image` | `src, alt, href?, caption?` | upload via `ImageField` (Stage 2) or paste a URL |
| `card-grid` | `heading?, cols(2\|3\|4), cards[]` | card: `image?,title?,text?,href?,bg?,color?`; image via `ImageField` |
| `html` | `html` | embeds allowed (iframe host-allowlist), **never `<script>`** |
| `hero` | `media, mediaType(image\|video), heading?, subcopy?, buttons[]≤2, overlay(none\|light\|dark), contain(cover\|contain)` | Stage 2. Full-bleed background + heading/subcopy/CTAs |
| `columns` | `cols(2\|3), columns[]` | Stage 2. Each column holds a mini list of `text\|image\|button` items |
| `button` | `label, href, variant(accent\|outline\|link)` | Stage 2. Standalone CTA |
| `spacer` | `height(sm\|md\|lg), divider` | Stage 2. Vertical gap, optional divider line |

Every block also has: `bg?`, `color?`, `padY(none\|sm\|md\|lg)`, `align(left\|center)`,
`width(inherit\|full\|boxed\|narrow)`.

### Security model
- **No `<script>` ever.** `stripDangerous()` on save + `sanitize-html` on render (defence in depth).
- `html` block iframes: only hosts in `allowedIframeHostnames` in `block-renderer.tsx`
  (YouTube, Vimeo, Google Maps, OpenStreetMap, Spotify). Add hosts there.
- `rich-text` uses the stricter `RichContent` allow-list.

---

## How to add a new block type (checklist)

1. `src/lib/blocks.ts`
   - add to `BlockType` union + `BLOCK_LABELS`
   - add the block's `type` + fields to the `Block` union
   - `emptyBlock()` — default shape
   - `coerceBlocks()` — parse/validate its fields from untrusted JSON
2. `src/components/blocks/block-renderer.tsx` — a branch in `BlockView` that renders it
   (respect `sectionStyle`, `widthClass`, `align`).
3. `src/components/admin/page-builder.tsx` — a fields group under the block card for its type.
4. `src/lib/admin/actions.ts` — if it holds HTML, run it through `stripDangerous` in `savePage`.
5. No DB change needed (blocks are one jsonb column).

---

## Stage 2 — shipped

- **WYSIWYG for `rich-text`**: the textarea is replaced by the existing TipTap editor
  (`src/components/admin/rich-editor.tsx`), one instance per block, mirrored to state.
- **New blocks**: `hero`, `columns`, `button`, `spacer` — see the block table above.
  `columns` items are intentionally simple (`text | image | button`), not full recursive
  blocks, to keep the JSON shape and editor UI bounded.
- **Editor UX** (`src/components/admin/page-builder.tsx`):
  - drag-and-drop reorder via `@dnd-kit/core` + `@dnd-kit/sortable`
  - collapse/expand per block (local UI state only, not persisted)
  - duplicate block (deep-clones with a fresh id, inserts after the original)
  - live preview pane — renders `<BlockRenderer>` from the in-memory `blocks` state
    (toggle button; hidden below `lg` breakpoint since there's no room)
  - unsaved-changes guard — `beforeunload` listener while any field/block is dirty,
    cleared on submit
- **Images**: `ImageField` (`src/components/admin/image-field.tsx`) now supports a
  **controlled mode** (`value`/`onChange` instead of `name`/`defaultValue`) so it can
  live inside the block-builder's React state instead of a plain form field. Used for
  the `image` block, hero media, card images, and column images.
- Not done in Stage 2 (deferred, low value without Stage 3's per-page theming):
  named layout presets beyond the existing width/padding controls.

## Stage 3 — shipped

- **Nav / menu manager**: turned out to already exist. `site-header.tsx`'s `NAV_LINKS` and
  `site-footer.tsx`'s `exploreLinks` are both driven by the generic **editorial** content
  system (`src/lib/editorial/*`), which already renders array fields with add/remove/edit
  controls (see `src/components/admin/editorial-editor.tsx`). Edit them from Manage Pages →
  "Shared / layout / site header" and "… / site footer". No new `nav_items` table needed —
  adding one would have duplicated this.
- **Reusable sections**: new `page_sections` table (`id, name, block, timestamps`). In the
  block builder, "Save as section" on any block stores a cleaned copy; "Insert reusable
  section" in the add-block bar clones it (fresh id) into the current page. **Not a live
  link** — inserting copies the JSON once, matching how `columns` items work (see Stage 2).
  Editing the saved section later does not retroactively change pages that already used it;
  that would need a `sectionId` reference + a join at render time, deferred as Stage 4+ scope.
  Actions: `saveSection` / `deleteSection` in `src/lib/admin/actions.ts`.
- **Per-page theme**: `pages.themeTokens` (jsonb) stores overrides for a fixed allow-list —
  `--accent`, `--accent-ink`, `--clay-ink`, `--footer-background` (`ALLOWED_THEME_TOKENS` in
  `actions.ts`). Rendered as an inline `style` on the `<main>` wrapper in
  `src/app/(site)/[slug]/page.tsx`. Editable via a collapsible "Page theme" panel in the
  builder.
- **Scheduling**: `pages.publishAt` / `pages.unpublishAt` (nullable timestamptz).
  `getPublishedPage()` in `src/lib/cms.ts` treats a `published` row as live only if
  `now` falls inside its window; `status` itself is unchanged (no cron flips it) — the
  window is checked on every read, same pattern as the existing `revalidate = 300` ISR.
- Also fixed while here: the Status `<select>` in the page-builder form had no
  `defaultValue` tied to the loaded page, so re-saving an already-published page silently
  reset it to Draft. Now defaults from `page.status`.

## Stage 4 — shipped (roles deferred)

- **Revisions**: `page_revisions` table (`pageId, snapshot, createdAt`). `savePage()` in
  `src/lib/admin/actions.ts` snapshots a page's editable columns right before every update
  (not on first insert — nothing to roll back to yet), capped at the latest 20 per page.
  "History" panel in the page builder lists them with a "Restore this version" button →
  `restorePageRevision(pageId, revisionId)`, which itself snapshots the current state first
  (so a restore is undoable too) then writes the old values back onto the live row. No diff
  view — just full-snapshot restore, which is enough for "undo my last few edits."
- **Form block**: new `form` block type (`src/lib/blocks.ts`) — a heading, a list of
  fields (`text | email | phone | textarea`, each with a required flag), a submit label and
  success message. Rendered by `src/components/blocks/form-block.tsx` (client component —
  it's the one block that needs interactivity) and posts to `POST /api/forms/submit`.
  That route re-validates against the block's *current* field list (so an admin who removes
  a field can't be fed old field ids), has a hidden honeypot field, and rate-limits by
  hashed IP (5 submissions / 60s) the same way `/api/track` hashes IPs. Submissions land in
  `form_submissions` (`pageSlug, blockId, data` jsonb, `ipHash`) and show up at
  **Admin → Form submissions**, styled like the existing Bookings/Leads tables.
- **Media library**: **Admin → Media library**, backed by `@vercel/blob`'s `list()`/`del()`
  (`listMedia` / `deleteMedia` in `actions.ts`). Only lists Blob-hosted uploads — local-disk
  dev uploads (no `BLOB_READ_WRITE_TOKEN`) aren't listed, since there's no directory-listing
  API for those and local dev media is disposable. Grid view, copy-URL, delete.
- **Roles — deferred.** Today's login is a single admin identity from
  `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars (see `src/lib/auth.ts`), not the DB-backed
  multi-user model an editor/admin split needs. Building that is a separate, security-
  sensitive project (new login flow, per-action permission checks across every admin
  action) rather than an incremental add — deliberately out of scope here pending a
  decision on whether multiple admin accounts are actually needed.

---

## Stage 7 — block builder restored + starter templates

**A "Stage 6" pass briefly replaced this whole block system with a single
title+rich-text-body editor (blog-post style). That was reverted** — the
block builder (Stages 1–4) is back, unchanged, and is once again the current
system. Treat any earlier mention of "Stage 6" / "the block system was
removed" in this file as history, not current state.

Added on top: **"New page" now opens a template picker** first
(`src/components/admin/new-page-flow.tsx`) instead of a blank block list —
Blank, Landing page, Story/About-style page, or Simple text page
(`src/lib/page-templates.ts`). Picking one pre-fills the block list with
starter content in already-existing block types (hero/columns/card-grid/
rich-text/button); it automatically matches the site's look because that
styling lives in `block-renderer.tsx`'s classes, not in the template data.
Adding a fifth template means adding one more entry to `PAGE_TEMPLATES` — no
new block type required.

**Known follow-up**: Home / About / Work From Farm / Useful Links currently
have **empty `blocks`** in the database — a side effect of the Stage 6/7
back-and-forth (Stage 6 rewrote those rows to use `bodyHtml` instead;
reverting to blocks didn't restore their content). Re-run
`npm run db:seed-static-pages` (stop any running dev server first — the
local pglite database is single-process) to put their block content back.

---

## Conventions

- Block JSON is the single source of truth — never add per-block DB columns.
- Keep `src/lib/blocks.ts` free of server-only imports (it's shared with client).
- All admin writes go through `src/lib/admin/actions.ts`, guarded by `assertAdmin()`.
- After a `pages` write, revalidate tag `"pages"` and `revalidatePath("/", "layout")`.
- Colours are stored as raw CSS strings (hex from the picker, or `""` = inherit).
