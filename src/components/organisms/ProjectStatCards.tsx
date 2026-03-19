import { ProjectMeta } from '@/lib/projects';

const STATUS_LABELS: Record<string, string> = {
  live: 'Actively maintained',
  wip: 'Work in progress',
  archived: 'Archived',
};

const ROLE_LABELS: Record<string, string> = {
  solo: 'Solo',
  team: 'Team',
  contributor: 'Contributor',
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="flex flex-col gap-1 px-4 py-4 rounded-xl"
      style={{
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 8px 0 rgba(59,130,246,0.08)',
      }}
    >
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-base font-semibold text-slate-100">{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}

export default function ProjectStatCards({ meta }: { meta: ProjectMeta }) {
  const year = meta.date ? new Date(meta.date).getFullYear().toString() : '—';
  const stackCount = meta.stack?.length ?? 0;
  const stackLabel = stackCount > 0
    ? meta.stack!.slice(0, 2).join(', ') + (stackCount > 2 ? ` +${stackCount - 2}` : '')
    : '—';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Status"
        value={meta.status ? STATUS_LABELS[meta.status] : '—'}
      />
      <StatCard
        label="Role"
        value={meta.role ? ROLE_LABELS[meta.role] : '—'}
      />
      <StatCard
        label="Year"
        value={year}
      />
      <StatCard
        label="Stack"
        value={stackLabel}
        sub={stackCount > 2 ? `${stackCount} technologies` : undefined}
      />
    </div>
  );
}
