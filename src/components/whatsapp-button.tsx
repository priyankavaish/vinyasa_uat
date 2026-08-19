"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";
import { Icon } from "./icon";

const MESSAGES: Array<{ match: (path: string) => boolean; message: string }> = [
  { match: (p) => p.startsWith("/stays"), message: "Hi, I'm interested in booking a mud-house cottage stay." },
  { match: (p) => p.startsWith("/events"), message: "Hi, I'd like more details on an upcoming retreat/workshop." },
  { match: (p) => p.startsWith("/corporate"), message: "Hi, we're looking into a corporate offsite at Vinyasa Earth." },
  { match: (p) => p.startsWith("/contact"), message: "Hi, I have a question about Vinyasa Earth." },
  { match: (p) => p.startsWith("/book"), message: "Hi, I have a question about my booking." },
];

export default function WhatsappButton() {
  const pathname = usePathname() ?? "/";
  const rule = MESSAGES.find((r) => r.match(pathname));
  const message = rule?.message ?? "Hi, I'd like to know more about Vinyasa Earth.";

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <Icon name="logo-whatsapp" size={22} />
    </a>
  );
}
