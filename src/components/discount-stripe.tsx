import { whatsappLink } from "@/lib/site";
import { Icon } from "./icon";

export default function DiscountStripe() {
  return (
    <div className="border-y border-line bg-surface py-4">
      <a
        href={whatsappLink("Hi! Is there any discount running right now?")}
        target="_blank"
        rel="noopener noreferrer"
        className="group mx-auto flex w-fit items-center gap-2.5 text-sm text-foreground-soft transition-colors hover:text-accent"
      >
        <Icon name="logo-whatsapp" size={16} className="text-accent" />
        Ask about current offers on WhatsApp
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-accent underline underline-offset-4 group-hover:no-underline">
          Chat
        </span>
      </a>
    </div>
  );
}
