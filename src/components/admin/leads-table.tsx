"use client";

import { Fragment, useMemo, useState } from "react";
import type { Lead } from "@/lib/store";

const SOURCES = ["all", "contact", "volunteer", "corporate", "newsletter"] as const;

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<(typeof SOURCES)[number]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => (filter === "all" ? leads : leads.filter((l) => l.source === filter)),
    [leads, filter]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {SOURCES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] capitalize ${
              filter === s
                ? "border-accent bg-accent text-white"
                : "border-line bg-white text-foreground-soft"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center text-sm text-foreground-soft">
          No queries in this view.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f4efe6] text-xs uppercase tracking-[0.06em] text-foreground-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Source</th>
                <th className="hidden px-4 py-3 sm:table-cell">Email</th>
                <th className="hidden px-4 py-3 md:table-cell">Received</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const open = openId === l.id;
                return (
                  <Fragment key={l.id}>
                    <tr
                      className="cursor-pointer border-t border-line hover:bg-[#faf7f0]"
                      onClick={() => setOpenId(open ? null : l.id)}
                    >
                      <td className="px-4 py-3 font-medium">{l.name}</td>
                      <td className="px-4 py-3 capitalize">{l.source}</td>
                      <td className="hidden px-4 py-3 text-foreground-soft sm:table-cell">{l.email}</td>
                      <td className="hidden px-4 py-3 text-xs text-muted md:table-cell">
                        {new Date(l.createdAt).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-accent">
                        {open ? "Hide" : "View"}
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-t border-line bg-[#faf7f0]">
                        <td colSpan={5} className="px-4 py-4">
                          <dl className="grid gap-3 sm:grid-cols-2">
                            <Detail label="Name" value={l.name} />
                            <Detail label="Source" value={l.source} />
                            <Detail label="Email" value={<a href={`mailto:${l.email}`} className="text-accent underline">{l.email}</a>} />
                            <Detail label="Phone" value={l.phone ? <a href={`tel:${l.phone}`} className="text-accent underline">{l.phone}</a> : "—"} />
                            <Detail label="Received" value={new Date(l.createdAt).toLocaleString("en-IN")} />
                          </dl>
                          <div className="mt-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                              Message
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                              {l.message || "— no message —"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm capitalize-none">{value}</dd>
    </div>
  );
}
