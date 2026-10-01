import { useState } from 'react';
import { useProjects } from './context/ProjectContext';

export function ProjectModal({ isOpen, onClose, isDark }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tagsInput, setTagsInput] = useState('');

  const { addProject } = useProjects();
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a project title');
      return;
    }

    if (dueDate && dueDate < today) {
      alert('Due date cannot be in the past');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    addProject(title.trim(), description.trim(), dueDate, priority, parsedTags);

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-colors ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Create New Project
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`text-lg p-1 rounded-lg transition-all cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Project Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile Application V2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:border-indigo-500 focus:ring-2 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-100'
              }`}
              required
              autoFocus
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description about this project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:border-indigo-500 focus:ring-2 resize-none ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-100'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:border-indigo-500 ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent 🔥</option>
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
                className={`w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:border-indigo-500 ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Design, Frontend, API"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={`w-full px-4 py-2 text-sm rounded-xl border focus:outline-none focus:border-indigo-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                  : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer ${
                isDark ? 'shadow-black/40' : 'shadow-indigo-500/20'
              }`}
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;