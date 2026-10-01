import { useState, useEffect } from 'react';

export function SearchModal({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  isDark,
  onExecuteCommand,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'cmd-new', label: 'Create New Project', icon: '✨', action: 'NEW_PROJECT' },
    { id: 'cmd-zen', label: 'Toggle Zen Mode', icon: '🧘', action: 'TOGGLE_ZEN' },
    { id: 'cmd-board', label: 'Switch to Board View', icon: '📋', action: 'VIEW_BOARD' },
    { id: 'cmd-grid', label: 'Switch to Grid View', icon: '▦', action: 'VIEW_GRID' },
    { id: 'cmd-list', label: 'Switch to List View', icon: '☰', action: 'VIEW_LIST' },
    { id: 'cmd-theme', label: 'Toggle Dark / Light Mode', icon: '🌓', action: 'TOGGLE_THEME' },
    { id: 'cmd-export', label: 'Export Backup (JSON)', icon: '📥', action: 'EXPORT_JSON' },
    { id: 'cmd-activity', label: 'Open Activity Audit Log', icon: '📜', action: 'OPEN_ACTIVITY' },
    { id: 'cmd-undo', label: 'Undo Last Delete', icon: '↩️', action: 'UNDO_DELETE' },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = (projects || []).filter((p) => {
    const term = query.toLowerCase();
    const matchesTitle = (p.title?.toLowerCase() || '').includes(term);
    const matchesDesc = (p.description?.toLowerCase() || '').includes(term);
    const matchesTags = Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(term));
    return matchesTitle || matchesDesc || matchesTags;
  });

  const combinedList = [
    ...filteredCommands.map((c) => ({ type: 'command', item: c })),
    ...filteredProjects.map((p) => ({ type: 'project', item: p })),
  ];

  const handleSelect = (entry) => {
    if (!entry) return;
    if (entry.type === 'command') {
      if (onExecuteCommand) onExecuteCommand(entry.item.action);
    } else {
      if (onSelectProject) onSelectProject(entry.item);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (combinedList.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedList.length) % (combinedList.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(combinedList[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-700/30">
          <span className="text-lg opacity-60">⌘</span>
          <input
            type="text"
            placeholder="Type a command or search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
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

        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {filteredCommands.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </p>
              <div className="space-y-1">
                {filteredCommands.map((cmd) => {
                  const idx = combinedList.findIndex(
                    (x) => x.type === 'command' && x.item.id === cmd.id
                  );
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => handleSelect({ type: 'command', item: cmd })}
                      className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isDark
                          ? 'hover:bg-slate-700/70 text-slate-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span>{cmd.icon}</span>
                        <span className="font-medium">{cmd.label}</span>
                      </div>
                      <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        Action ↵
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Projects
              </p>
              <div className="space-y-1">
                {filteredProjects.map((proj) => {
                  const idx = combinedList.findIndex(
                    (x) => x.type === 'project' && x.item.id === proj.id
                  );
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelect({ type: 'project', item: proj })}
                      className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isDark
                          ? 'hover:bg-slate-700/70 text-slate-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="truncate max-w-[80%]">
                        <p className="font-medium truncate">{proj.title}</p>
                        {proj.description && (
                          <p className={`text-[11px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {proj.description}
                          </p>
                        )}
                      </div>
                      <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        Jump ↵
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {combinedList.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8 italic">
              No matching commands or projects found.
            </p>
          )}
        </div>

        <div
          className={`px-4 py-2 border-t text-[11px] flex justify-between items-center ${
            isDark
              ? 'border-slate-700/50 bg-slate-800/80 text-slate-400'
              : 'border-slate-100 bg-slate-50 text-slate-500'
          }`}
        >
          <div className="flex gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>Planino Command Hub</span>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;