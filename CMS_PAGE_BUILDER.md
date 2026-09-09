# CMS / Page Builder — roadmap & reference

A WordPress/Gutenberg-style block editor for building standalone pages from
the admin panel. Built in stages so each is reviewable on its own.

Hand this file back with a change request and point at the relevant stage /
"add a new block" checklist.

---

## Status

| Stage | Scope | State |
|------|-------|-------|
| **1** | Block model, `/[slug]` renderer, 4 blocks, admin builder | **Shipped** (`fd92fd0`) |
| 2 | WYSIWYG text, Hero / Columns / Button blocks, drag-drop, live preview, image upload | Planned |
| 3 | Reusable sections, nav/menu manager, per-page theme tokens, scheduling | Planned |
| 4 | Revisions & rollback, roles, form block + submissions, media library | Planned |

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

### Blocks (v1)
| type | fields | notes |
|------|--------|-------|
| `rich-text` | `html` | textarea for now; sanitised to safe tags |
| `image` | `src, alt, href?, caption?` | plain `<img loading=lazy>` (any URL) |
| `card-grid` | `heading?, cols(2\|3\|4), cards[]` | card: `image?,title?,text?,href?,bg?,color?` |
| `html` | `html` | embeds allowed (iframe host-allowlist), **never `<script>`** |

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

## Stage 2 — planned

- **WYSIWYG for `rich-text`**: swap the textarea for the existing TipTap editor
  (`src/components/admin/rich-editor.tsx`), one instance per block, mirror to state.
- **New blocks**:
  - `hero` — full-bleed image/video + heading + subcopy + up to 2 buttons + overlay controls
    (reuse `PageHero` look; expose `contain`, `imagePosition`, overlay strength).
  - `columns` — 2–3 columns, each a mini block list (text / image / button). Enables side-by-side.
  - `button` — label, href, variant (accent / outline / link), align. (Cards already link;
    this is for standalone CTAs.)
  - `spacer` / `divider`.
- **Editor UX**: drag-and-drop reorder (dnd-kit), collapse/expand blocks, duplicate block,
  a **live preview pane** (render `<BlockRenderer>` from local state), unsaved-changes guard.
- **Images**: reuse `ImageField` (upload + compress) instead of pasting a URL, in image block
  and card image.
- **Layout**: named presets beyond width (e.g. "landing", "article", "sidebar") that set
  default block padding/width and optional max-width rails.

## Stage 3 — planned

- **Reusable sections**: save a block (or group) as a named partial, insert on many pages,
  edit once. New table `page_sections`.
- **Menu / nav manager**: admin-editable header + footer links (currently hard-coded in
  `site-header.tsx` / `site-footer.tsx`). New `nav_items` table, render from DB.
- **Per-page theme**: optional overrides of the CSS tokens (`--accent`, `--clay-*`, fonts)
  scoped to one page via a `<style>` on the `[slug]` route.
- **Scheduling**: `publishAt` / `unpublishAt` on `pages`; a cron or on-read check.

## Stage 4 — planned

- **Revisions**: `page_revisions` table, snapshot on every save, diff + one-click rollback.
- **Roles**: editor vs admin (editor can't change settings / delete).
- **Form block**: configurable fields → stores submissions in a `form_submissions` table,
  shows in admin (like `leads`). Spam honeypot + rate-limit.
- **Media library**: browse/reuse everything uploaded, replace-in-place.

---

## Conventions

- Block JSON is the single source of truth — never add per-block DB columns.
- Keep `src/lib/blocks.ts` free of server-only imports (it's shared with client).
- All admin writes go through `src/lib/admin/actions.ts`, guarded by `assertAdmin()`.
- After a `pages` write, revalidate tag `"pages"` and `revalidatePath("/", "layout")`.
- Colours are stored as raw CSS strings (hex from the picker, or `""` = inherit).
