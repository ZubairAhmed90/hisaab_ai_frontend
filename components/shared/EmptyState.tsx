// Centered empty state with icon, title, and subtitle
export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-muted/30 bg-card p-12 text-center shadow-card">
      <span className="mb-3 text-4xl">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </div>
  );
}
