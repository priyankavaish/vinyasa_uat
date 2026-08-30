import EventForm from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-3xl italic">Add event</h1>
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
