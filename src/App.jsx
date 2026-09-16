import { useProjects } from './context/ProjectContext';

function App() {
  const { projects, addProject, deleteProject } = useProjects();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Project Planner 🚀</h1>
      
      <h2>Projects List:</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ marginBottom: '15px' }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <button onClick={() => deleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;