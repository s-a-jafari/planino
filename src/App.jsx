import { useState, useEffect } from 'react';
import { useProjects } from './context/ProjectContext';
import { ProjectItem } from './ProjectItem';
import { ProjectModal } from './ProjectModal';
import { SettingsModal } from './SettingsModal';
import { SearchModal } from './SearchModal';
import { ShortcutsModal } from './ShortcutsModal';
import { ActivityModal } from './ActivityModal';
import { playTone, triggerConfetti } from './utils/fx';

function App() {
  const {
    projects,
    activities,
    lastDeletedProject,
    clearActivities,
    moveProjectStage,
    importProjects,
    undoDelete,
  } = useProjects();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [smartFilter, setSmartFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [highlightedProjectId, setHighlightedProjectId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [isZenMode, setIsZenMode] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const [focusProject, setFocusProject] = useState(null);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);

  const [settings, setSettings] = useState({
    themeColor: 'indigo',
    layout: 'grid',
    isCompact: false,
    language: 'en',
    isDark: true,
    notifications: true,
  });

  const showToast = (msg, canUndo = false) => {
    setToastMessage({ text: msg, canUndo });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleTriggerUndo = () => {
    if (undoDelete()) {
      showToast('Project restored successfully');
      playTone('task');
    }
  };

  useEffect(() => {
    if (lastDeletedProject) {
      showToast(`Deleted "${lastDeletedProject.title}"`, true);
    }
  }, [lastDeletedProject]);

  useEffect(() => {
    let timer = null;
    if (isFocusActive && focusSeconds > 0) {
      timer = setInterval(() => {
        setFocusSeconds((prev) => prev - 1);
      }, 1000);
    } else if (focusSeconds === 0 && isFocusActive) {
      setIsFocusActive(false);
      playTone('complete');
      triggerConfetti();
      showToast(`Focus session completed for "${focusProject?.title}" 🎉`);
    }
    return () => clearInterval(timer);
  }, [isFocusActive, focusSeconds, focusProject]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputActive =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !isInputActive) {
        e.preventDefault();
        handleTriggerUndo();
        return;
      }

      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsProjectModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsActivityModalOpen(false);
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
  }, [lastDeletedProject]);

  const handleExecuteCommand = (action) => {
    switch (action) {
      case 'NEW_PROJECT':
        setIsProjectModalOpen(true);
        break;
      case 'TOGGLE_ZEN':
        setIsZenMode((prev) => !prev);
        showToast(isZenMode ? 'Exited Zen Mode' : 'Entered Zen Mode');
        break;
      case 'VIEW_BOARD':
        setSettings((s) => ({ ...s, layout: 'board' }));
        showToast('Switched to Board View');
        break;
      case 'VIEW_GRID':
        setSettings((s) => ({ ...s, layout: 'grid' }));
        showToast('Switched to Grid View');
        break;
      case 'VIEW_LIST':
        setSettings((s) => ({ ...s, layout: 'list' }));
        showToast('Switched to List View');
        break;
      case 'TOGGLE_THEME':
        setSettings((s) => ({ ...s, isDark: !s.isDark }));
        showToast('Theme updated');
        break;
      case 'OPEN_ACTIVITY':
        setIsActivityModalOpen(true);
        break;
      case 'UNDO_DELETE':
        handleTriggerUndo();
        break;
      case 'EXPORT_JSON': {
        const dataStr =
          'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute(
          'download',
          `planino-backup-${new Date().toISOString().split('T')[0]}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Workspace backup downloaded');
        break;
      }
      default:
        break;
    }
  };

  const handleLoadDemoData = () => {
    const demoData = [
      {
        id: 'demo-1',
        title: 'Authentication Microservice 🛡️',
        description: 'Implement OAuth2 and session token rotation.',
        dueDate: '2026-10-30',
        priority: 'Urgent',
        tags: ['Backend', 'Security'],
        isPinned: true,
        createdAt: new Date().toISOString(),
        tasks: [
          { id: 't1', text: 'JWT middleware', completed: true },
          { id: 't2', text: 'Refresh token revocation', completed: true },
          { id: 't3', text: 'Audit logging endpoints', completed: false },
        ],
      },
      {
        id: 'demo-2',
        title: 'Design System Overhaul 🎨',
        description: 'Audit color tokens and unify border radii across modals.',
        dueDate: '2026-10-03',
        priority: 'High',
        tags: ['Design', 'UI'],
        isPinned: false,
        createdAt: new Date().toISOString(),
        tasks: [
          { id: 't4', text: 'Sync Tailwind config', completed: true },
          { id: 't5', text: 'Review typography hierarchy', completed: false },
        ],
      },
      {
        id: 'demo-3',
        title: 'Performance Benchmark ⚡',
        description: 'Profile render cycles and reduce unnecessary Context updates.',
        dueDate: '2026-11-05',
        priority: 'Medium',
        tags: ['Performance', 'React'],
        isPinned: false,
        createdAt: new Date().toISOString(),
        tasks: [
          { id: 't6', text: 'Audit bundle size', completed: false },
          { id: 't7', text: 'Benchmark memoized selectors', completed: false },
        ],
      },
    ];

    importProjects(demoData);
    showToast('Loaded demo dataset successfully');
  };

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

      const matchesSmartFilter = (() => {
        if (smartFilter === 'pinned') return project.isPinned;
        if (smartFilter === 'urgent') return project.priority === 'Urgent';
        if (smartFilter === 'overdue') return project.dueDate && project.dueDate < todayStr;
        if (smartFilter === 'dueSoon') {
          if (!project.dueDate) return false;
          const diffDays = Math.ceil(
            (new Date(project.dueDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24)
          );
          return diffDays >= 0 && diffDays <= 3;
        }
        return true;
      })();

      if (!matchesSmartFilter) return false;
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

  const handleDropToColumn = (e, targetStage) => {
    e.preventDefault();
    setDragOverCol(null);
    const projectId = e.dataTransfer.getData('text/plain');
    if (!projectId) return;

    moveProjectStage(projectId, targetStage);

    if (targetStage === 'completed') {
      triggerConfetti();
      playTone('complete');
    } else {
      playTone('task');
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`min-h-screen py-6 px-4 sm:px-8 relative transition-colors duration-300 ${
        settings.isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-2xl bg-indigo-600 text-white text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <span>✨</span>
          <span>{toastMessage.text}</span>
          {toastMessage.canUndo && (
            <button
              onClick={handleTriggerUndo}
              className="ml-2 px-2 py-0.5 rounded bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-all cursor-pointer"
            >
              Undo ↩️
            </button>
          )}
        </div>
      )}

      <div className={isZenMode ? 'w-full' : 'max-w-6xl mx-auto'}>
        <header
          className={`flex items-center justify-between mb-6 pb-4 border-b ${
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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Planino</h1>
              {!isZenMode && (
                <p className={`text-xs font-medium ${settings.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Workspace & Agile Kanban Suite
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZenMode((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isZenMode
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : settings.isDark
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Zen Mode"
            >
              {isZenMode ? '🧘 Exit Zen' : '🧘 Zen'}
            </button>

            <button
              onClick={() => setIsProjectModalOpen(true)}
              className={`flex items-center gap-2 ${currentThemeBg} hover:opacity-90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer`}
            >
              <span>+ New Project</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 font-mono">N</kbd>
            </button>
          </div>
        </header>

        {focusProject && (
          <div
            className={`mb-6 p-3 rounded-2xl border flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
              settings.isDark ? 'bg-slate-800/90 border-indigo-500/40' : 'bg-white border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <p className="text-xs font-semibold">Focus Session: {focusProject.title}</p>
                <p className="text-[11px] text-slate-400">Pomodoro Deep Work Mode</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-indigo-500">{formatTimer(focusSeconds)}</span>

              <button
                onClick={() => setIsFocusActive((prev) => !prev)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                  isFocusActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isFocusActive ? 'Pause' : 'Start'}
              </button>

              <button
                onClick={() => {
                  setIsFocusActive(false);
                  setFocusSeconds(25 * 60);
                }}
                className={`px-2 py-1 rounded-xl text-xs font-medium cursor-pointer ${
                  settings.isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Reset
              </button>

              <button
                onClick={() => {
                  setIsFocusActive(false);
                  setFocusProject(null);
                }}
                className="text-slate-400 hover:text-rose-500 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {!isZenMode && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
        )}

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

            <div
              className={`p-1 rounded-xl flex items-center gap-1 ${
                settings.isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-100'
              }`}
            >
              {[
                { id: 'all', label: 'All' },
                { id: 'pinned', label: '⭐ Pinned' },
                { id: 'urgent', label: '🔥 Urgent' },
                { id: 'overdue', label: '⚠️ Overdue' },
                { id: 'dueSoon', label: '⏳ Due Soon' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSmartFilter(chip.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    smartFilter === chip.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {chip.label}
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
              className={`text-center py-16 px-4 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3 ${
                settings.isDark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-400'
                  : 'bg-white border-slate-300 text-slate-500'
              }`}
            >
              <p className="font-semibold text-sm">Your workspace is clean and empty!</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md cursor-pointer ${currentThemeBg}`}
                >
                  + Create New Project
                </button>
                <button
                  onClick={handleLoadDemoData}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    settings.isDark
                      ? 'border-slate-700 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  ⚡ Load Demo Projects
                </button>
              </div>
            </div>
          ) : settings.layout === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {boardColumns.map((col) => {
                const colProjects = filteredAndSortedProjects.filter(
                  (p) => getStage(p) === col.id
                );
                const isOver = dragOverCol === col.id;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverCol(col.id);
                    }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={(e) => handleDropToColumn(e, col.id)}
                    className={`rounded-2xl border p-4 transition-all min-h-[350px] ${
                      isOver
                        ? 'border-dashed border-indigo-500 scale-[1.01] bg-indigo-500/5'
                        : settings.isDark
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
                          onStartFocus={(p) => {
                            setFocusProject(p);
                            setFocusSeconds(25 * 60);
                            setIsFocusActive(true);
                          }}
                        />
                      ))}
                      {colProjects.length === 0 && (
                        <div className="flex items-center justify-center py-16 border border-dashed rounded-xl border-slate-700/20 text-xs text-slate-400 italic">
                          Drop cards here
                        </div>
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
                  onStartFocus={(p) => {
                    setFocusProject(p);
                    setFocusSeconds(25 * 60);
                    setIsFocusActive(true);
                  }}
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
          onClick={() => setIsZenMode((prev) => !prev)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
            isZenMode ? 'text-amber-400' : settings.isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Toggle Zen Mode"
        >
          🧘
        </button>

        <button
          onClick={() => setIsActivityModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
            settings.isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Activity Log"
        >
          📜
        </button>

        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
            settings.isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Shortcuts (?)"
        >
          ⌨️
        </button>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
            settings.isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Command Palette (/ or Alt+K)"
        >
          🔍
        </button>

        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all hover:rotate-45 cursor-pointer ${
            settings.isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
        onExecuteCommand={handleExecuteCommand}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        isDark={settings.isDark}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={activities}
        onClear={clearActivities}
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