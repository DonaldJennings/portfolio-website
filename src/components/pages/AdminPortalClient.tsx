'use client';

import { useMemo, useState, useEffect } from 'react';
import CommaSeparatedInput from '../atoms/CommaSeparatedInput';
import NewlineListInput from '../atoms/NewlineListInput';

// ─── Types ─────────────────────────────────────────────────────────────────────

type AdminPost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  image?: string;
  author?: { name: string; avatarUrl?: string; readingTime?: string };
  content: string;
};

type AdminProject = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  image?: string;
  author?: { name: string; avatarUrl?: string };
  repoUrl?: string;
  demoUrl?: string;
  content: string;
  status?: 'live' | 'wip' | 'archived';
  stack?: string[];
  role?: 'solo' | 'team' | 'contributor';
  featured?: boolean;
  problem?: string;
  highlights?: string[];
  architectureDiagram?: string;
};

type ExperienceRole = {
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isCurrent?: boolean;
};

type ExperienceEntry = {
  company: string;
  logoUrl?: string;
  websiteUrl?: string;
  roles: ExperienceRole[];
};

type EducationEntry = {
  degree: string;
  degreeTitle?: string;
  institution?: string;
  results?: string;
  dateRange?: string;
  description: string[];
  borderColor?: string;
};

type GithubMetric = {
  owner: string;
  repo: string;
  projectName?: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  lastPush: string;
  defaultBranch: string;
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  completionRate: number;
  avgCloseTimeDays: number;
  openPRs: number;
  mergedPRs: number;
  totalPRs: number;
};

type GithubSummary = {
  totalStars: number;
  totalForks: number;
  totalIssuesClosed: number;
  totalIssuesOpen: number;
  totalMergedPRs: number;
  avgCompletionRate: number;
};

type PublicationEntry = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url?: string;
  doi?: string;
};

type ProfileData = {
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  statusLabel: string;
  avatarUrl?: string;
};

type HighlightEntry = {
  icon: string;
  label: string;
  sub: string;
};

type SkillCategoryEntry = {
  title: string;
  skills: string[];
  accent: string;
};

type AwardEntry = {
  title: string;
  org: string;
  year: string;
  description: string;
};

type InterestEntry = {
  icon: string;
  label: string;
};

type Store = {
  posts: AdminPost[];
  projects: AdminProject[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  githubRepos: { owner: string; repo: string; projectName?: string }[];
  profile: ProfileData;
  highlights: HighlightEntry[];
  skillCategories: SkillCategoryEntry[];
  certifications: string[];
  awards: AwardEntry[];
  interests: InterestEntry[];
};

type AdminPortalMode =
  | 'all'
  | 'content'
  | 'metrics'
  | 'posts'
  | 'projects'
  | 'experience'
  | 'education'
  | 'publications'
  | 'profile';

// ─── Markdown preview (client-side, no extra deps) ─────────────────────────────

function mdPreview(md: string): string {
  if (!md.trim()) return '<p style="color:#64748b;font-style:italic">Nothing to preview.</p>';
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Code blocks (restore &lt; / &gt; inside them handled separately)
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_m, c) =>
      `<pre style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:12px;font-size:12px;overflow-x:auto;margin:12px 0;font-family:monospace;color:#86efac">${c}</pre>`)
    .replace(/`([^`]+)`/g, '<code style="background:#1e293b;padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace;color:#fbbf24">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:700;color:#f1f5f9;margin:20px 0 6px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.125rem;font-weight:700;color:#f1f5f9;margin:24px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.25rem;font-weight:700;color:#f1f5f9;margin:24px 0 8px">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f1f5f9">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#e2e8f0">$1</em>')
    .replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #334155;margin:16px 0" />')
    .replace(/^- (.+)$/gm, '<li style="margin:3px 0 3px 16px;color:#cbd5e1">• $1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2dd4bf;text-decoration:underline">$1</a>');

  const lines = html.split('\n');
  const out: string[] = [];
  let para: string[] = [];
  for (const line of lines) {
    const isBlock = /^<(h[1-6]|pre|hr|li|ul|ol|div|p)/.test(line) || line === '';
    if (isBlock) {
      if (para.length) { out.push(`<p style="color:#94a3b8;line-height:1.7;margin-bottom:10px">${para.join(' ')}</p>`); para = []; }
      if (line) out.push(line);
    } else {
      para.push(line);
    }
  }
  if (para.length) out.push(`<p style="color:#94a3b8;line-height:1.7;margin-bottom:10px">${para.join(' ')}</p>`);
  return out.join('\n');
}

// ─── Reusable form primitives ──────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">{title}</span>
        <div className="flex-1 h-px bg-slate-700/60" />
      </div>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors';
const selectCls = 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors';

function MdxEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-4 border-b border-slate-700 bg-slate-800/60 px-4">
        {(['write', 'preview'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 text-xs font-semibold capitalize border-b-2 transition-colors ${
              tab === t
                ? 'border-blue-500 text-blue-300'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-slate-600 font-mono">MDX</span>
      </div>
      {tab === 'write' ? (
        <textarea
          className="w-full min-h-64 bg-slate-800/60 text-slate-100 text-sm font-mono p-4 focus:outline-none resize-y leading-relaxed"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <div
          className="w-full min-h-64 bg-slate-800/30 p-4 overflow-y-auto text-sm"
          dangerouslySetInnerHTML={{ __html: mdPreview(value) }}
        />
      )}
    </div>
  );
}

function ImageField({
  value,
  onChange,
  uploading,
  onUpload,
  accept = 'image/*',
}: {
  value: string;
  onChange: (v: string) => void;
  uploading: boolean;
  onUpload: (file: File) => void;
  accept?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className={`${inputCls} flex-1`} value={value} onChange={e => onChange(e.target.value)} placeholder="/images/my-image.png" />
        <label className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${uploading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-600 text-white'}`}>
          {uploading ? 'Uploading…' : 'Upload'}
          <input type="file" accept={accept} className="hidden" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) { onUpload(f); e.target.value = ''; } }} />
        </label>
        {value && (
          <button onClick={() => onChange('')} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 transition-colors">Clear</button>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && <img src={value} alt="preview" className="h-20 rounded-lg object-cover border border-slate-700" />}
    </div>
  );
}

function ItemList<T>({
  items,
  selected,
  onSelect,
  onAdd,
  onDelete,
  getLabel,
  getSub,
  addLabel,
}: {
  items: T[];
  selected: number;
  onSelect: (i: number) => void;
  onAdd: () => void;
  onDelete: (i: number) => void;
  getLabel: (item: T) => string;
  getSub?: (item: T) => string;
  addLabel: string;
}) {
  const [q, setQ] = useState('');
  const rows = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => !q || getLabel(item).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col h-full w-60 shrink-0 border-r border-slate-700/60 bg-slate-900/50">
      <div className="p-3 space-y-2 border-b border-slate-700/60">
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={onAdd}
          className="w-full py-1.5 rounded-lg text-xs font-semibold bg-teal-600/70 hover:bg-teal-600 text-white transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          {addLabel}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 && <p className="text-xs text-slate-600 text-center py-8">No items found</p>}
        {rows.map(({ item, idx }) => (
          <div
            key={idx}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(idx)}
            onKeyDown={e => e.key === 'Enter' && onSelect(idx)}
            className={`w-full text-left px-3 py-2.5 border-b border-slate-800/80 flex items-start justify-between gap-2 group transition-colors cursor-pointer ${
              selected === idx
                ? 'bg-blue-600/15 border-l-2 border-l-blue-500 pl-2.5'
                : 'hover:bg-slate-800/50 border-l-2 border-l-transparent'
            }`}
          >
            <div className="min-w-0">
              <p className={`text-xs font-medium truncate ${selected === idx ? 'text-blue-200' : 'text-slate-300'}`}>{getLabel(item)}</p>
              {getSub && <p className="text-[10px] text-slate-500 truncate mt-0.5">{getSub(item)}</p>}
            </div>
            {selected === idx && (
              <button
                onClick={e => { e.stopPropagation(); onDelete(idx); }}
                className="shrink-0 mt-0.5 text-slate-600 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const NAV = [
  { mode: 'profile',    href: '/admin/profile',    label: 'Profile',      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { mode: 'posts',      href: '/admin/posts',      label: 'Blog Posts',   icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6' },
  { mode: 'projects',   href: '/admin/projects',   label: 'Projects',     icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { mode: 'experience', href: '/admin/experience', label: 'Experience',   icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { mode: 'education',     href: '/admin/education',     label: 'Education',     icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { mode: 'publications',  href: '/admin/publications',  label: 'Publications',  icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { mode: 'metrics',       href: '/admin/github',        label: 'GitHub',        icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
] as const;

export default function AdminPortalClient({
  initialStore,
  mode = 'all',
}: {
  initialStore: Store;
  mode?: AdminPortalMode;
}) {
  const [store, setStore] = useState<Store>(initialStore);

  // Always load fresh data from the server on mount — no sessionStorage caching
  // to avoid stale schema issues when fields are added.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) setStore(await res.json() as Store);
      } catch { /* ignore — fall back to initialStore */ }
    })();
  }, []);

  const [selectedPost, setSelectedPost] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(0);
  const [selectedEducation, setSelectedEducation] = useState(0);
  const [selectedPublication, setSelectedPublication] = useState(0);
  const [metrics, setMetrics] = useState<GithubMetric[]>([]);
  const [summary, setSummary] = useState<GithubSummary | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'ok' | 'err'>('ok');
  const [postImageUploading, setPostImageUploading] = useState(false);
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [postAvatarUploading, setPostAvatarUploading] = useState(false);
  const [projectAvatarUploading, setProjectAvatarUploading] = useState(false);
  const [projectDiagramUploading, setProjectDiagramUploading] = useState(false);
  const [companyLogoUploading, setCompanyLogoUploading] = useState(false);

  // Auto-clear status message
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(t);
  }, [message]);

  function notify(msg: string, type: 'ok' | 'err' = 'ok') {
    setMessage(msg);
    setMessageType(type);
  }

  async function uploadImage(file: File, onSuccess: (path: string) => void, setUploading: (v: boolean) => void) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) onSuccess(data.path as string);
      else notify(`Upload failed: ${data.error || 'unknown'}`, 'err');
    } catch { notify('Upload failed: network error', 'err'); }
    finally { setUploading(false); }
  }

  const selectedPostData = useMemo(() => store.posts[selectedPost] ?? null, [store.posts, selectedPost]);
  const selectedProjectData = useMemo(() => store.projects[selectedProject] ?? null, [store.projects, selectedProject]);
  const selectedExperienceData = useMemo(() => store.experience[selectedExperience] ?? null, [store.experience, selectedExperience]);
  const selectedEducationData = useMemo(() => store.education[selectedEducation] ?? null, [store.education, selectedEducation]);
  const selectedPublicationData = useMemo(() => store.publications[selectedPublication] ?? null, [store.publications, selectedPublication]);

  async function saveContent() {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store),
    });
    let body: unknown = null;
    try { body = await res.json(); } catch { /* ignore */ }
    if (res.ok) {
      if (body && typeof body === 'object' && 'prUrl' in (body as Record<string, unknown>)) {
        const url = String((body as Record<string, unknown>).prUrl);
        notify(`Saved — PR opened: ${url}`);
        try { window.open(url, '_blank', 'noopener'); } catch { /* ignore */ }
      } else {
        notify('Saved successfully');
      }
    } else {
      let err = 'Save failed';
      if (body && typeof body === 'object') {
        const o = body as Record<string, unknown>;
        if (o.error) err = String(o.error);
        else if (o.message) err = String(o.message);
      }
      notify(err, 'err');
      console.error('Save failed', { status: res.status, body });
    }
  }

  // ─── Mutation helpers ───────────────────────────────────────────────────────

  function addPost() {
    const next = [...store.posts, { slug: `new-post-${Date.now()}`, title: 'New Post', date: new Date().toISOString().slice(0, 10), author: { name: 'Donald Jennings', avatarUrl: '/images/dj-avatar.png', readingTime: '3 min read' }, content: '' }];
    setStore({ ...store, posts: next });
    setSelectedPost(next.length - 1);
  }
  function deletePost(i: number) {
    if (!window.confirm('Delete this post?')) return;
    const next = [...store.posts];
    next.splice(i, 1);
    setStore({ ...store, posts: next });
    setSelectedPost(Math.max(0, i - 1));
  }
  function patchPost(patch: Partial<AdminPost>) {
    const next = [...store.posts];
    next[selectedPost] = { ...selectedPostData!, ...patch };
    setStore({ ...store, posts: next });
  }

  function addProject() {
    const next = [...store.projects, { slug: `new-project-${Date.now()}`, title: 'New Project', date: new Date().toISOString().slice(0, 10), author: { name: 'Donald Jennings', avatarUrl: '/images/dj-avatar.png' }, content: '' }];
    setStore({ ...store, projects: next });
    setSelectedProject(next.length - 1);
  }
  function deleteProject(i: number) {
    if (!window.confirm('Delete this project?')) return;
    const next = [...store.projects];
    next.splice(i, 1);
    setStore({ ...store, projects: next });
    setSelectedProject(Math.max(0, i - 1));
  }
  function patchProject(patch: Partial<AdminProject>) {
    const next = [...store.projects];
    next[selectedProject] = { ...selectedProjectData!, ...patch };
    setStore({ ...store, projects: next });
  }

  function addExperience() {
    const next: ExperienceEntry[] = [...store.experience, {
      company: 'New Company',
      logoUrl: '',
      roles: [{ role: 'New Role', dates: new Date().getFullYear().toString(), description: '', skills: [], isCurrent: false }],
    }];
    setStore({ ...store, experience: next });
    setSelectedExperience(next.length - 1);
  }
  function deleteExperience(i: number) {
    if (!window.confirm('Delete this company and all its roles?')) return;
    const next = [...store.experience];
    next.splice(i, 1);
    setStore({ ...store, experience: next });
    setSelectedExperience(Math.max(0, i - 1));
  }
  function patchExperienceMeta(patch: Partial<Pick<ExperienceEntry, 'company' | 'logoUrl' | 'websiteUrl'>>) {
    const next = [...store.experience];
    next[selectedExperience] = { ...selectedExperienceData!, ...patch };
    setStore({ ...store, experience: next });
  }
  function addExperienceRole() {
    const entry = selectedExperienceData!;
    const next = [...store.experience];
    next[selectedExperience] = {
      ...entry,
      roles: [...entry.roles, { role: 'New Role', dates: new Date().getFullYear().toString(), description: '', skills: [], isCurrent: false }],
    };
    setStore({ ...store, experience: next });
  }
  function deleteExperienceRole(roleIdx: number) {
    if (!window.confirm('Delete this role?')) return;
    const entry = selectedExperienceData!;
    const roles = [...entry.roles];
    roles.splice(roleIdx, 1);
    const next = [...store.experience];
    next[selectedExperience] = { ...entry, roles };
    setStore({ ...store, experience: next });
  }
  function patchExperienceRole(roleIdx: number, patch: Partial<ExperienceRole>) {
    const entry = selectedExperienceData!;
    const roles = [...entry.roles];
    roles[roleIdx] = { ...roles[roleIdx], ...patch };
    const next = [...store.experience];
    next[selectedExperience] = { ...entry, roles };
    setStore({ ...store, experience: next });
  }

  function patchProfile(patch: Partial<ProfileData>) {
    setStore(s => ({ ...s, profile: { ...s.profile, ...patch } }));
  }

  // Highlights
  function addHighlight() {
    setStore(s => ({ ...s, highlights: [...(s.highlights ?? []), { icon: '⭐', label: 'New highlight', sub: '' }] }));
  }
  function deleteHighlight(i: number) {
    setStore(s => { const next = [...(s.highlights ?? [])]; next.splice(i, 1); return { ...s, highlights: next }; });
  }
  function patchHighlight(i: number, patch: Partial<HighlightEntry>) {
    setStore(s => { const next = [...(s.highlights ?? [])]; next[i] = { ...next[i], ...patch }; return { ...s, highlights: next }; });
  }

  // Skill categories
  function addSkillCategory() {
    setStore(s => ({ ...s, skillCategories: [...(s.skillCategories ?? []), { title: 'New Category', skills: [], accent: 'blue' }] }));
  }
  function deleteSkillCategory(i: number) {
    setStore(s => { const next = [...(s.skillCategories ?? [])]; next.splice(i, 1); return { ...s, skillCategories: next }; });
  }
  function patchSkillCategory(i: number, patch: Partial<SkillCategoryEntry>) {
    setStore(s => { const next = [...(s.skillCategories ?? [])]; next[i] = { ...next[i], ...patch }; return { ...s, skillCategories: next }; });
  }

  // Certifications
  function addCertification() {
    setStore(s => ({ ...s, certifications: [...(s.certifications ?? []), 'New Certification'] }));
  }
  function deleteCertification(i: number) {
    setStore(s => { const next = [...(s.certifications ?? [])]; next.splice(i, 1); return { ...s, certifications: next }; });
  }
  function patchCertification(i: number, val: string) {
    setStore(s => { const next = [...(s.certifications ?? [])]; next[i] = val; return { ...s, certifications: next }; });
  }

  // Awards
  function addAward() {
    setStore(s => ({ ...s, awards: [...(s.awards ?? []), { title: 'New Award', org: '', year: new Date().getFullYear().toString(), description: '' }] }));
  }
  function deleteAward(i: number) {
    setStore(s => { const next = [...(s.awards ?? [])]; next.splice(i, 1); return { ...s, awards: next }; });
  }
  function patchAward(i: number, patch: Partial<AwardEntry>) {
    setStore(s => { const next = [...(s.awards ?? [])]; next[i] = { ...next[i], ...patch }; return { ...s, awards: next }; });
  }

  // Interests
  function addInterest() {
    setStore(s => ({ ...s, interests: [...(s.interests ?? []), { icon: '✨', label: 'New Interest' }] }));
  }
  function deleteInterest(i: number) {
    setStore(s => { const next = [...(s.interests ?? [])]; next.splice(i, 1); return { ...s, interests: next }; });
  }
  function patchInterest(i: number, patch: Partial<InterestEntry>) {
    setStore(s => { const next = [...(s.interests ?? [])]; next[i] = { ...next[i], ...patch }; return { ...s, interests: next }; });
  }

  function addEducation() {
    const next = [...store.education, { degree: 'New Degree', degreeTitle: '', institution: '', results: '', dateRange: '', description: [''], borderColor: 'border-green-500' }];
    setStore({ ...store, education: next });
    setSelectedEducation(next.length - 1);
  }
  function deleteEducation(i: number) {
    if (!window.confirm('Delete this education entry?')) return;
    const next = [...store.education];
    next.splice(i, 1);
    setStore({ ...store, education: next });
    setSelectedEducation(Math.max(0, i - 1));
  }
  function patchEducation(patch: Partial<EducationEntry>) {
    const next = [...store.education];
    next[selectedEducation] = { ...selectedEducationData!, ...patch };
    setStore({ ...store, education: next });
  }

  function addPublication() {
    const next = [...store.publications, { title: 'New Publication', authors: '', venue: '', year: new Date().getFullYear().toString(), url: '', doi: '' }];
    setStore({ ...store, publications: next });
    setSelectedPublication(next.length - 1);
  }
  function deletePublication(i: number) {
    if (!window.confirm('Delete this publication?')) return;
    const next = [...store.publications];
    next.splice(i, 1);
    setStore({ ...store, publications: next });
    setSelectedPublication(Math.max(0, i - 1));
  }
  function patchPublication(patch: Partial<PublicationEntry>) {
    const next = [...store.publications];
    next[selectedPublication] = { ...selectedPublicationData!, ...patch };
    setStore({ ...store, publications: next });
  }

  async function loadMetrics() {
    setMetricsLoading(true);
    try {
      const res = await fetch('/api/admin/github-metrics');
      const data = await res.json();
      if (!res.ok) { notify(data.error || 'Unable to load metrics', 'err'); return; }
      setMetrics(data.metrics);
      setSummary(data.summary ?? null);
    } finally {
      setMetricsLoading(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
  }

  // Determine active section from mode
  // Derive active section before any effects that depend on it
  const activeSection: typeof NAV[number]['mode'] =
    mode === 'profile' ? 'profile' :
    mode === 'metrics' ? 'metrics' :
    mode === 'projects' ? 'projects' :
    mode === 'experience' ? 'experience' :
    mode === 'education' ? 'education' :
    mode === 'publications' ? 'publications' :
    'posts';

  // Auto-fetch metrics when the GitHub section is active
  useEffect(() => {
    if (activeSection === 'metrics' && store.githubRepos.length > 0) {
      void loadMetrics();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // ─── JSX ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100" style={{ paddingTop: '5rem' }}>

      {/* ── Top bar ── */}
      <header className="sticky top-20 z-20 flex items-center gap-4 px-6 h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <span className="font-bold text-slate-200 text-sm tracking-wide">Admin Portal</span>
        <div className="flex-1" />
        {message && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${messageType === 'ok' ? 'bg-teal-500/15 text-teal-300' : 'bg-red-500/15 text-red-300'}`}>
            {message}
          </span>
        )}
        <button
          onClick={saveContent}
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
        >
          Save changes
        </button>
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
        >
          Log out
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 8.5rem)' }}>

        {/* ── Sidebar nav ── */}
        <nav className="w-44 shrink-0 border-r border-slate-800 flex flex-col gap-0.5 px-2 pt-4 bg-slate-950/80">
          {NAV.map(item => {
            const active = activeSection === item.mode;
            return (
              <a
                key={item.mode}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600/15 text-blue-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* ── Content area ── */}
        <main className="flex-1 overflow-hidden flex">

          {/* ══ Blog Posts ══ */}
          {activeSection === 'posts' && (
            <>
              <ItemList
                items={store.posts}
                selected={selectedPost}
                onSelect={setSelectedPost}
                onAdd={addPost}
                onDelete={deletePost}
                getLabel={p => p.title}
                getSub={p => p.date}
                addLabel="New post"
              />
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {selectedPostData ? (
                  <>
                    <FieldGroup title="Basic info">
                      <Field label="Title">
                        <input className={inputCls} value={selectedPostData.title} onChange={e => patchPost({ title: e.target.value })} placeholder="Post title" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Slug">
                          <input className={inputCls} value={selectedPostData.slug} onChange={e => patchPost({ slug: e.target.value })} placeholder="my-post-slug" />
                        </Field>
                        <Field label="Date">
                          <input className={inputCls} type="date" value={selectedPostData.date} onChange={e => patchPost({ date: e.target.value })} />
                        </Field>
                      </div>
                      <Field label="Description">
                        <input className={inputCls} value={selectedPostData.description ?? ''} onChange={e => patchPost({ description: e.target.value })} placeholder="Short summary shown on cards" />
                      </Field>
                      <Field label="Tags" hint="Comma-separated">
                        <CommaSeparatedInput className={inputCls} value={selectedPostData.tags ?? []} onChange={tags => patchPost({ tags })} placeholder="nextjs, typescript, mdx" />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Media">
                      <Field label="Card image">
                        <ImageField
                          value={selectedPostData.image ?? ''}
                          onChange={v => patchPost({ image: v })}
                          uploading={postImageUploading}
                          onUpload={f => uploadImage(f, v => patchPost({ image: v }), setPostImageUploading)}
                        />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Author">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Name">
                          <input className={inputCls} value={selectedPostData.author?.name ?? ''} onChange={e => patchPost({ author: { ...selectedPostData.author, name: e.target.value } })} placeholder="Donald Jennings" />
                        </Field>
                        <Field label="Reading time">
                          <input className={inputCls} value={selectedPostData.author?.readingTime ?? ''} onChange={e => patchPost({ author: { ...selectedPostData.author, name: selectedPostData.author?.name ?? '', readingTime: e.target.value } })} placeholder="3 min read" />
                        </Field>
                      </div>
                      <Field label="Avatar">
                        <ImageField
                          value={selectedPostData.author?.avatarUrl ?? ''}
                          onChange={v => patchPost({ author: { ...selectedPostData.author, name: selectedPostData.author?.name ?? '', avatarUrl: v } })}
                          uploading={postAvatarUploading}
                          onUpload={f => uploadImage(f, v => patchPost({ author: { ...selectedPostData.author, name: selectedPostData.author?.name ?? '', avatarUrl: v } }), setPostAvatarUploading)}
                        />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Content">
                      <Field label="MDX content">
                        <MdxEditor value={selectedPostData.content} onChange={v => patchPost({ content: v })} />
                      </Field>
                    </FieldGroup>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-600">No post selected</div>
                )}
              </div>
            </>
          )}

          {/* ══ Projects ══ */}
          {activeSection === 'projects' && (
            <>
              <ItemList
                items={store.projects}
                selected={selectedProject}
                onSelect={setSelectedProject}
                onAdd={addProject}
                onDelete={deleteProject}
                getLabel={p => p.title}
                getSub={p => p.date}
                addLabel="New project"
              />
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {selectedProjectData ? (
                  <>
                    <FieldGroup title="Basic info">
                      <Field label="Title">
                        <input className={inputCls} value={selectedProjectData.title} onChange={e => patchProject({ title: e.target.value })} placeholder="Project title" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Slug">
                          <input className={inputCls} value={selectedProjectData.slug} onChange={e => patchProject({ slug: e.target.value })} placeholder="my-project" />
                        </Field>
                        <Field label="Date">
                          <input className={inputCls} type="date" value={selectedProjectData.date} onChange={e => patchProject({ date: e.target.value })} />
                        </Field>
                      </div>
                      <Field label="Description">
                        <input className={inputCls} value={selectedProjectData.description ?? ''} onChange={e => patchProject({ description: e.target.value })} placeholder="Short summary shown on cards" />
                      </Field>
                      <Field label="Tags" hint="Comma-separated topic tags">
                        <CommaSeparatedInput className={inputCls} value={selectedProjectData.tags ?? []} onChange={tags => patchProject({ tags })} placeholder="serverless, distributed-systems" />
                      </Field>
                      <Field label="Tech stack" hint="Comma-separated technologies">
                        <CommaSeparatedInput className={inputCls} value={selectedProjectData.stack ?? []} onChange={stack => patchProject({ stack })} placeholder="React, Python, AWS" />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Classification">
                      <div className="grid grid-cols-3 gap-4">
                        <Field label="Status">
                          <select className={selectCls} value={selectedProjectData.status ?? ''} onChange={e => patchProject({ status: (e.target.value as AdminProject['status']) || undefined })}>
                            <option value="">— none —</option>
                            <option value="live">Live</option>
                            <option value="wip">In progress</option>
                            <option value="archived">Archived</option>
                          </select>
                        </Field>
                        <Field label="Role">
                          <select className={selectCls} value={selectedProjectData.role ?? ''} onChange={e => patchProject({ role: (e.target.value as AdminProject['role']) || undefined })}>
                            <option value="">— none —</option>
                            <option value="solo">Solo</option>
                            <option value="team">Team</option>
                            <option value="contributor">Contributor</option>
                          </select>
                        </Field>
                        <Field label="Featured">
                          <div className="flex items-center h-10">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={selectedProjectData.featured ?? false} onChange={e => patchProject({ featured: e.target.checked })} className="w-4 h-4 accent-blue-500" />
                              <span className="text-sm text-slate-300">Show as featured</span>
                            </label>
                          </div>
                        </Field>
                      </div>
                    </FieldGroup>

                    <FieldGroup title="Links">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Repo URL">
                          <input className={inputCls} value={selectedProjectData.repoUrl ?? ''} onChange={e => patchProject({ repoUrl: e.target.value })} placeholder="https://github.com/..." />
                        </Field>
                        <Field label="Demo URL">
                          <input className={inputCls} value={selectedProjectData.demoUrl ?? ''} onChange={e => patchProject({ demoUrl: e.target.value })} placeholder="https://..." />
                        </Field>
                      </div>
                    </FieldGroup>

                    <FieldGroup title="Media">
                      <Field label="Card image">
                        <ImageField value={selectedProjectData.image ?? ''} onChange={v => patchProject({ image: v })} uploading={projectImageUploading} onUpload={f => uploadImage(f, v => patchProject({ image: v }), setProjectImageUploading)} />
                      </Field>
                      <Field label="Architecture diagram" hint="SVG exported from draw.io">
                        <ImageField value={selectedProjectData.architectureDiagram ?? ''} onChange={v => patchProject({ architectureDiagram: v })} uploading={projectDiagramUploading} onUpload={f => uploadImage(f, v => patchProject({ architectureDiagram: v }), setProjectDiagramUploading)} accept="image/svg+xml,image/*" />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Author">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Name">
                          <input className={inputCls} value={selectedProjectData.author?.name ?? ''} onChange={e => patchProject({ author: { ...selectedProjectData.author, name: e.target.value } })} placeholder="Donald Jennings" />
                        </Field>
                      </div>
                      <Field label="Avatar">
                        <ImageField value={selectedProjectData.author?.avatarUrl ?? ''} onChange={v => patchProject({ author: { ...selectedProjectData.author, name: selectedProjectData.author?.name ?? '', avatarUrl: v } })} uploading={projectAvatarUploading} onUpload={f => uploadImage(f, v => patchProject({ author: { ...selectedProjectData.author, name: selectedProjectData.author?.name ?? '', avatarUrl: v } }), setProjectAvatarUploading)} />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Dashboard content">
                      <Field label="Problem statement">
                        <textarea className={`${inputCls} min-h-20 resize-y`} value={selectedProjectData.problem ?? ''} onChange={e => patchProject({ problem: e.target.value })} placeholder="What problem does this project solve?" />
                      </Field>
                      <Field label="Highlights" hint="One per line — shown as bullet points">
                        <NewlineListInput className={`${inputCls} min-h-24 resize-y font-mono text-xs`} value={selectedProjectData.highlights ?? []} onChange={highlights => patchProject({ highlights })} placeholder="3.13× lower median latency" />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title="Technical notes (MDX)">
                      <Field label="Content">
                        <MdxEditor value={selectedProjectData.content} onChange={v => patchProject({ content: v })} />
                      </Field>
                    </FieldGroup>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-600">No project selected</div>
                )}
              </div>
            </>
          )}

          {/* ══ Profile ══ */}
          {activeSection === 'profile' && (
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
              {/* Bio */}
              <FieldGroup title="Bio">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name">
                    <input className={inputCls} value={store.profile?.name ?? ''} onChange={e => patchProfile({ name: e.target.value })} />
                  </Field>
                  <Field label="Role / Title">
                    <input className={inputCls} value={store.profile?.role ?? ''} onChange={e => patchProfile({ role: e.target.value })} />
                  </Field>
                  <Field label="Company">
                    <input className={inputCls} value={store.profile?.company ?? ''} onChange={e => patchProfile({ company: e.target.value })} />
                  </Field>
                  <Field label="Location">
                    <input className={inputCls} value={store.profile?.location ?? ''} onChange={e => patchProfile({ location: e.target.value })} />
                  </Field>
                </div>
                <Field label="Bio text">
                  <textarea className={`${inputCls} min-h-24 resize-y`} value={store.profile?.bio ?? ''} onChange={e => patchProfile({ bio: e.target.value })} />
                </Field>
                <Field label="Status badge label" hint='e.g. "Currently at Leonardo UK"'>
                  <input className={inputCls} value={store.profile?.statusLabel ?? ''} onChange={e => patchProfile({ statusLabel: e.target.value })} />
                </Field>
                <Field label="Avatar / profile photo">
                  <ImageField
                    value={store.profile?.avatarUrl ?? ''}
                    onChange={v => patchProfile({ avatarUrl: v })}
                    uploading={companyLogoUploading}
                    onUpload={f => uploadImage(f, p => patchProfile({ avatarUrl: p }), setCompanyLogoUploading)}
                  />
                </Field>
              </FieldGroup>

              {/* Highlights */}
              <FieldGroup title="Quick highlights">
                <div className="space-y-3">
                  {(store.highlights ?? []).map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input className={`${inputCls} w-14`} value={h.icon} onChange={e => patchHighlight(i, { icon: e.target.value })} placeholder="🎓" />
                      <input className={`${inputCls} flex-1`} value={h.label} onChange={e => patchHighlight(i, { label: e.target.value })} placeholder="Label" />
                      <input className={`${inputCls} flex-1`} value={h.sub} onChange={e => patchHighlight(i, { sub: e.target.value })} placeholder="Sub-label" />
                      <button onClick={() => deleteHighlight(i)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={addHighlight} className="w-full py-2 rounded-lg text-xs font-semibold border border-dashed border-slate-600 text-slate-500 hover:border-teal-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Add highlight
                  </button>
                </div>
              </FieldGroup>

              {/* Skills */}
              <FieldGroup title="Skill categories">
                <div className="space-y-5">
                  {(store.skillCategories ?? []).map((cat, ci) => (
                    <div key={ci} className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <input className={`${inputCls} flex-1`} value={cat.title} onChange={e => patchSkillCategory(ci, { title: e.target.value })} placeholder="Category name" />
                        <select className={`${inputCls} w-28`} value={cat.accent} onChange={e => patchSkillCategory(ci, { accent: e.target.value })}>
                          {['blue','teal','purple','green','amber'].map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <button onClick={() => deleteSkillCategory(ci)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                      <Field label="Skills" hint="Comma-separated">
                        <CommaSeparatedInput className={inputCls} value={cat.skills} onChange={skills => patchSkillCategory(ci, { skills })} placeholder="React, Node.js, Docker" />
                      </Field>
                    </div>
                  ))}
                  <button onClick={addSkillCategory} className="w-full py-2 rounded-lg text-xs font-semibold border border-dashed border-slate-600 text-slate-500 hover:border-teal-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Add category
                  </button>
                </div>
              </FieldGroup>

              {/* Certifications */}
              <FieldGroup title="Certifications">
                <div className="space-y-2">
                  {(store.certifications ?? []).map((cert, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input className={`${inputCls} flex-1`} value={cert} onChange={e => patchCertification(i, e.target.value)} placeholder="Certification name" />
                      <button onClick={() => deleteCertification(i)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={addCertification} className="w-full py-2 rounded-lg text-xs font-semibold border border-dashed border-slate-600 text-slate-500 hover:border-teal-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Add certification
                  </button>
                </div>
              </FieldGroup>

              {/* Awards */}
              <FieldGroup title="Awards">
                <div className="space-y-5">
                  {(store.awards ?? []).map((award, i) => (
                    <div key={i} className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Award {i + 1}</span>
                        <button onClick={() => deleteAward(i)} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Remove</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Title">
                          <input className={inputCls} value={award.title} onChange={e => patchAward(i, { title: e.target.value })} />
                        </Field>
                        <Field label="Year">
                          <input className={inputCls} value={award.year} onChange={e => patchAward(i, { year: e.target.value })} />
                        </Field>
                      </div>
                      <Field label="Organisation">
                        <input className={inputCls} value={award.org} onChange={e => patchAward(i, { org: e.target.value })} />
                      </Field>
                      <Field label="Description">
                        <textarea className={`${inputCls} min-h-16 resize-y`} value={award.description} onChange={e => patchAward(i, { description: e.target.value })} />
                      </Field>
                    </div>
                  ))}
                  <button onClick={addAward} className="w-full py-2 rounded-lg text-xs font-semibold border border-dashed border-slate-600 text-slate-500 hover:border-teal-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Add award
                  </button>
                </div>
              </FieldGroup>

              {/* Interests */}
              <FieldGroup title="Interests">
                <div className="space-y-2">
                  {(store.interests ?? []).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input className={`${inputCls} w-14`} value={item.icon} onChange={e => patchInterest(i, { icon: e.target.value })} placeholder="⚡" />
                      <input className={`${inputCls} flex-1`} value={item.label} onChange={e => patchInterest(i, { label: e.target.value })} placeholder="Interest label" />
                      <button onClick={() => deleteInterest(i)} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={addInterest} className="w-full py-2 rounded-lg text-xs font-semibold border border-dashed border-slate-600 text-slate-500 hover:border-teal-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Add interest
                  </button>
                </div>
              </FieldGroup>
            </div>
          )}

          {/* ══ Experience ══ */}
          {activeSection === 'experience' && (
            <>
              <ItemList
                items={store.experience}
                selected={selectedExperience}
                onSelect={setSelectedExperience}
                onAdd={addExperience}
                onDelete={deleteExperience}
                getLabel={e => e.company}
                getSub={e => `${e.roles?.length ?? 0} role${(e.roles?.length ?? 0) === 1 ? '' : 's'}`}
                addLabel="New company"
              />
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {selectedExperienceData ? (
                  <>
                    <FieldGroup title="Company">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Company name">
                          <input className={inputCls} value={selectedExperienceData.company} onChange={e => patchExperienceMeta({ company: e.target.value })} />
                        </Field>
                        <Field label="Website URL" hint="Hover link on company name">
                          <input className={inputCls} value={selectedExperienceData.websiteUrl ?? ''} onChange={e => patchExperienceMeta({ websiteUrl: e.target.value })} placeholder="https://example.com" />
                        </Field>
                      </div>
                      <Field label="Company logo">
                        <ImageField
                          value={selectedExperienceData.logoUrl ?? ''}
                          onChange={v => patchExperienceMeta({ logoUrl: v })}
                          uploading={companyLogoUploading}
                          onUpload={f => uploadImage(f, p => patchExperienceMeta({ logoUrl: p }), setCompanyLogoUploading)}
                          accept="image/*"
                        />
                      </Field>
                    </FieldGroup>

                    <FieldGroup title={`Roles (${selectedExperienceData.roles?.length ?? 0})`}>
                      <div className="space-y-6">
                        {(selectedExperienceData.roles ?? []).map((r, rIdx) => (
                          <div key={rIdx} className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Role {rIdx + 1}</span>
                              <button
                                onClick={() => deleteExperienceRole(rIdx)}
                                className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Field label="Role / Title">
                                <input className={inputCls} value={r.role} onChange={e => patchExperienceRole(rIdx, { role: e.target.value })} />
                              </Field>
                              <Field label="Date range">
                                <input className={inputCls} value={r.dates} onChange={e => patchExperienceRole(rIdx, { dates: e.target.value })} placeholder="Jan 2023 – Present" />
                              </Field>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`isCurrent-${rIdx}`}
                                checked={!!r.isCurrent}
                                onChange={e => patchExperienceRole(rIdx, { isCurrent: e.target.checked })}
                                className="accent-teal-500"
                              />
                              <label htmlFor={`isCurrent-${rIdx}`} className="text-xs text-slate-400 select-none">Current role</label>
                            </div>
                            <Field label="Skills" hint="Comma-separated">
                              <CommaSeparatedInput className={inputCls} value={r.skills ?? []} onChange={skills => patchExperienceRole(rIdx, { skills })} placeholder="TypeScript, React, AWS" />
                            </Field>
                            <Field label="Description">
                              <MdxEditor value={r.description} onChange={v => patchExperienceRole(rIdx, { description: v })} />
                            </Field>
                          </div>
                        ))}
                        <button
                          onClick={addExperienceRole}
                          className="w-full py-2 rounded-lg text-xs font-semibold border border-dashed border-slate-600 text-slate-500 hover:border-teal-500 hover:text-teal-400 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                          Add role
                        </button>
                      </div>
                    </FieldGroup>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-600">No company selected</div>
                )}
              </div>
            </>
          )}

          {/* ══ Education ══ */}
          {activeSection === 'education' && (
            <>
              <ItemList
                items={store.education}
                selected={selectedEducation}
                onSelect={setSelectedEducation}
                onAdd={addEducation}
                onDelete={deleteEducation}
                getLabel={e => e.degree}
                getSub={e => e.institution ?? ''}
                addLabel="New degree"
              />
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {selectedEducationData ? (
                  <>
                    <FieldGroup title="Details">
                      <Field label="Degree title" hint="e.g. Bachelor of Science">
                        <input className={inputCls} value={selectedEducationData.degreeTitle ?? ''} onChange={e => patchEducation({ degreeTitle: e.target.value })} />
                      </Field>
                      <Field label="Degree / Subject">
                        <input className={inputCls} value={selectedEducationData.degree} onChange={e => patchEducation({ degree: e.target.value })} />
                      </Field>
                      <Field label="Institution">
                        <input className={inputCls} value={selectedEducationData.institution ?? ''} onChange={e => patchEducation({ institution: e.target.value })} />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Date range">
                          <input className={inputCls} value={selectedEducationData.dateRange ?? ''} onChange={e => patchEducation({ dateRange: e.target.value })} placeholder="2020 – 2024" />
                        </Field>
                        <Field label="Results">
                          <input className={inputCls} value={selectedEducationData.results ?? ''} onChange={e => patchEducation({ results: e.target.value })} placeholder="First Class Honours" />
                        </Field>
                      </div>
                    </FieldGroup>
                    <FieldGroup title="Description">
                      <Field label="Paragraphs" hint="Separate paragraphs with a blank line">
                        <textarea
                          className={`${inputCls} min-h-40 resize-y`}
                          value={(selectedEducationData.description ?? []).join('\n\n')}
                          onChange={e => patchEducation({ description: e.target.value.split(/\n\s*\n/) })}
                        />
                      </Field>
                    </FieldGroup>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-600">No education entry selected</div>
                )}
              </div>
            </>
          )}

          {/* ══ Publications ══ */}
          {activeSection === 'publications' && (
            <>
              <ItemList
                items={store.publications}
                selected={selectedPublication}
                onSelect={setSelectedPublication}
                onAdd={addPublication}
                onDelete={deletePublication}
                getLabel={p => p.title}
                getSub={p => `${p.venue} · ${p.year}`}
                addLabel="New paper"
              />
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {selectedPublicationData ? (
                  <>
                    <FieldGroup title="Publication details">
                      <Field label="Title">
                        <input className={inputCls} value={selectedPublicationData.title} onChange={e => patchPublication({ title: e.target.value })} />
                      </Field>
                      <Field label="Authors">
                        <input className={inputCls} value={selectedPublicationData.authors} onChange={e => patchPublication({ authors: e.target.value })} placeholder="A. Author, B. Author" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Venue">
                          <input className={inputCls} value={selectedPublicationData.venue} onChange={e => patchPublication({ venue: e.target.value })} />
                        </Field>
                        <Field label="Year">
                          <input className={inputCls} value={selectedPublicationData.year} onChange={e => patchPublication({ year: e.target.value })} />
                        </Field>
                      </div>
                      <Field label="URL">
                        <input className={inputCls} value={selectedPublicationData.url ?? ''} onChange={e => patchPublication({ url: e.target.value })} placeholder="https://dl.acm.org/..." />
                      </Field>
                      <Field label="DOI">
                        <input className={inputCls} value={selectedPublicationData.doi ?? ''} onChange={e => patchPublication({ doi: e.target.value })} placeholder="10.1145/..." />
                      </Field>
                    </FieldGroup>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-slate-600">No publication selected</div>
                )}
              </div>
            </>
          )}

          {/* ══ GitHub Metrics ══ */}
          {activeSection === 'metrics' && (
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

              {/* Tracked repos management */}
              <FieldGroup title="Tracked repositories">
                <div className="space-y-2">
                  {store.githubRepos.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                      </svg>
                      <input
                        className="w-24 bg-transparent text-xs text-slate-300 focus:outline-none border-b border-slate-700 focus:border-blue-500"
                        value={r.owner}
                        onChange={e => {
                          const next = [...store.githubRepos];
                          next[i] = { ...r, owner: e.target.value };
                          setStore({ ...store, githubRepos: next });
                        }}
                        placeholder="owner"
                      />
                      <span className="text-slate-600">/</span>
                      <input
                        className="w-40 bg-transparent text-xs text-slate-300 focus:outline-none border-b border-slate-700 focus:border-blue-500"
                        value={r.repo}
                        onChange={e => {
                          const next = [...store.githubRepos];
                          next[i] = { ...r, repo: e.target.value };
                          setStore({ ...store, githubRepos: next });
                        }}
                        placeholder="repo"
                      />
                      <input
                        className="flex-1 bg-transparent text-xs text-slate-400 focus:outline-none border-b border-slate-700 focus:border-blue-500"
                        value={r.projectName ?? ''}
                        onChange={e => {
                          const next = [...store.githubRepos];
                          next[i] = { ...r, projectName: e.target.value };
                          setStore({ ...store, githubRepos: next });
                        }}
                        placeholder="Display name (optional)"
                      />
                      <button
                        onClick={() => {
                          const next = [...store.githubRepos];
                          next.splice(i, 1);
                          setStore({ ...store, githubRepos: next });
                        }}
                        className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setStore({ ...store, githubRepos: [...store.githubRepos, { owner: '', repo: '', projectName: '' }] })}
                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium py-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Add repository
                  </button>
                </div>
                <p className="text-xs text-slate-600">Changes are saved with the global Save button.</p>
              </FieldGroup>

              {/* Refresh + summary */}
              <div className="flex items-center gap-4">
                <button
                  onClick={loadMetrics}
                  disabled={metricsLoading || store.githubRepos.length === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
                >
                  {metricsLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  )}
                  {metricsLoading ? 'Loading…' : 'Refresh metrics'}
                </button>
                {store.githubRepos.length === 0 && (
                  <p className="text-xs text-slate-500">Add repositories above to see metrics.</p>
                )}
              </div>

              {/* Summary bar */}
              {summary && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { label: 'Total stars', value: summary.totalStars, color: 'text-yellow-400', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                    { label: 'Total forks', value: summary.totalForks, color: 'text-blue-400', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
                    { label: 'Issues closed', value: summary.totalIssuesClosed, color: 'text-green-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Issues open', value: summary.totalIssuesOpen, color: 'text-amber-400', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'PRs merged', value: summary.totalMergedPRs, color: 'text-purple-400', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
                    { label: 'Avg complete', value: `${summary.avgCompletionRate}%`, color: 'text-teal-400', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 text-center">
                      <svg className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                      </svg>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Per-repo cards */}
              {metrics.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {metrics.map(m => {
                    const lastPush = new Date(m.lastPush);
                    const daysAgo = Math.floor((Date.now() - lastPush.getTime()) / 86_400_000);
                    const recentLabel = daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo}d ago`;
                    return (
                      <div key={`${m.owner}/${m.repo}`} className="bg-slate-900 border border-slate-700/60 rounded-xl p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-100">{m.projectName || m.repo}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{m.owner}/{m.repo}</p>
                            {m.description && <p className="text-xs text-slate-400 mt-1">{m.description}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {m.language && (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">{m.language}</span>
                            )}
                          </div>
                        </div>

                        {/* Repo stats row */}
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                            {m.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                            {m.forks}
                          </span>
                          <span className="ml-auto text-slate-600">pushed {recentLabel}</span>
                        </div>

                        {/* Issue progress bar */}
                        {m.totalIssues > 0 ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Issue progress</span>
                              <span className="font-semibold text-teal-400">{m.completionRate}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all" style={{ width: `${m.completionRate}%` }} />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>{m.closedIssues} closed</span>
                              <span>{m.openIssues} open · avg {m.avgCloseTimeDays}d to close</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-600">No issues tracked</p>
                        )}

                        {/* PR stats */}
                        {m.totalPRs > 0 && (
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-500">PRs:</span>
                            <span className="text-purple-400 font-medium">{m.mergedPRs} merged</span>
                            {m.openPRs > 0 && <span className="text-amber-400">{m.openPRs} open</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
