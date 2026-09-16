import { createContext, useContext } from 'react';
import { useLocalStorage } from '../useLocalStorage';

// 1. Create the Context
const ProjectContext = createContext();

// 2. Create the Provider Component
export function ProjectProvider({ children }) {
  // Store projects/tasks in localStorage using our custom hook
  const [projects, setProjects] = useLocalStorage('projects', [
    {
      id: 1,
      title: 'Sample Project 🚀',
      description: 'This is a default sample project.',
      tasks: [
        { id: 101, title: 'Setup Git Repository', completed: true },
        { id: 102, title: 'Create Context API', completed: false },
      ],
    },
  ]);

  // Add a new project
  const addProject = (title, description) => {
    const newProject = {
      id: Date.now(),
      title,
      description,
      tasks: [],
    };
    setProjects([...projects, newProject]);
  };

  // Delete a project
  const deleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

// 3. Custom hook to easily use this context anywhere
export function useProjects() {
  return useContext(ProjectContext);
}