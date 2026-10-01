import { useState, useEffect, useRef } from 'react';
import { useProjects } from './context/ProjectContext';
import { playTone, triggerConfetti } from './utils/fx';

export function ProjectItem({ project, isDark, themeColor, isHighlighted, onTagClick, onStartFocus, onOpenDetail }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const menuRef = useRef(null);
  const {
    deleteProject,
    cloneProject,
    togglePinProject,
    addTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
  } = useProjects();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    if (!isMenuOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 230);
    }
    setIsMenuOpen((prev) => !prev);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    addTask(project.id, taskText);
    setTaskText('');
  };

  const completedCount = project.tasks?.filter((t) => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const isFullyCompleted = totalTasks > 0 && completedCount === totalTasks;

  const handleToggleTask = (taskId, currentlyCompleted) => {
    toggleTask(project.id, taskId);
    if (!currentlyCompleted) {
      const willBeCompletedCount = completedCount + 1;
      if (willBeCompletedCount === totalTasks && totalTasks > 0) {
        triggerConfetti();
        playTone('complete');
      } else {
        playTone('task');
      }
    }
  };

  const handleCopyMarkdown = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const taskList = (project.tasks || [])
      .map((t) => `- [${t.completed ? 'x' : ' '}] ${t.text}`)
      .join('\n');

    const summary = `# ${project.title}\n${project.description ? project.description + '\n' : ''}Priority: ${
      project.priority || 'Medium'
    }\nDue Date: ${project.dueDate || 'None'}\n\n### Tasks\n${taskList || 'No tasks listed.'}`;

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const colorClasses = {
    indigo: 'bg-indigo-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    rose: 'bg-rose-600',
  };

  const currentThemeBg = colorClasses[themeColor] || 'bg-indigo-600';

  const priorityStyles = {
    Low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    Medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    High: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  const priorityBorderColors = {
    Low: 'border-l-slate-400',
    Medium: 'border-l-blue-500',
    High: 'border-l-amber-500',
    Urgent: 'border-l-rose-500',
  };

  const getDueStatus = (dateStr) => {
    if (!dateStr) return null;
    const diffTime = new Date(dateStr) - new Date(today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: 'Overdue',
        badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse',
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Due Today',
        badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      };
    }
    if (diffDays === 1) {
      return {
        label: 'Tomorrow',
        badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      };
    }
    return {
      label: `${diffDays}d left`,
      badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };
  };

  const dueStatus = getDueStatus(project.dueDate);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', String(project.id));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <li
      id={`project-${project.id}`}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onOpenDetail && onOpenDetail(project.id)}
      className={`rounded-2xl border border-l-4 p-4 sm:p-5 shadow-sm transition-all duration-300 list-none flex flex-col justify-between relative group hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
        priorityBorderColors[project.priority || 'Medium']
      } ${
        isFullyCompleted
          ? isDark
            ? 'ring-1 ring-emerald-500/40 bg-slate-800/90 shadow-emerald-500/5'
            : 'ring-1 ring-emerald-500/40 bg-emerald-50/10 shadow-emerald-500/10'
          : ''
      } ${
        project.isPinned
          ? isDark
            ? 'border-amber-400/50 bg-slate-800/95'
            : 'border-amber-400/60 bg-amber-50/15'
          : isDark
          ? 'bg-slate-800 border-slate-700/80 text-white'
          : 'bg-white border-slate-200/80 text-slate-800'
      } ${
        isHighlighted
          ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-indigo-500/20'
          : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {project.isPinned && (
                <span className="text-xs text-amber-400" title="Pinned Project">
                  ⭐
                </span>
              )}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  priorityStyles[project.priority || 'Medium']
                }`}
              >
                {project.priority || 'Medium'}
              </span>

              {dueStatus && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${dueStatus.badge}`}
                >
                  <span>📅</span>
                  <span>{dueStatus.label}</span>
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold truncate hover:text-indigo-400 transition-colors">
              {project.title}
            </h3>

            {project.description && (
              <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {project.description}
              </p>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5" onClick={(e) => e.stopPropagation()}>
                {project.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => onTagClick && onTagClick(tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all hover:scale-105 cursor-pointer ${
                      isDark
                        ? 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => togglePinProject(project.id)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  project.isPinned
                    ? 'text-amber-400'
                    : 'text-slate-400 hover:text-amber-400 opacity-0 group-hover:opacity-100'
                }`}
                title={project.isPinned ? 'Unpin' : 'Pin to top'}
              >
                ⭐
              </button>

              <button
                onClick={handleToggleMenu}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title="More actions"
              >
                ⋮
              </button>
            </div>

            {isMenuOpen && (
              <div
                className={`absolute right-0 ${
                  openUpward ? 'bottom-8' : 'top-8'
                } w-44 rounded-xl shadow-2xl border p-1 z-30 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200 shadow-black/60' : 'bg-white border-slate-200 text-slate-700 shadow-slate-300/60'
                }`}
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenDetail && onOpenDetail(project.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
                    isDark ? 'hover:bg-slate-700 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>🔍</span>
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onStartFocus && onStartFocus(project);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
                    isDark ? 'hover:bg-slate-700 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>⏱</span>
                  <span>Focus Timer</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    cloneProject(project.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
                    isDark ? 'hover:bg-slate-700 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>📑</span>
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
                    isDark ? 'hover:bg-slate-700 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{isCopied ? '✓' : '📋'}</span>
                  <span>{isCopied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>

                <div className={`my-1 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`} />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    deleteProject(project.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all text-left cursor-pointer"
                >
                  <span>🗑</span>
                  <span>Delete Project</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={`my-3 border-t ${isDark ? 'border-slate-700/80' : 'border-slate-100'}`} />

        <div className="mb-3">
          <div className={`flex justify-between items-center text-xs mb-1.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div
              className={`${isFullyCompleted ? 'bg-emerald-500' : currentThemeBg} h-1.5 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsTasksExpanded((prev) => !prev)}
            className={`w-full flex items-center justify-between py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isDark ? 'hover:bg-slate-700/60 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className={`inline-block transition-transform duration-200 ${isTasksExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
              <span>Quick Tasks</span>
              <span className="opacity-60 text-[11px]">({completedCount}/{totalTasks})</span>
            </span>

            {isFullyCompleted && (
              <span className="text-[10px] text-emerald-500 font-bold tracking-wide">
                Done 🎉
              </span>
            )}
          </button>

          {isTasksExpanded && (
            <div className="pt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New task..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-3 py-1.5 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer ${currentThemeBg}`}
                >
                  +
                </button>
              </form>

              <ul className="space-y-1 p-0 max-h-36 overflow-y-auto">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between p-1.5 rounded-lg group transition-all ${
                        isDark ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <label className={`flex items-center gap-2 cursor-pointer text-xs font-medium select-none truncate ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id, task.completed)}
                          className="w-3.5 h-3.5 rounded border-slate-300 cursor-pointer accent-indigo-600"
                        />
                        <span className={`truncate ${task.completed ? 'line-through opacity-40' : ''}`}>
                          {task.text || task.title}
                        </span>
                      </label>

                      <button
                        onClick={() => deleteTask(project.id, task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 text-xs transition-all p-0.5 cursor-pointer"
                      >
                        ✕
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-1 text-center">No tasks added yet.</p>
                )}
              </ul>

              {completedCount > 0 && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => clearCompletedTasks(project.id)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Clear completed tasks
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProjectItem;