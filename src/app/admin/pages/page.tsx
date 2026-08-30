import { hasDb } from "@/lib/db";
import { getContent } from "@/lib/cms";
import ContentForm, { type ContentGroup } from "@/components/admin/content-form";

export const dynamic = "force-dynamic";

const GROUPS: ContentGroup[] = [
  {
    key: "home.hero",
    title: "Home — hero",
    fields: [
      { path: "kicker", label: "Kicker" },
      { path: "location", label: "Location line" },
      { path: "values", label: "Values line" },
    ],
  },
  {
    key: "home.cottages",
    title: "Home — cottages section",
    fields: [
      { path: "eyebrow", label: "Eyebrow" },
      { path: "heading", label: "Heading" },
    ],
  },
  {
    key: "about.hero",
    title: "About — hero",
    fields: [
      { path: "eyebrow", label: "Eyebrow" },
      { path: "title", label: "Title" },
      { path: "description", label: "Description", multiline: true },
    ],
  },
  {
    key: "about.story",
    title: "About — founding story",
    fields: [
      { path: "heading", label: "Heading" },
      { path: "body", label: "Body (blank line = new paragraph)", multiline: true },
    ],
  },
  {
    key: "about.craft",
    title: "About — craft section",
    fields: [
      { path: "heading", label: "Heading" },
      { path: "body", label: "Body", multiline: true },
    ],
  },
  {
    key: "contact.hero",
    title: "Contact — hero",
    fields: [
      { path: "eyebrow", label: "Eyebrow" },
      { path: "title", label: "Title" },
      { path: "description", label: "Description", multiline: true },
    ],
  },
  { key: "contact.services", title: "Contact — services (JSON array)", json: true },
  { key: "contact.faq", title: "Contact — FAQ (JSON array)", json: true },
];

export default async function AdminPagesPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;

  const values = await Promise.all(GROUPS.map((g) => getContent(g.key)));

  return (
    <div>
      <h1 className="font-display text-3xl italic">Page content</h1>
      <p className="mt-1 text-sm text-foreground-soft">
        Editable copy for the Home, About and Contact pages.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {GROUPS.map((g, i) => (
          <ContentForm key={g.key} group={g} value={values[i]} />
        ))}
      </div>
    </div>
  );
}
