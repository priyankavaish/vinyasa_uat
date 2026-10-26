"use client";

import { usePathname } from "next/navigation";
import { defaults } from "@/lib/editorial/defaults/whatsapp";
import { useEditorial } from "@/components/editorial/provider";
import { Icon } from "./icon";



export default function WhatsappButton() {
  const content = useEditorial("shared/whatsapp", defaults);
  const pathname = usePathname() ?? "/";
  const rule = content.routes.find((r) => pathname.startsWith(r.path));
  const message = rule?.message ?? content.message;

  return (
    <a
      href={`https://wa.me/${content.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      data-whatsapp-button
      aria-label={content.label}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-30 grid h-11 w-11 place-items-center rounded-full bg-[#1da851] text-white shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <Icon name="logo-whatsapp" size={22} />
    </a>
  );
}
