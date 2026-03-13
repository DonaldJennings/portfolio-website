'use client';

import { useMemo, useState } from 'react';

type AdminPost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content: string;
};

type AdminProject = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  repoUrl?: string;
  content: string;
};

type ExperienceEntry = {
  company: string;
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isCurrent?: boolean;
};

type GithubMetric = {
  owner: string;
  repo: string;
  projectName?: string;
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  completionRate: number;
  avgCloseTimeDays: number;
};

type Store = {
  posts: AdminPost[];
  projects: AdminProject[];
  experience: ExperienceEntry[];
  githubRepos: { owner: string; repo: string; projectName?: string }[];
};

export default function AdminPortalClient({ initialStore }: { initialStore: Store }) {
  const [store, setStore] = useState<Store>(initialStore);
  const [selectedPost, setSelectedPost] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(0);
  const [metrics, setMetrics] = useState<GithubMetric[]>([]);
  const [message, setMessage] = useState('');

  const selectedPostData = useMemo(() => store.posts[selectedPost] ?? null, [store.posts, selectedPost]);
  const selectedProjectData = useMemo(
    () => store.projects[selectedProject] ?? null,
    [store.projects, selectedProject],
  );
  const selectedExperienceData = useMemo(
    () => store.experience[selectedExperience] ?? null,
    [store.experience, selectedExperience],
  );

  async function saveContent() {
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store),
    });

    setMessage(response.ok ? 'Saved successfully' : 'Save failed');
  }

  async function loadMetrics() {
    const response = await fetch('/api/admin/github-metrics');
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Unable to load GitHub metrics');
      return;
    }
    setMetrics(data.metrics);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen p-6 md:p-10 font-mono text-slate-100 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <button className="px-4 py-2 bg-slate-700 rounded" onClick={logout}>
          Log out
        </button>
      </div>
      {message && <p className="text-green-400">{message}</p>}

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
          <h2 className="text-xl font-semibold">Edit Blog Posts</h2>
          <select value={selectedPost} onChange={e => setSelectedPost(Number(e.target.value))} className="w-full px-2 py-2 rounded bg-slate-800">
            {store.posts.map((post, idx) => (
              <option key={post.slug} value={idx}>{post.title}</option>
            ))}
          </select>
          {selectedPostData && (
            <textarea className="w-full min-h-64 bg-slate-800 rounded p-3" value={selectedPostData.content} onChange={e => {
              const next = [...store.posts];
              next[selectedPost] = { ...selectedPostData, content: e.target.value };
              setStore({ ...store, posts: next });
            }} />
          )}
        </div>

        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
          <h2 className="text-xl font-semibold">Edit Projects</h2>
          <select value={selectedProject} onChange={e => setSelectedProject(Number(e.target.value))} className="w-full px-2 py-2 rounded bg-slate-800">
            {store.projects.map((project, idx) => (
              <option key={project.slug} value={idx}>{project.title}</option>
            ))}
          </select>
          {selectedProjectData && (
            <textarea className="w-full min-h-64 bg-slate-800 rounded p-3" value={selectedProjectData.content} onChange={e => {
              const next = [...store.projects];
              next[selectedProject] = { ...selectedProjectData, content: e.target.value };
              setStore({ ...store, projects: next });
            }} />
          )}
        </div>
      </section>

      <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">Edit Work Experience</h2>
        <select value={selectedExperience} onChange={e => setSelectedExperience(Number(e.target.value))} className="w-full px-2 py-2 rounded bg-slate-800">
          {store.experience.map((job, idx) => (
            <option key={`${job.company}-${idx}`} value={idx}>{job.company} - {job.role}</option>
          ))}
        </select>
        {selectedExperienceData && (
          <textarea className="w-full min-h-48 bg-slate-800 rounded p-3" value={selectedExperienceData.description} onChange={e => {
            const next = [...store.experience];
            next[selectedExperience] = { ...selectedExperienceData, description: e.target.value };
            setStore({ ...store, experience: next });
          }} />
        )}
      </section>

      <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects Dashboard (GitHub)</h2>
          <button className="px-4 py-2 bg-blue-600 rounded" onClick={loadMetrics}>Refresh Metrics</button>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {metrics.map(metric => (
            <article key={`${metric.owner}/${metric.repo}`} className="bg-slate-800 rounded p-3">
              <h3 className="font-semibold">{metric.projectName || metric.repo}</h3>
              <p className="text-sm text-slate-300">{metric.owner}/{metric.repo}</p>
              <p>Total Issues: {metric.totalIssues}</p>
              <p>Open: {metric.openIssues} | Closed: {metric.closedIssues}</p>
              <p>Completion: {metric.completionRate}%</p>
              <p>Avg Close Time: {metric.avgCloseTimeDays} days</p>
            </article>
          ))}
        </div>
      </section>

      <button className="px-6 py-3 bg-green-600 rounded" onClick={saveContent}>Save all changes</button>
    </div>
  );
}
