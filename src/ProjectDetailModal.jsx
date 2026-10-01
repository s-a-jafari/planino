import { useState } from 'react';
import { useProjects } from './context/ProjectContext';
import { playTone, triggerConfetti } from './utils/fx';

export function ProjectDetailModal({ isOpen, onClose, projectId, isDark, themeColor, onStartFocus }) {
  const { projects, editProject, addTask, toggleTask, deleteTask, editTask, cloneProject, deleteProject } = useProjects();
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskValue, setEditingTaskValue] = useState('');

  if (!isOpen || !projectId) return null;

  const project = projects.find((p) => String(p.id) === String(projectId));
  if (!project) return null;

  const completedCount = project.tasks?.filter((t) => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(project.id, newTaskText);
    setNewTaskText('');
  };

  const handleStartTaskEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskValue(task.text || task.title || '');
  };

  const handleSaveTaskEdit = (taskId) => {
    if (editingTaskValue.trim()) {
      editTask(project.id, taskId, editingTaskValue.trim());
    }
    setEditingTaskId(null);
  };

  const handleToggle = (taskId, currentlyCompleted) => {
    toggleTask(project.id, taskId);
    if (!currentlyCompleted) {
      if (completedCount + 1 === totalTasks && totalTasks > 0) {
        triggerConfetti();
        playTone('complete');
      } else {
        playTone('task');
      }
    }
  };

  const priorityStyles = {
    Low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    Medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    High: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-3xl rounded-3xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden transition-all ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/30">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityStyles[project.priority || 'Medium']}`}>
              {project.priority || 'Medium'}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID-{project.id.slice(-4)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onStartFocus && onStartFocus(project);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>⏱</span>
              <span>Focus</span>
            </button>
            <button
              onClick={onClose}
              className={`text-sm p-1.5 rounded-lg transition-all cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/20">
          <div className="p-6 md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {project.description || 'No description provided for this project.'}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-2 font-medium">
                <span className="text-slate-400">Completion Status</span>
                <span className="font-bold">{progressPercentage}%</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Checklist ({completedCount}/{totalTasks})
              </h3>

              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add item to checklist..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Add
                </button>
              </form>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border group transition-all ${
                        isDark ? 'border-slate-700/50 hover:bg-slate-700/30' : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggle(task.id, task.completed)}
                          className="w-4 h-4 rounded border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
                        />
                        {editingTaskId === task.id ? (
                          <input
                            type="text"
                            value={editingTaskValue}
                            onChange={(e) => setEditingTaskValue(e.target.value)}
                            onBlur={() => handleSaveTaskEdit(task.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTaskEdit(task.id)}
                            autoFocus
                            className={`w-full px-2 py-0.5 text-xs rounded border outline-none ${
                              isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-300'
                            }`}
                          />
                        ) : (
                          <span
                            onDoubleClick={() => handleStartTaskEdit(task)}
                            className={`text-xs truncate cursor-pointer ${
                              task.completed ? 'line-through opacity-40 text-slate-400' : ''
                            }`}
                          >
                            {task.text || task.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartTaskEdit(task)}
                          className="p-1 text-slate-400 hover:text-indigo-400 text-xs cursor-pointer"
                          title="Edit Task"
                        >
                          ✏
                        </button>
                        <button
                          onClick={() => deleteTask(project.id, task.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 text-xs cursor-pointer"
                          title="Delete Task"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No checklist items yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 bg-slate-500/5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Priority</p>
              <select
                value={project.priority || 'Medium'}
                onChange={(e) => editProject(project.id, { priority: e.target.value })}
                className={`w-full px-3 py-1.5 text-xs font-semibold rounded-xl border outline-none cursor-pointer ${
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Due Date</p>
              <input
                type="date"
                value={project.dueDate || ''}
                onChange={(e) => editProject(project.id, { dueDate: e.target.value })}
                className={`w-full px-3 py-1.5 text-xs font-semibold rounded-xl border outline-none cursor-pointer ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No tags</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/20 space-y-2">
              <button
                onClick={() => {
                  cloneProject(project.id);
                  onClose();
                }}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isDark ? 'border-slate-700 hover:bg-slate-700 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Duplicate Project 📑
              </button>

              <button
                onClick={() => {
                  deleteProject(project.id);
                  onClose();
                }}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
              >
                Delete Project 🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailModal;