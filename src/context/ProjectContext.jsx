import { createContext, useContext } from 'react';
import { useLocalStorage } from '../useLocalStorage';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useLocalStorage('projects', [
    {
      id: 1,
      title: 'Sample Project 🚀',
      description: 'This is a default sample project.',
      dueDate: '',
      tasks: [
        { id: 101, title: 'Setup Git Repository', completed: true },
        { id: 102, title: 'Create Context API', completed: false },
      ],
    },
  ]);

  const addProject = (title, description, dueDate) => {
    const newProject = {
      id: Date.now().toString(),
      title: title || '',
      description: description || '',
      dueDate: dueDate || '',
      createdAt: new Date().toISOString(),
      tasks: [],
    };

    setProjects((prevProjects) => {
      const safeList = Array.isArray(prevProjects) ? prevProjects : [];
      return [newProject, ...safeList];
    });
  };

  const deleteProject = (projectId) => {
    setProjects((prevProjects) => {
      const safeList = Array.isArray(prevProjects) ? prevProjects : [];
      return safeList.filter((project) => String(project.id) !== String(projectId));
    });
  };

  const editProject = (id, updatedData) => {
    setProjects((prevProjects) => {
      const safeList = Array.isArray(prevProjects) ? prevProjects : [];
      return safeList.map((project) =>
        String(project.id) === String(id) ? { ...project, ...updatedData } : project
      );
    });
  };

  const addTask = (projectId, taskText) => {
    setProjects((prevProjects) => {
      const safeList = Array.isArray(prevProjects) ? prevProjects : [];
      return safeList.map((project) => {
        if (String(project.id) === String(projectId)) {
          const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
          };
          return {
            ...project,
            tasks: Array.isArray(project.tasks) ? [...project.tasks, newTask] : [newTask],
          };
        }
        return project;
      });
    });
  };

  const toggleTask = (projectId, taskId) => {
    setProjects((prevProjects) => {
      const safeList = Array.isArray(prevProjects) ? prevProjects : [];
      return safeList.map((project) => {
        if (String(project.id) === String(projectId)) {
          return {
            ...project,
            tasks: (project.tasks || []).map((task) =>
              String(task.id) === String(taskId)
                ? { ...task, completed: !task.completed }
                : task
            ),
          };
        }
        return project;
      });
    });
  };

  const deleteTask = (projectId, taskId) => {
    setProjects((prevProjects) => {
      const safeList = Array.isArray(prevProjects) ? prevProjects : [];
      return safeList.map((project) => {
        if (String(project.id) === String(projectId) && project.tasks) {
          return {
            ...project,
            tasks: project.tasks.filter(
              (task) => String(task.id) !== String(taskId)
            ),
          };
        }
        return project;
      });
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: Array.isArray(projects) ? projects : [],
        addProject,
        deleteProject,
        editProject,
        addTask,
        toggleTask,
        deleteTask,
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