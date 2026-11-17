import { eventDescriptionHtml } from "@/lib/event-description";

export default function EventDescription({ value }: { value: string }) {
  return <span dangerouslySetInnerHTML={{ __html: eventDescriptionHtml(value) }} />;
}
