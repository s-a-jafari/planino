import { useProjects } from './context/ProjectContext';
import { ProjectForm } from './ProjectForm';
import { ProjectItem } from './ProjectItem';

function App() {
  const { projects } = useProjects();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Planino 🚀</h1>
      
      <ProjectForm />

      <h2>Projects List:</h2>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;