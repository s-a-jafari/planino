import { useState } from 'react';
import { useProjects } from './context/ProjectContext';

export function ProjectItem({ project }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);

  const { deleteProject, editProject } = useProjects();

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    editProject(project.id, { title, description });
    setIsEditing(false);
  };

  return (
    <li style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          <button type="submit" style={{ marginRight: '8px' }}>Save 💾</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel ❌</button>
        </form>
      ) : (
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <button onClick={() => setIsEditing(true)} style={{ marginRight: '8px' }}>Edit ✏️</button>
          <button onClick={() => deleteProject(project.id)}>Delete 🗑️</button>
        </div>
      )}
    </li>
  );
}