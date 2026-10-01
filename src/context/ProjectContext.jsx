import { createContext, useContext, useState } from 'react';
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
      isPinned: true,
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
      isPinned: false,
      createdAt: new Date().toISOString(),
      tasks: [
        { id: '201', text: 'Refactor modals', completed: true },
        { id: '202', text: 'Polish card transitions', completed: false },
      ],
    },
  ]);

  const [activities, setActivities] = useLocalStorage('planino_activities', [
    {
      id: 'init-1',
      text: 'Workspace loaded',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [lastDeletedProject, setLastDeletedProject] = useState(null);

  const logActivity = (text) => {
    const newEntry = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActivities((prev) => [newEntry, ...(Array.isArray(prev) ? prev : [])].slice(0, 40));
  };

  const clearActivities = () => {
    setActivities([]);
  };

  const addProject = (title, description, dueDate, priority = 'Medium', tags = []) => {
    const newProject = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || '',
      priority,
      tags: Array.isArray(tags) ? tags : [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      tasks: [],
    };

    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return [newProject, ...safe];
    });

    logActivity(`Created project "${newProject.title}"`);
  };

  const togglePinProject = (projectId) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) => {
        if (String(p.id) === String(projectId)) {
          const nextPinned = !p.isPinned;
          logActivity(`${nextPinned ? 'Pinned' : 'Unpinned'} "${p.title}"`);
          return { ...p, isPinned: nextPinned };
        }
        return p;
      });
    });
  };

  const deleteProject = (projectId) => {
    const target = (projects || []).find((p) => String(p.id) === String(projectId));
    if (target) {
      setLastDeletedProject(target);
    }
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.filter((p) => String(p.id) !== String(projectId));
    });
    if (target) {
      logActivity(`Deleted project "${target.title}"`);
    }
  };

  const undoDelete = () => {
    if (!lastDeletedProject) return false;
    setProjects((prev) => [lastDeletedProject, ...(Array.isArray(prev) ? prev : [])]);
    logActivity(`Restored "${lastDeletedProject.title}"`);
    setLastDeletedProject(null);
    return true;
  };

  const cloneProject = (projectId) => {
    const target = projects.find((p) => String(p.id) === String(projectId));
    if (!target) return;

    const cloned = {
      ...target,
      id: Date.now().toString(),
      title: `${target.title} (Copy)`,
      isPinned: false,
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

    logActivity(`Duplicated "${target.title}"`);
  };

  const editProject = (id, updatedData) => {
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) =>
        String(p.id) === String(id) ? { ...p, ...updatedData } : p
      );
    });
    logActivity(`Updated project "${updatedData.title || 'details'}"`);
  };

  const moveProjectStage = (projectId, targetStage) => {
    let movedTitle = '';
    setProjects((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.map((p) => {
        if (String(p.id) === String(projectId)) {
          movedTitle = p.title;
          const currentTasks = p.tasks || [];
          let updatedTasks = [...currentTasks];

          if (targetStage === 'completed') {
            updatedTasks = currentTasks.map((t) => ({ ...t, completed: true }));
          } else if (targetStage === 'todo') {
            updatedTasks = currentTasks.map((t) => ({ ...t, completed: false }));
          } else if (targetStage === 'in-progress') {
            if (currentTasks.length > 0) {
              updatedTasks = currentTasks.map((t, idx) => ({
                ...t,
                completed: idx === 0,
              }));
            }
          }
          return { ...p, tasks: updatedTasks };
        }
        return p;
      });
    });

    if (movedTitle) {
      logActivity(`Moved "${movedTitle}" to ${targetStage}`);
    }
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
    logActivity(`Added task to project`);
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
      logActivity('Imported projects from backup file');
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: Array.isArray(projects) ? projects : [],
        activities,
        lastDeletedProject,
        clearActivities,
        addProject,
        togglePinProject,
        deleteProject,
        undoDelete,
        cloneProject,
        editProject,
        moveProjectStage,
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