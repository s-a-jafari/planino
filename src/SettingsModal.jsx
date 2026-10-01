import { useState } from 'react';

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings, onResetData }) {
  if (!isOpen) return null;

  const colorOptions = [
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-600' },
    { name: 'Violet', value: 'violet', bg: 'bg-violet-600' },
    { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-600' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-600' },
    { name: 'Rose', value: 'rose', bg: 'bg-rose-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-colors max-h-[90vh] overflow-y-auto ${
        settings.isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        <div className={`flex items-center justify-between mb-6 pb-3 border-b ${
          settings.isDark ? 'border-slate-700' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-lg font-bold">Preferences & Settings</h3>
          </div>
          <button
            onClick={onClose}
            className={`text-lg p-1 rounded-lg transition-all ${
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
              <p className="text-xs text-slate-400">High contrast dark theme for low light</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, isDark: !settings.isDark })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
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
                  className={`w-8 h-8 rounded-full ${color.bg} transition-transform flex items-center justify-center text-white text-xs ${
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
              <p className="text-xs text-slate-400">Choose grid or list view</p>
            </div>
            <div className={`p-1 rounded-xl ${settings.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <button
                onClick={() => onUpdateSettings({ ...settings, layout: 'grid' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  settings.layout === 'grid'
                    ? settings.isDark ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                Grid ▦
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, layout: 'list' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  settings.layout === 'list'
                    ? settings.isDark ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                List ☰
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Enable Notifications 🔔</p>
              <p className="text-xs text-slate-400">Alerts for task completions</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, notifications: !settings.notifications })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.notifications ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Language 🌐</p>
              <p className="text-xs text-slate-400">System language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ ...settings, language: e.target.value })}
              className={`text-xs font-semibold px-3 py-2 rounded-xl outline-none ${
                settings.isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <option value="en">English (US)</option>
              <option value="fa">فارسی (Persian)</option>
            </select>
          </div>

          <div className={`pt-4 border-t ${settings.isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            <button
              onClick={onResetData}
              className="w-full py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold rounded-xl transition-all border border-rose-500/20"
            >
              Reset Application Data ⚠️
            </button>
          </div>
        </div>

        <div className={`mt-6 pt-4 border-t flex justify-end ${settings.isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}