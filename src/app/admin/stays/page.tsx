import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { cottages, visitOptions as voT, partners as pT } from "@/lib/db/schema";
import { deleteCottage } from "@/lib/admin/actions";
import DeleteButton from "@/components/admin/delete-button";
import VisitOptionsEditor from "@/components/admin/visit-options-editor";
import PartnersEditor from "@/components/admin/partners-editor";

export const dynamic = "force-dynamic";

export default async function AdminStaysPage() {
  if (!hasDb()) return <p className="text-sm text-foreground-soft">Database not configured.</p>;

  const db = getDb();
  const [rows, vo, pr] = await Promise.all([
    db.select().from(cottages).orderBy(asc(cottages.sort)),
    db.select().from(voT).orderBy(asc(voT.sort)),
    db.select().from(pT).orderBy(asc(pT.sort)),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl italic">Stays</h1>
          <Link href="/admin/stays/new" className="btn btn-accent">
            Add cottage
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Element</th>
                <th className="px-4 py-3">Price / night</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3">Live</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/stays/${c.id}`} className="text-accent underline">
                      {c.name}
                    </Link>
                    <div className="text-xs text-muted">/{c.slug}</div>
                  </td>
                  <td className="px-4 py-3">{c.element}</td>
                  <td className="px-4 py-3 tabular-nums">₹{c.pricePerNight.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 tabular-nums">{c.sort}</td>
                  <td className="px-4 py-3">{c.published ? "Yes" : "Draft"}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={c.id} action={deleteCottage} label="Delete cottage?" />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-foreground-soft">
                    No cottages yet. Run <code>npm run db:seed</code> or add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VisitOptionsEditor items={vo} />
      <PartnersEditor items={pr} />
    </div>
  );
}
