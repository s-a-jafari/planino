import { useState } from 'react';
import { useProjects } from './context/ProjectContext';

export function ProjectForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const { addProject } = useProjects();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProject(title, description);

    setTitle('');
    setDescription('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 transition-all hover:shadow-md"
    >
      <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
        Create New Project
      </h3>
      
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Project Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div>
          <textarea
            placeholder="Project Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400 resize-none"
          />
        </div>

        <button 
          type="submit" 
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Add Project</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </form>
  );
}