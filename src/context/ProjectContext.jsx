import { createContext, useContext } from 'react';
import { useLocalStorage } from '../useLocalStorage';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useLocalStorage('projects', [
    {
      id: '1',
      title: 'Planino Core Engine 🚀',
      description: 'Design and architect the foundational state engine.',
      dueDate: '2026-10-25',
      priority: 'High',
      tags: ['Core', 'Architecture'],
      createdAt: new Date().toISOString(),
      tasks: [
        { id: '101', text: 'Setup Git Repository', completed: true },
        { id: '102', text: 'Create Context API', completed: true },
        { id: '103', text: 'Implement Sorting & Filters', completed: false },
      ],
    },
    {
      id: '2',
      title: 'UI & Motion Design 🎨',
      description: 'Implement dark mode toggles and modern micro-interactions.',
      dueDate: '2026-10-10',
      priority: 'Medium',
      tags: ['Design', 'Tailwind'],
      createdAt: new Date().toISOString(),
      tasks: [
        { id: '201', text: 'Refactor modals', completed: true },
        { id: '202', text: 'Polish card transitions', completed: false },
      ],
    },
  ]);

  const addProject = (title, description, dueDate, priority = 'Medium', tags = []) => {
    const newProject = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || '',
      priority,
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString(),
      tasks: [],
    };

    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return [newProject, ...safe];
    });
  };

  const deleteProject = (projectId) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.filter((p) => String(p.id) !== String(projectId));
    });
  };

  const cloneProject = (projectId) => {
    const target = projects.find((p) => String(p.id) === String(projectId));
    if (!target) return;

    const cloned = {
      ...target,
      id: Date.now().toString(),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      tasks: (target.tasks || []).map((t, idx) => ({
        ...t,
        id: `${Date.now()}-${idx}`,
      })),
    };

    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return [cloned, ...safe];
    });
  };

  const editProject = (id, updatedData) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) =>
        String(p.id) === String(id) ? { ...p, ...updatedData } : p
      );
    });
  };

  const addTask = (projectId, taskText) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) => {
        if (String(p.id) === String(projectId)) {
          const newTask = {
            id: Date.now().toString(),
            text: taskText.trim(),
            completed: false,
          };
          return {
            ...p,
            tasks: Array.isArray(p.tasks) ? [...p.tasks, newTask] : [newTask],
          };
        }
        return p;
      });
    });
  };

  const toggleTask = (projectId, taskId) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) => {
        if (String(p.id) === String(projectId)) {
          return {
            ...p,
            tasks: (p.tasks || []).map((t) =>
              String(t.id) === String(taskId) ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return p;
      });
    });
  };

  const deleteTask = (projectId, taskId) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) => {
        if (String(p.id) === String(projectId) && p.tasks) {
          return {
            ...p,
            tasks: p.tasks.filter((t) => String(t.id) !== String(taskId)),
          };
        }
        return p;
      });
    });
  };

  const clearCompletedTasks = (projectId) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) => {
        if (String(p.id) === String(projectId) && p.tasks) {
          return {
            ...p,
            tasks: p.tasks.filter((t) => !t.completed),
          };
        }
        return p;
      });
    });
  };

  const importProjects = (importedData) => {
    if (Array.isArray(importedData)) {
      setProjects(importedData);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: Array.isArray(projects) ? projects : [],
        addProject,
        deleteProject,
        cloneProject,
        editProject,
        addTask,
        toggleTask,
        deleteTask,
        clearCompletedTasks,
        importProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}

export default ProjectContext;