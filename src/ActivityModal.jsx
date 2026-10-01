export function ActivityModal({ isOpen, onClose, activities, isDark, onClear }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-colors max-h-[80vh] flex flex-col ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="text-base font-bold">Activity Log</h3>
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

        <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1">
          {activities && activities.length > 0 ? (
            activities.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  isDark
                    ? 'bg-slate-700/40 border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200/70 text-slate-700'
                }`}
              >
                <span className="truncate pr-2 font-medium">{item.text}</span>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">{item.time}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-10 italic">No recent activity logged yet.</p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between">
          <button
            onClick={onClear}
            className="text-[11px] text-rose-500 hover:underline cursor-pointer"
          >
            Clear Log
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;