import Image from "@/components/editorial/image";
import EventOverview from "./event-overview";
import type { EventHost, EventHostHeading } from "@/lib/event-hosts";
import styles from "./event-detail.module.css";

export default function EventHosts({ hosts, heading = "Host" }: { hosts: EventHost[]; heading?: EventHostHeading }) {
  if (!hosts.length) return null;
  return <section id="event-hosts" aria-labelledby="event-hosts-title" className={styles.hostsSection}>
    <h2 id="event-hosts-title">{heading === "Host" ? "Your Hosts :" : heading}</h2>
    <div className={styles.hostList}>
      {hosts.map((host, index) => <article key={index} data-host-name={host.name} className={styles.hostCard}>
        <div className={styles.hostIdentity}>
          {host.image && <Image className={styles.hostPhoto} src={host.image} alt={host.name} width={240} height={280} sizes="(max-width: 479px) 96px, 160px" />}
          <div><h3>{host.name}</h3>{host.role && <p className={styles.hostRole}>{host.role}</p>}
            {!!host.socials.length && <div className={styles.hostSocials}>{host.socials.map((social, i) => <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" title={social.label} aria-label={`View Profile: ${host.name} (${social.label})`}>View Profile</a>)}</div>}
          </div>
        </div>
        {host.bio && <EventOverview><p className={styles.hostBio}>{host.bio}</p></EventOverview>}
      </article>)}
    </div>
  </section>;
}
