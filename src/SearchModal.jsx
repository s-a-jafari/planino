import { useState } from 'react';

export function SearchModal({ isOpen, onClose, projects, onSelectProject, isDark }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const searchResults = (projects || []).filter((project) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      (project.title?.toLowerCase() || '').includes(term) ||
      (project.description?.toLowerCase() || '').includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl p-4 shadow-2xl border transition-all ${
        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        <div className="flex items-center gap-3 pb-3 border-b border-slate-700/30">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 text-slate-400 cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
          {searchTerm.trim() === '' ? (
            <p className="text-xs text-slate-400 text-center py-6">Type something to search...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No matching projects found.</p>
          ) : (
            searchResults.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onSelectProject(project);
                  onClose();
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{project.title}</p>
                  {project.description && (
                    <p className="text-xs text-slate-400 truncate max-w-xs">{project.description}</p>
                  )}
                </div>
                <span className="text-xs text-indigo-400 font-medium">View →</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;