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
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Create New Project ➕</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Add Project
      </button>
    </form>
  );
}