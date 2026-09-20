# Website content editing

Open `/admin/pages` after signing in. **Manage Pages** lists all website pages in a table; click a page name or Edit to open its editor.

- Choose the page for its copy, hero media, supporting galleries, lists and SEO fields.
- Expand a section inside the page editor for hero media, carousel labels, the family book, testimonials, galleries or form copy.
- Use **Header, Footer & WhatsApp** for sitewide navigation and contact settings.
- Images can be uploaded using the existing authenticated media endpoint or replaced with a URL. Image descriptions remain ordinary text fields.
- Lists support adding and removing entries. Empty strings and empty lists are intentional values, not requests to restore seed content.
- **Save content** writes to the database and invalidates the website's content cache. **Load original content** only changes the draft until saved.
- Stays, rates, room amenities and event records remain in their dedicated admin screens. Blog articles and custom pages remain in the Blog and Pages editors.

## Implementation

`src/lib/editorial/catalog.ts` lists the page/section schemas. Approved layouts and initial content are kept in `src/lib/editorial/defaults/`. Database overrides use `site_content` keys prefixed with `editorial:`. Missing fields inherit defaults; explicit empty values do not.

Server components use `getEditorial`; interactive components use `useEditorial` with values provided by the public layout. Save actions require an authenticated administrator, validate content shape and invalidate both the content tag and public layout cache.

Existing About/Contact copy and partner data are read as legacy baselines, so saved content is preserved when moving to the unified editor. New editorial overrides take priority. Keep generated field identifiers stable once content is saved; new fields can be added with defaults without resetting existing records.

Layout classes, animation logic, booking/payment behavior, validation rules and application routes remain implementation code rather than editable content.

## Validation

- `node --import tsx --test tests/editorial.test.ts`
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`
- Production build verified with bundled fallbacks and the local database disabled for that build process.
- Browser checks covered all main public routes, authenticated heading/image persistence, client carousel content, and mobile carousel hydration/motion. Temporary verification content was restored.


## Manage Pages
Open `/admin/pages` to see website pages, stays, events, articles and custom pages in one table. Click a page name or Edit to open its editor. Built-in pages group their content, images and SEO into expandable sections with individual Save buttons. Shared sections identify the other pages they affect. Header, Footer & WhatsApp has its own entry. Existing `/admin/content` links redirect to the corresponding page editor.
