import { useState, useEffect } from 'react';
import { useProjects } from './context/ProjectContext';
import { ProjectItem } from './ProjectItem';
import { ProjectModal } from './ProjectModal';
import { SettingsModal } from './SettingsModal';
import { SearchModal } from './SearchModal';
import { ShortcutsModal } from './ShortcutsModal';

function App() {
  const { projects } = useProjects();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [highlightedProjectId, setHighlightedProjectId] = useState(null);

  const [settings, setSettings] = useState({
    themeColor: 'indigo',
    layout: 'grid',
    isCompact: false,
    language: 'en',
    isDark: true,
    notifications: true,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputActive =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable;

      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsProjectModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsShortcutsModalOpen(false);
        return;
      }

      if (
        (e.code === 'KeyK' && (e.altKey || e.ctrlKey || e.metaKey)) ||
        (e.key === '/' && !isInputActive)
      ) {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
        return;
      }

      if (e.key.toLowerCase() === 'n' && !isInputActive) {
        e.preventDefault();
        setIsProjectModalOpen(true);
        return;
      }

      if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const colorClasses = {
    indigo: 'bg-indigo-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    rose: 'bg-rose-600',
  };

  const currentThemeBg = colorClasses[settings.themeColor] || 'bg-indigo-600';

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const totalCompletedTasks = projects.reduce(
    (acc, p) => acc + (p.tasks?.filter((t) => t.completed).length || 0),
    0
  );
  const overdueCount = projects.filter((p) => p.dueDate && p.dueDate < todayStr).length;

  const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        (project.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (project.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag ? (project.tags || []).includes(selectedTag) : true;

      const pTotal = project.tasks?.length || 0;
      const pCompleted = project.tasks?.filter((t) => t.completed).length || 0;
      const isCompleted = pTotal > 0 && pCompleted === pTotal;

      if (!matchesTag) return false;
      if (filterStatus === 'completed') return matchesSearch && isCompleted;
      if (filterStatus === 'in-progress') return matchesSearch && !isCompleted;

      return matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (sortBy === 'newest') return String(b.id).localeCompare(String(a.id));
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'priority') {
        const weightA = priorityWeights[a.priority] || 2;
        const weightB = priorityWeights[b.priority] || 2;
        return weightB - weightA;
      }
      if (sortBy === 'progress') {
        const getPct = (p) =>
          p.tasks?.length ? (p.tasks.filter((t) => t.completed).length / p.tasks.length) * 100 : 0;
        return getPct(b) - getPct(a);
      }
      return 0;
    });

  const getStage = (project) => {
    const total = project.tasks?.length || 0;
    const completed = project.tasks?.filter((t) => t.completed).length || 0;
    if (total === 0 || completed === 0) return 'todo';
    if (completed === total) return 'completed';
    return 'in-progress';
  };

  const boardColumns = [
    { id: 'todo', label: 'To Do', color: 'border-slate-400 text-slate-400' },
    { id: 'in-progress', label: 'In Progress', color: 'border-blue-500 text-blue-500' },
    { id: 'completed', label: 'Completed', color: 'border-emerald-500 text-emerald-500' },
  ];

  return (
    <div
      className={`min-h-screen py-10 px-4 sm:px-8 relative transition-colors duration-300 ${
        settings.isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <header
          className={`flex items-center justify-between mb-8 pb-4 border-b ${
            settings.isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${currentThemeBg} flex items-center justify-center text-white shadow-lg font-bold text-xl transition-colors`}
            >
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Planino</h1>
              <p className={`text-xs font-medium ${settings.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Workspace & Agile Kanban Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className={`flex items-center gap-2 ${currentThemeBg} hover:opacity-90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer`}
            >
              <span>+ New Project</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 font-mono">N</kbd>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div
            className={`p-4 rounded-2xl border transition-all ${
              settings.isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Projects</p>
            <p className="text-2xl font-black mt-1">{totalProjects}</p>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all ${
              settings.isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-black mt-1">{totalTasks}</p>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all ${
              settings.isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">{totalCompletedTasks}</p>
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all ${
              settings.isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overdue Alerts</p>
            <p className={`text-2xl font-black mt-1 ${overdueCount > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
              {overdueCount}
            </p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`p-1 rounded-xl flex gap-1 ${
                settings.isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200/60'
              }`}
            >
              {['all', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    filterStatus === status
                      ? settings.isDark
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>

            {selectedTag && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-semibold">
                <span>#{selectedTag}</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="hover:opacity-70 cursor-pointer ml-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-1 rounded-xl flex gap-1 ${
                settings.isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200/60'
              }`}
            >
              {[
                { id: 'grid', label: 'Grid ▦' },
                { id: 'board', label: 'Board 📋' },
                { id: 'list', label: 'List ☰' },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSettings((s) => ({ ...s, layout: view.id }))}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    settings.layout === view.id
                      ? settings.isDark
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl outline-none border cursor-pointer ${
                  settings.isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="progress">Progress Rate</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          {projects.length === 0 ? (
            <div
              className={`text-center py-16 rounded-2xl border border-dashed ${
                settings.isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-400'
                  : 'bg-white border-slate-300 text-slate-500'
              }`}
            >
              <p className="font-medium text-sm">No projects found. Press "N" to create one! 🚀</p>
            </div>
          ) : settings.layout === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {boardColumns.map((col) => {
                const colProjects = filteredAndSortedProjects.filter(
                  (p) => getStage(p) === col.id
                );
                return (
                  <div
                    key={col.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      settings.isDark
                        ? 'bg-slate-800/40 border-slate-800'
                        : 'bg-slate-100/60 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/20">
                      <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                        {col.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          settings.isDark
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {colProjects.length}
                      </span>
                    </div>

                    <ul className="space-y-4 p-0">
                      {colProjects.map((project) => (
                        <ProjectItem
                          key={project.id}
                          project={project}
                          isDark={settings.isDark}
                          themeColor={settings.themeColor}
                          isHighlighted={project.id === highlightedProjectId}
                          onTagClick={(tag) => setSelectedTag(tag)}
                        />
                      ))}
                      {colProjects.length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-6 italic">No projects</p>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <ul
              className={
                settings.layout === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0'
                  : 'flex flex-col gap-4 max-w-2xl mx-auto p-0'
              }
            >
              {filteredAndSortedProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  isDark={settings.isDark}
                  themeColor={settings.themeColor}
                  isHighlighted={project.id === highlightedProjectId}
                  onTagClick={(tag) => setSelectedTag(tag)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className={`fixed bottom-6 right-6 flex items-center gap-2 p-1.5 rounded-full border shadow-xl backdrop-blur-md z-40 transition-all ${
          settings.isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'
        }`}
      >
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
            settings.isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Shortcuts (?)"
        >
          ⌨️
        </button>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
            settings.isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Search (/ or Alt+K)"
        >
          🔍
        </button>

        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all hover:rotate-45 cursor-pointer ${
            settings.isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        projects={projects}
        onSelectProject={(project) => {
          setHighlightedProjectId(project.id);
          setTimeout(() => {
            const el = document.getElementById(`project-${project.id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          setTimeout(() => {
            setHighlightedProjectId(null);
          }, 2500);
        }}
        isDark={settings.isDark}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        isDark={settings.isDark}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        isDark={settings.isDark}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetData={handleResetData}
      />
    </div>
  );
}

export default App;