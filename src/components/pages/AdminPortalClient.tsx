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
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  completionRate: number;
  avgCloseTimeDays: number;
};

type PublicationEntry = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url?: string;
  doi?: string;
};

type Store = {
  posts: AdminPost[];
  projects: AdminProject[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  githubRepos: { owner: string; repo: string; projectName?: string }[];
};

type AdminPortalMode =
  | 'all'
  | 'content'
  | 'metrics'
  | 'posts'
  | 'projects'
  | 'experience'
  | 'education';

export default function AdminPortalClient({
  initialStore,
  mode = 'all',
}: {
  initialStore: Store;
  mode?: AdminPortalMode;
}) {
  const [store, setStore] = useState<Store>(initialStore);
  const [selectedPost, setSelectedPost] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(0);
  const [selectedEducation, setSelectedEducation] = useState(0);
  const [selectedPublication, setSelectedPublication] = useState(0);
  const [metrics, setMetrics] = useState<GithubMetric[]>([]);
  const [message, setMessage] = useState('');
  const showContent = mode === 'all' || mode === 'content';
  const showMetrics = mode === 'all' || mode === 'metrics';
  const showPostsOnly = mode === 'posts';
  const showProjectsOnly = mode === 'projects';
  const showExperienceOnly = mode === 'experience';
  const showEducationOnly = mode === 'education';

  const selectedPostData = useMemo(
    () => store.posts[selectedPost] ?? null,
    [store.posts, selectedPost],
  );
  const selectedProjectData = useMemo(
    () => store.projects[selectedProject] ?? null,
    [store.projects, selectedProject],
  );
  const selectedExperienceData = useMemo(
    () => store.experience[selectedExperience] ?? null,
    [store.experience, selectedExperience],
  );
  const selectedEducationData = useMemo(
    () => store.education[selectedEducation] ?? null,
    [store.education, selectedEducation],
  );
  const selectedPublicationData = useMemo(
    () => store.publications[selectedPublication] ?? null,
    [store.publications, selectedPublication],
  );

  async function saveContent() {
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store),
    });

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // ignore parse errors
    }

    if (response.ok) {
      // If PR URL returned, show link to created PR
      if (body && typeof body === 'object' && 'prUrl' in (body as Record<string, unknown>)) {
        const prUrl = String((body as Record<string, unknown>).prUrl);
        setMessage(`Saved — PR opened: ${prUrl}`);
        // open PR in new tab for convenience
        try {
          window.open(prUrl, '_blank', 'noopener');
        } catch {}
      } else {
        setMessage('Saved successfully');
      }
    } else {
      let errMsg = 'Save failed';
      if (body && typeof body === 'object') {
        const obj = body as Record<string, unknown>;
        if (obj.error) errMsg = String(obj.error);
        else if (obj.message) errMsg = String(obj.message);
      }
      setMessage(`Save failed: ${errMsg}`);
      // also log to console for debugging
      console.error('Save failed', { status: response.status, body });
    }
  }

  // --- Content manipulation helpers ---
  function addPost() {
    const next = [...store.posts];
    const newPost: AdminPost = {
      slug: `new-post-${Date.now()}`,
      title: 'New Post',
      date: new Date().toISOString().slice(0, 10),
      content: '',
    };
    next.push(newPost);
    setStore({ ...store, posts: next });
    setSelectedPost(next.length - 1);
  }

  function deletePost(index: number) {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return;
    const next = [...store.posts];
    next.splice(index, 1);
    setStore({ ...store, posts: next });
    setSelectedPost(Math.max(0, index - 1));
  }

  function addProject() {
    const next = [...store.projects];
    const newProject: AdminProject = {
      slug: `new-project-${Date.now()}`,
      title: 'New Project',
      date: new Date().toISOString().slice(0, 10),
      content: '',
    };
    next.push(newProject);
    setStore({ ...store, projects: next });
    setSelectedProject(next.length - 1);
  }

  function deleteProject(index: number) {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return;
    const next = [...store.projects];
    next.splice(index, 1);
    setStore({ ...store, projects: next });
    setSelectedProject(Math.max(0, index - 1));
  }

  function addExperience() {
    const next = [...store.experience];
    const newExp: ExperienceEntry = {
      company: 'New Company',
      role: 'New Role',
      dates: new Date().getFullYear().toString(),
      description: '',
      skills: [],
    };
    next.push(newExp);
    setStore({ ...store, experience: next });
    setSelectedExperience(next.length - 1);
  }

  function deleteExperience(index: number) {
    if (!window.confirm('Delete this experience entry? This action cannot be undone.')) return;
    const next = [...store.experience];
    next.splice(index, 1);
    setStore({ ...store, experience: next });
    setSelectedExperience(Math.max(0, index - 1));
  }

  function addEducation() {
    const next = [...store.education];
    const newEdu: EducationEntry = {
      degree: 'New Degree',
      degreeTitle: '',
      institution: '',
      results: '',
      dateRange: '',
      description: [''],
      borderColor: 'border-green-500',
    };
    next.push(newEdu);
    setStore({ ...store, education: next });
    setSelectedEducation(next.length - 1);
  }

  function deleteEducation(index: number) {
    if (!window.confirm('Delete this education entry? This action cannot be undone.')) return;
    const next = [...store.education];
    next.splice(index, 1);
    setStore({ ...store, education: next });
    setSelectedEducation(Math.max(0, index - 1));
  }

  function addPublication() {
    const next = [...store.publications];
    const newPub: PublicationEntry = {
      title: 'New Publication',
      authors: '',
      venue: '',
      year: new Date().getFullYear().toString(),
      url: '',
      doi: '',
    };
    next.push(newPub);
    setStore({ ...store, publications: next });
    setSelectedPublication(next.length - 1);
  }

  function deletePublication(index: number) {
    if (!window.confirm('Delete this publication? This action cannot be undone.')) return;
    const next = [...store.publications];
    next.splice(index, 1);
    setStore({ ...store, publications: next });
    setSelectedPublication(Math.max(0, index - 1));
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
    <div className="min-h-screen pt-28 font-mono text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <button className="px-4 py-2 bg-slate-700 rounded" onClick={logout}>
            Log out
          </button>
        </div>
        {message && <p className="text-green-400">{message}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/admin/posts"
            className={`px-3 py-2 rounded ${
              mode === 'posts' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
            } text-sm font-medium`}
          >
            Edit Posts
          </a>
          <a
            href="/admin/projects"
            className={`px-3 py-2 rounded ${
              mode === 'projects' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
            } text-sm font-medium`}
          >
            Edit Projects
          </a>
          <a
            href="/admin/experience"
            className={`px-3 py-2 rounded ${
              mode === 'experience' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
            } text-sm font-medium`}
          >
            Edit Experience
          </a>
          <a
            href="/admin/education"
            className={`px-3 py-2 rounded ${
              mode === 'education' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
            } text-sm font-medium`}
          >
            Edit Education
          </a>
          <a
            href="/admin/github"
            className={`px-3 py-2 rounded ${
              mode === 'metrics' ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
            } text-sm font-medium`}
          >
            GitHub Metrics
          </a>
        </div>

        {/* Render each content section when in combined 'content' mode OR when the page requests a single section */}
        {(showContent ||
          showPostsOnly ||
          showProjectsOnly ||
          showExperienceOnly ||
          showEducationOnly) && (
          <>
            <section className="grid grid-cols-1 gap-4">
              {(showContent || showPostsOnly) && (
                <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Edit Blog Posts</h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 rounded text-sm" onClick={addPost}>
                        Add Post
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 rounded text-sm"
                        onClick={() => deletePost(selectedPost)}
                        disabled={store.posts.length === 0}
                      >
                        Delete Post
                      </button>
                    </div>
                  </div>

                  <label className="block text-sm text-slate-300">Choose post</label>
                  <select
                    value={selectedPost}
                    onChange={e => setSelectedPost(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded bg-slate-800"
                  >
                    {store.posts.map((post, idx) => (
                      <option key={post.slug} value={idx}>
                        {post.title}
                      </option>
                    ))}
                  </select>

                  {selectedPostData && (
                    <div className="space-y-3">
                      <label className="block text-sm text-slate-300">Title</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={selectedPostData.title || ''}
                        onChange={e => {
                          const next = [...store.posts];
                          next[selectedPost] = { ...selectedPostData, title: e.target.value };
                          setStore({ ...store, posts: next });
                        }}
                        placeholder="Title"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm text-slate-300">Slug</label>
                          <input
                            className="w-full px-3 py-2 bg-slate-800 rounded"
                            value={selectedPostData.slug || ''}
                            onChange={e => {
                              const next = [...store.posts];
                              next[selectedPost] = { ...selectedPostData, slug: e.target.value };
                              setStore({ ...store, posts: next });
                            }}
                            placeholder="Slug"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-300">Date</label>
                          <input
                            className="w-full px-3 py-2 bg-slate-800 rounded"
                            value={selectedPostData.date || ''}
                            onChange={e => {
                              const next = [...store.posts];
                              next[selectedPost] = { ...selectedPostData, date: e.target.value };
                              setStore({ ...store, posts: next });
                            }}
                            placeholder="Date (YYYY-MM-DD)"
                          />
                        </div>
                      </div>

                      <label className="block text-sm text-slate-300">Short description</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={selectedPostData.description || ''}
                        onChange={e => {
                          const next = [...store.posts];
                          next[selectedPost] = { ...selectedPostData, description: e.target.value };
                          setStore({ ...store, posts: next });
                        }}
                        placeholder="Short description"
                      />

                      <label className="block text-sm text-slate-300">Tags (comma separated)</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={(selectedPostData.tags || []).join(', ')}
                        onChange={e => {
                          const next = [...store.posts];
                          next[selectedPost] = {
                            ...selectedPostData,
                            tags: e.target.value
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean),
                          };
                          setStore({ ...store, posts: next });
                        }}
                        placeholder="Tags (comma separated)"
                      />

                      <label className="block text-sm text-slate-300">Content (MDX)</label>
                      <textarea
                        className="w-full min-h-64 bg-slate-800 rounded p-3"
                        value={selectedPostData.content}
                        onChange={e => {
                          const next = [...store.posts];
                          next[selectedPost] = { ...selectedPostData, content: e.target.value };
                          setStore({ ...store, posts: next });
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {(showContent || showProjectsOnly) && (
                <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Edit Projects</h2>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-green-600 rounded text-sm"
                        onClick={addProject}
                      >
                        Add Project
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 rounded text-sm"
                        onClick={() => deleteProject(selectedProject)}
                        disabled={store.projects.length === 0}
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>

                  <label className="block text-sm text-slate-300">Choose project</label>
                  <select
                    value={selectedProject}
                    onChange={e => setSelectedProject(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded bg-slate-800"
                  >
                    {store.projects.map((project, idx) => (
                      <option key={project.slug} value={idx}>
                        {project.title}
                      </option>
                    ))}
                  </select>

                  {selectedProjectData && (
                    <div className="space-y-3">
                      <label className="block text-sm text-slate-300">Title</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={selectedProjectData.title || ''}
                        onChange={e => {
                          const next = [...store.projects];
                          next[selectedProject] = { ...selectedProjectData, title: e.target.value };
                          setStore({ ...store, projects: next });
                        }}
                        placeholder="Title"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm text-slate-300">Slug</label>
                          <input
                            className="w-full px-3 py-2 bg-slate-800 rounded"
                            value={selectedProjectData.slug || ''}
                            onChange={e => {
                              const next = [...store.projects];
                              next[selectedProject] = {
                                ...selectedProjectData,
                                slug: e.target.value,
                              };
                              setStore({ ...store, projects: next });
                            }}
                            placeholder="Slug"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-300">Date</label>
                          <input
                            className="w-full px-3 py-2 bg-slate-800 rounded"
                            value={selectedProjectData.date || ''}
                            onChange={e => {
                              const next = [...store.projects];
                              next[selectedProject] = {
                                ...selectedProjectData,
                                date: e.target.value,
                              };
                              setStore({ ...store, projects: next });
                            }}
                            placeholder="Date (YYYY-MM-DD)"
                          />
                        </div>
                      </div>

                      <label className="block text-sm text-slate-300">Short description</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={selectedProjectData.description || ''}
                        onChange={e => {
                          const next = [...store.projects];
                          next[selectedProject] = {
                            ...selectedProjectData,
                            description: e.target.value,
                          };
                          setStore({ ...store, projects: next });
                        }}
                        placeholder="Short description"
                      />

                      <label className="block text-sm text-slate-300">Tags (comma separated)</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={(selectedProjectData.tags || []).join(', ')}
                        onChange={e => {
                          const next = [...store.projects];
                          next[selectedProject] = {
                            ...selectedProjectData,
                            tags: e.target.value
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean),
                          };
                          setStore({ ...store, projects: next });
                        }}
                        placeholder="Tags (comma separated)"
                      />

                      <label className="block text-sm text-slate-300">Content (MDX)</label>
                      <textarea
                        className="w-full min-h-64 bg-slate-800 rounded p-3"
                        value={selectedProjectData.content}
                        onChange={e => {
                          const next = [...store.projects];
                          next[selectedProject] = {
                            ...selectedProjectData,
                            content: e.target.value,
                          };
                          setStore({ ...store, projects: next });
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </section>

            {(showContent || showExperienceOnly) && (
              <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Edit Work Experience</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 rounded text-sm"
                      onClick={addExperience}
                    >
                      Add Experience
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 rounded text-sm"
                      onClick={() => deleteExperience(selectedExperience)}
                      disabled={store.experience.length === 0}
                    >
                      Delete Experience
                    </button>
                  </div>
                </div>

                <label className="block text-sm text-slate-300">Choose experience entry</label>
                <select
                  value={selectedExperience}
                  onChange={e => setSelectedExperience(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded bg-slate-800"
                >
                  {store.experience.map((job, idx) => (
                    <option key={`${job.company}-${idx}`} value={idx}>
                      {job.company} - {job.role}
                    </option>
                  ))}
                </select>

                {selectedExperienceData && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-slate-300">Company</label>
                        <input
                          className="w-full px-3 py-2 bg-slate-800 rounded"
                          value={selectedExperienceData.company}
                          onChange={e => {
                            const next = [...store.experience];
                            next[selectedExperience] = {
                              ...selectedExperienceData,
                              company: e.target.value,
                            };
                            setStore({ ...store, experience: next });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300">Role</label>
                        <input
                          className="w-full px-3 py-2 bg-slate-800 rounded"
                          value={selectedExperienceData.role}
                          onChange={e => {
                            const next = [...store.experience];
                            next[selectedExperience] = {
                              ...selectedExperienceData,
                              role: e.target.value,
                            };
                            setStore({ ...store, experience: next });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300">Dates</label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={selectedExperienceData.dates}
                        onChange={e => {
                          const next = [...store.experience];
                          next[selectedExperience] = {
                            ...selectedExperienceData,
                            dates: e.target.value,
                          };
                          setStore({ ...store, experience: next });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300">Description</label>
                      <textarea
                        className="w-full min-h-48 bg-slate-800 rounded p-3"
                        value={selectedExperienceData.description}
                        onChange={e => {
                          const next = [...store.experience];
                          next[selectedExperience] = {
                            ...selectedExperienceData,
                            description: e.target.value,
                          };
                          setStore({ ...store, experience: next });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300">
                        Skills (comma separated)
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-slate-800 rounded"
                        value={(selectedExperienceData.skills || []).join(', ')}
                        onChange={e => {
                          const next = [...store.experience];
                          next[selectedExperience] = {
                            ...selectedExperienceData,
                            skills: e.target.value
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean),
                          };
                          setStore({ ...store, experience: next });
                        }}
                        placeholder="Skills (comma separated)"
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {(showContent || showEducationOnly) && (
              <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Edit Education</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 rounded text-sm"
                      onClick={addEducation}
                    >
                      Add Education
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 rounded text-sm"
                      onClick={() => deleteEducation(selectedEducation)}
                      disabled={store.education.length === 0}
                    >
                      Delete Education
                    </button>
                  </div>
                </div>

                <label className="block text-sm text-slate-300">Choose education entry</label>
                <select
                  value={selectedEducation}
                  onChange={e => setSelectedEducation(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded bg-slate-800"
                >
                  {store.education.map((edu, idx) => (
                    <option key={`${edu.degree}-${idx}`} value={idx}>
                      {edu.degree} — {edu.institution}
                    </option>
                  ))}
                </select>

                {selectedEducationData && (
                  <div className="space-y-3">
                    <label className="block text-sm text-slate-300">
                      Degree title (e.g. Bachelor of Science)
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedEducationData.degreeTitle || ''}
                      onChange={e => {
                        const next = [...store.education];
                        next[selectedEducation] = {
                          ...selectedEducationData,
                          degreeTitle: e.target.value,
                        };
                        setStore({ ...store, education: next });
                      }}
                    />
                    <label className="block text-sm text-slate-300">Degree</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedEducationData.degree}
                      onChange={e => {
                        const next = [...store.education];
                        next[selectedEducation] = {
                          ...selectedEducationData,
                          degree: e.target.value,
                        };
                        setStore({ ...store, education: next });
                      }}
                    />

                    <label className="block text-sm text-slate-300">Institution</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedEducationData.institution || ''}
                      onChange={e => {
                        const next = [...store.education];
                        next[selectedEducation] = {
                          ...selectedEducationData,
                          institution: e.target.value,
                        };
                        setStore({ ...store, education: next });
                      }}
                    />

                    <label className="block text-sm text-slate-300">Results</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedEducationData.results || ''}
                      onChange={e => {
                        const next = [...store.education];
                        next[selectedEducation] = {
                          ...selectedEducationData,
                          results: e.target.value,
                        };
                        setStore({ ...store, education: next });
                      }}
                    />

                    <label className="block text-sm text-slate-300">Date range</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedEducationData.dateRange || ''}
                      onChange={e => {
                        const next = [...store.education];
                        next[selectedEducation] = {
                          ...selectedEducationData,
                          dateRange: e.target.value,
                        };
                        setStore({ ...store, education: next });
                      }}
                    />

                    <label className="block text-sm text-slate-300">
                      Description (separate paragraphs with a blank line)
                    </label>
                    <textarea
                      className="w-full min-h-40 bg-slate-800 rounded p-3"
                      value={(selectedEducationData.description || []).join('\n\n')}
                      onChange={e => {
                        const next = [...store.education];
                        // Preserve spaces exactly as the user types. Split paragraphs on blank lines,
                        // but do not trim paragraph content here to avoid removing intentional spaces.
                        next[selectedEducation] = {
                          ...selectedEducationData,
                          description: e.target.value.split(/\n\s*\n/),
                        };
                        setStore({ ...store, education: next });
                      }}
                    />
                  </div>
                )}
              </section>
            )}

            {(showContent || showEducationOnly) && (
              <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Edit Publications</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 rounded text-sm"
                      onClick={addPublication}
                    >
                      Add Publication
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 rounded text-sm"
                      onClick={() => deletePublication(selectedPublication)}
                      disabled={store.publications.length === 0}
                    >
                      Delete Publication
                    </button>
                  </div>
                </div>

                <label className="block text-sm text-slate-300">Choose publication</label>
                <select
                  value={selectedPublication}
                  onChange={e => setSelectedPublication(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded bg-slate-800"
                >
                  {store.publications.map((p, idx) => (
                    <option key={`${p.title}-${idx}`} value={idx}>
                      {p.title} — {p.authors}
                    </option>
                  ))}
                </select>

                {selectedPublicationData && (
                  <div className="space-y-3">
                    <label className="block text-sm text-slate-300">Title</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedPublicationData.title}
                      onChange={e => {
                        const next = [...store.publications];
                        next[selectedPublication] = {
                          ...selectedPublicationData,
                          title: e.target.value,
                        };
                        setStore({ ...store, publications: next });
                      }}
                    />

                    <label className="block text-sm text-slate-300">Authors</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedPublicationData.authors}
                      onChange={e => {
                        const next = [...store.publications];
                        next[selectedPublication] = {
                          ...selectedPublicationData,
                          authors: e.target.value,
                        };
                        setStore({ ...store, publications: next });
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-slate-300">Venue</label>
                        <input
                          className="w-full px-3 py-2 bg-slate-800 rounded"
                          value={selectedPublicationData.venue}
                          onChange={e => {
                            const next = [...store.publications];
                            next[selectedPublication] = {
                              ...selectedPublicationData,
                              venue: e.target.value,
                            };
                            setStore({ ...store, publications: next });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300">Year</label>
                        <input
                          className="w-full px-3 py-2 bg-slate-800 rounded"
                          value={selectedPublicationData.year}
                          onChange={e => {
                            const next = [...store.publications];
                            next[selectedPublication] = {
                              ...selectedPublicationData,
                              year: e.target.value,
                            };
                            setStore({ ...store, publications: next });
                          }}
                        />
                      </div>
                    </div>

                    <label className="block text-sm text-slate-300">URL</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedPublicationData.url || ''}
                      onChange={e => {
                        const next = [...store.publications];
                        next[selectedPublication] = {
                          ...selectedPublicationData,
                          url: e.target.value,
                        };
                        setStore({ ...store, publications: next });
                      }}
                    />

                    <label className="block text-sm text-slate-300">DOI</label>
                    <input
                      className="w-full px-3 py-2 bg-slate-800 rounded"
                      value={selectedPublicationData.doi || ''}
                      onChange={e => {
                        const next = [...store.publications];
                        next[selectedPublication] = {
                          ...selectedPublicationData,
                          doi: e.target.value,
                        };
                        setStore({ ...store, publications: next });
                      }}
                    />
                  </div>
                )}
              </section>
            )}

            <button className="px-6 py-3 bg-green-600 rounded" onClick={saveContent}>
              Save all changes
            </button>
          </>
        )}

        {showMetrics && (
          <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Projects Dashboard (GitHub)</h2>
              <button className="px-4 py-2 bg-blue-600 rounded" onClick={loadMetrics}>
                Refresh Metrics
              </button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {metrics.map(metric => (
                <article
                  key={`${metric.owner}/${metric.repo}`}
                  className="bg-slate-800 rounded p-3"
                >
                  <h3 className="font-semibold">{metric.projectName || metric.repo}</h3>
                  <p className="text-sm text-slate-300">
                    {metric.owner}/{metric.repo}
                  </p>
                  <p>Total Issues: {metric.totalIssues}</p>
                  <p>
                    Open: {metric.openIssues} | Closed: {metric.closedIssues}
                  </p>
                  <p>Completion: {metric.completionRate}%</p>
                  <p>Avg Close Time: {metric.avgCloseTimeDays} days</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
