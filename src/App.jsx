import { useState } from 'react';
import { useProjects } from './context/ProjectContext';
import { ProjectItem } from './ProjectItem';
import { ProjectModal } from './ProjectModal';
import { SettingsModal } from './SettingsModal';
import { SearchModal } from './SearchModal';

function App() {
  const { projects } = useProjects();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [highlightedProjectId, setHighlightedProjectId] = useState(null);

  const [settings, setSettings] = useState({
    themeColor: 'indigo',
    layout: 'grid',
    isCompact: false,
    language: 'en',
    isDark: true,
    notifications: true,
  });

  const colorClasses = {
    indigo: 'bg-indigo-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    rose: 'bg-rose-600',
  };

  const currentThemeBg = colorClasses[settings.themeColor] || 'bg-indigo-600';

  const gridClass =
    settings.layout === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'flex flex-col gap-4 max-w-2xl mx-auto';

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredProjects = projects.filter((project) => {

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalTasks = project.tasks?.length || 0;
    const completedCount = project.tasks?.filter((t) => t.completed).length || 0;
    const isCompleted = totalTasks > 0 && completedCount === totalTasks;

    if (filterStatus === 'completed') return matchesSearch && isCompleted;
    if (filterStatus === 'in-progress') return matchesSearch && !isCompleted;
    
    return matchesSearch;
  });

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-8 relative transition-colors duration-300 ${
      settings.isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      <div className="max-w-6xl mx-auto">
        <header className={`flex items-center justify-between mb-8 pb-4 border-b ${
          settings.isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${currentThemeBg} flex items-center justify-center text-white shadow-lg font-bold text-xl transition-colors`}>
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Planino</h1>
              <p className={`text-xs font-medium ${settings.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Project & Task Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-xl flex gap-1 ${settings.isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200/60'}`}>
              {['all', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    filterStatus === status
                      ? settings.isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All 🌐' : status === 'in-progress' ? 'In Progress ⏳' : 'Completed ✅'}
                </button>
              ))}
            </div>

              <button
                onClick={() => setIsProjectModalOpen(true)}
                className={`flex items-center gap-2 ${currentThemeBg} hover:opacity-90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer`}
              >
                <span>+ New Project</span>
              </button>
            </div>

        </header>

        <div>
          {projects.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border border-dashed ${
              settings.isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-500'
            }`}>
              <p className="font-medium text-sm">No projects found. Click "New Project" to create one! 🚀</p>
            </div>
          ) : (
            <ul className={`${gridClass} p-0`}>
              {filteredProjects.map((project) => (
                <ProjectItem key={project.id} project={project} isDark={settings.isDark} themeColor={settings.themeColor}
                isHighlighted={project.id === highlightedProjectId} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsSearchModalOpen(true)}
        className={`fixed bottom-20 right-6 w-12 h-12 border rounded-full shadow-lg flex items-center justify-center text-xl transition-all active:scale-95 cursor-pointer z-40 ${
          settings.isDark 
            ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
        }`}
        title="Search"
      >
        🔍
      </button>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        projects={projects}
        onSelectProject={(project) => {
          setHighlightedProjectId(project.id);
         
          setTimeout(() => {
            const el = document.getElementById(`project-${project.id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
         
          setTimeout(() => {
            setHighlightedProjectId(null);
          }, 2500);
        }}
        isDark={settings.isDark}
      />

      <button
        onClick={() => setIsSettingsModalOpen(true)}
        className={`fixed bottom-6 right-6 w-12 h-12 border rounded-full shadow-lg flex items-center justify-center text-xl transition-all hover:rotate-45 active:scale-95 cursor-pointer z-40 ${
          settings.isDark 
            ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
        }`}
        title="Settings"
      >
        ⚙️
      </button>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        isDark={settings.isDark}
      />
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetData={handleResetData}
      />
    </div>
  );
}

export default App;