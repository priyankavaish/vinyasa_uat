// Shown instantly on route transitions so navigation never feels frozen
// while the server component resolves its data.
export default function SiteLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[60svh] items-center justify-center bg-background"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-clay-ink/25 border-t-accent" />
    </div>
  );
}
