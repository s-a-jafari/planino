export function ShortcutsModal({ isOpen, onClose, isDark }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', desc: 'Open project search' },
    { key: 'Alt + K', desc: 'Alternative search shortcut' },
    { key: 'N', desc: 'Create a new project' },
    { key: '?', desc: 'Open keyboard shortcuts cheatsheet' },
    { key: 'Esc', desc: 'Close any active modal or menu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border transition-colors ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">⌨️</span>
            <h3 className="text-base font-bold">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className={`text-sm p-1 rounded-lg transition-all cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.desc}</span>
              <kbd
                className={`px-2 py-1 rounded-lg font-mono font-semibold border ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-700/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsModal;