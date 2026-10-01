import { useRef } from 'react';
import { useProjects } from './context/ProjectContext';

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings, onResetData }) {
  const { projects, importProjects } = useProjects();
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const colorOptions = [
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-600' },
    { name: 'Violet', value: 'violet', bg: 'bg-violet-600' },
    { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-600' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-600' },
    { name: 'Rose', value: 'rose', bg: 'bg-rose-600' },
  ];

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `planino-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            importProjects(parsed);
            alert('Data imported successfully!');
            onClose();
          } else {
            alert('Invalid backup file format');
          }
        } catch {
          alert('Failed to parse JSON file');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-colors max-h-[90vh] overflow-y-auto ${
          settings.isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div
          className={`flex items-center justify-between mb-6 pb-3 border-b ${
            settings.isDark ? 'border-slate-700' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-lg font-bold">Preferences & Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`text-lg p-1 rounded-lg transition-all cursor-pointer ${
              settings.isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Dark Mode 🌙</p>
              <p className="text-xs text-slate-400">High contrast dark theme</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, isDark: !settings.isDark })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.isDark ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-2 ${settings.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Theme Accent Color 🎨
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onUpdateSettings({ ...settings, themeColor: color.value })}
                  className={`w-8 h-8 rounded-full ${color.bg} transition-transform flex items-center justify-center text-white text-xs cursor-pointer ${
                    settings.themeColor === color.value ? 'ring-4 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                  }`}
                >
                  {settings.themeColor === color.value && '✓'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Layout Style 📐</p>
              <p className="text-xs text-slate-400">Choose preferred workspace view</p>
            </div>
            <div className={`p-1 rounded-xl flex gap-1 ${settings.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              {[
                { id: 'grid', label: 'Grid' },
                { id: 'board', label: 'Board' },
                { id: 'list', label: 'List' },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => onUpdateSettings({ ...settings, layout: view.id })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    settings.layout === view.id
                      ? settings.isDark
                        ? 'bg-slate-600 text-white shadow-sm'
                        : 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`pt-4 border-t ${settings.isDark ? 'border-slate-700' : 'border-slate-100'} space-y-3`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Data Management</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportData}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  settings.isDark
                    ? 'border-slate-700 hover:bg-slate-700 text-slate-200'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Export JSON 📥
              </button>
              <button
                onClick={handleImportClick}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  settings.isDark
                    ? 'border-slate-700 hover:bg-slate-700 text-slate-200'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Import JSON 📤
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

            <button
              onClick={onResetData}
              className="w-full py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold rounded-xl transition-all border border-rose-500/20 cursor-pointer"
            >
              Reset Application Data ⚠️
            </button>
          </div>
        </div>

        <div className={`mt-6 pt-4 border-t flex justify-end ${settings.isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;