import { useState, useEffect } from 'react';
import { useProjects } from './context/ProjectContext';

export function ProjectItem({ project, isDark, themeColor, isHighlighted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || '');
  const [dueDate, setDueDate] = useState(project.dueDate || '');
  const [priority, setPriority] = useState(project.priority || 'Medium');
  const [tagsInput, setTagsInput] = useState((project.tags || []).join(', '));
  const [taskText, setTaskText] = useState('');

  const {
    deleteProject,
    cloneProject,
    editProject,
    addTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
  } = useProjects();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setTitle(project.title);
    setDescription(project.description || '');
    setDueDate(project.dueDate || '');
    setPriority(project.priority || 'Medium');
    setTagsInput((project.tags || []).join(', '));
  }, [project]);

  const handleStartEdit = () => {
    setTitle(project.title);
    setDescription(project.description || '');
    setDueDate(project.dueDate || '');
    setPriority(project.priority || 'Medium');
    setTagsInput((project.tags || []).join(', '));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTitle(project.title);
    setDescription(project.description || '');
    setDueDate(project.dueDate || '');
    setPriority(project.priority || 'Medium');
    setTagsInput((project.tags || []).join(', '));
    setIsEditing(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (dueDate && dueDate < today) {
      alert('Due date cannot be in the past');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    editProject(project.id, {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      tags: parsedTags,
    });
    setIsEditing(false);
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

  return (
    <li
      id={`project-${project.id}`}
      className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 list-none flex flex-col justify-between ${
        isHighlighted
          ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-lg shadow-indigo-500/20'
          : ''
      } ${
        isDark ? 'bg-slate-800 border-slate-700/80 text-white' : 'bg-white border-slate-200/80 text-slate-800'
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
              autoFocus
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none resize-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-2 py-1.5 text-xs rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Due Date
              </label>
              <input
                type="date"
                min={today}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-2 py-1.5 text-xs rounded-lg border focus:outline-none ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Save 💾
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
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

              <h3
                onClick={handleStartEdit}
                className="text-lg font-bold cursor-pointer hover:opacity-85 transition-opacity"
              >
                {project.title}
              </h3>

              {project.description && (
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {project.description}
                </p>
              )}

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => cloneProject(project.id)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                title="Clone Project"
              >
                📋
              </button>
              <button
                onClick={handleStartEdit}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-700' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>

          <div className={`my-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`} />

          <div className="mb-4">
            <div className={`flex justify-between items-center text-xs mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div
                className={`${isFullyCompleted ? 'bg-emerald-500' : currentThemeBg} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {isFullyCompleted && (
              <div className="mt-2 text-center py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[11px] font-semibold border border-emerald-500/20">
                All tasks finished! 🎉
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tasks ({completedCount}/{totalTasks})
              </h4>
              {completedCount > 0 && (
                <button
                  onClick={() => clearCompletedTasks(project.id)}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear Done
                </button>
              )}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add a new task..."
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
                + Add
              </button>
            </form>

            <ul className="space-y-1.5 p-0">
              {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`flex items-center justify-between p-2 rounded-xl group transition-all ${
                      isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <label className={`flex items-center gap-2.5 cursor-pointer text-xs font-medium select-none ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(project.id, task.id)}
                        className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                      />
                      <span className={task.completed ? 'line-through opacity-40' : ''}>
                        {task.text || task.title}
                      </span>
                    </label>

                    <button
                      onClick={() => deleteTask(project.id, task.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 text-xs transition-all p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-1">No tasks yet.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export default ProjectItem;