"use client";
import { defaults as editorialDefaults } from "@/lib/editorial/defaults/components_sections_stay_collection";
import { useEditorial } from "@/components/editorial/provider";


import { useState } from "react";
import Image from "@/components/editorial/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Cottage } from "@/lib/content";
import styles from "./stay-collection.module.css";

type Filter = "all" | "cottages" | "shared" | "tent";

function StayCard({ room }: { room: Cottage }) {
  const content = useEditorial("components/sections/stay-collection", editorialDefaults);

  const [photo, setPhoto] = useState(0);
  const images = [...new Set((room.gallery.length ? room.gallery : [room.image]).filter(Boolean))];
  const shared = room.slug === "dorm";
  const tent = room.slug === "tent";
  const href = `/stays/${room.slug}`;
  return (
    <article className={styles.card} data-shared={shared}>
      <div className={styles.media}>
        <Link href={href} className={styles.imageLink} aria-label={`Explore ${room.name}`}>
          <Image src={images[photo] || room.image} alt={`${room.name} at Vinyasa Earth, photo ${photo + 1}`}
            fill sizes="(min-width: 1152px) 528px, (min-width: 700px) 46vw, 100vw" className={styles.image} />
        </Link>
        <span className={styles.type}>{tent ? "Outdoor stay" : shared ? content.text_1 : room.element + " element"}</span>
        {images.length > 1 && (
          <div className={styles.photoControls} aria-label={`${room.name} photos`}>
            <button type="button" aria-label={`Previous photo of ${room.name}`}
              onClick={() => setPhoto((photo + images.length - 1) % images.length)}>
              <span className={styles.previous}><Icon name="arrow-forward-outline" size={15} /></span>
            </button>
            <span aria-live="polite" aria-atomic="true">{String(photo + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
            <button type="button" aria-label={`Next photo of ${room.name}`}
              onClick={() => setPhoto((photo + 1) % images.length)}>
              <Icon name="arrow-forward-outline" size={15} />
            </button>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.category}>{shared ? content.text_2 : room.tagline}</p>
            <h3><Link href={href}>{room.name}</Link></h3>
          </div>
          <p className={styles.occupancy}><Icon name="people-outline" size={16} />{shared ? content.text_3 : `Up to ${room.maxGuests} guests`}</p>
        </div>
        {room.quantity === 0 && <p className="mt-3 inline-block border border-accent/25 bg-clay-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">Sold out</p>}
        <p className={styles.description}>{room.description}</p>
        <div className={styles.bottom}>
          <p className={styles.price}>
            {room.pricePerNight > 0 ? <><span>{content.text_4}</span><strong>₹{room.pricePerNight.toLocaleString("en-IN")}</strong><small>{shared ? "/ bed / night + 18% GST" : "/ night + 18% GST"}</small></> : <strong>{content.text_5}</strong>}
          </p>
          <Link href={href} className={styles.explore} aria-label={`Explore ${room.name} ${tent ? "stay" : shared ? content.text_6 : content.text_7}`}>
            {tent ? "Explore tent" : shared ? content.text_8 : content.text_9}<Icon name="arrow-forward-outline" size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function StayCollection({ rooms }: { rooms: Cottage[] }) {
  const content = useEditorial("components/sections/stay-collection", editorialDefaults);

  const [filter, setFilter] = useState<Filter>("all");
  const visible = rooms.filter((room) => filter === "all" || (filter === "shared" ? room.slug === "dorm" : filter === "tent" ? room.slug === "tent" : room.slug !== "dorm" && room.slug !== "tent"));
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All stays", count: rooms.length },
    { value: "cottages", label: "Mudhouses", count: rooms.filter((r) => r.slug !== "dorm" && r.slug !== "tent").length },
    { value: "shared", label: "Shared dorm", count: rooms.filter((r) => r.slug === "dorm").length },
    { value: "tent", label: "Tent", count: rooms.filter((r) => r.slug === "tent").length },
  ];
  return (
    <section id="rooms" aria-labelledby="stay-collection-heading" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>{content.text_10}</p>
            <h2 id="stay-collection-heading">{content.text_11}<br />{content.text_12}</h2>
          </div>
          <div className={styles.intro}>
            <p>{content.text_13}<br />{content.text_14}</p>
            <span>{content.text_15}</span>
          </div>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.filters} aria-label={content.aria_label_16}>
            {filters.map(({ value, label, count }) => (
              <button key={value} type="button" aria-pressed={filter === value} aria-controls="stay-results" onClick={() => setFilter(value)}>
                {label}<span>{count}</span>
              </button>
            ))}
          </div>
          <p className={styles.results} role="status">{visible.length} {visible.length === 1 ? content.text_17 : content.text_18}{content.text_19}</p>
        </div>
        <div id="stay-results" className={styles.grid}>
          {visible.map((room) => <StayCard key={room.slug} room={room} />)}
        </div>
        {!visible.length && <p className={styles.empty}>{content.text_20}</p>}
        <div className={styles.help}>
          <p>{content.text_21}</p>
          <Link href={content.href_22}>{content.text_23}<Icon name="arrow-forward-outline" size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
