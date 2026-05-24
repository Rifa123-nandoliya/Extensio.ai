function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

      <h3 className="text-xl font-semibold mb-2">
      
        {project.projectName}
      </h3>

      <p className="text-gray-500 mb-4">
        {project.description}
      </p>

      <a
        href={project.downloadUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Download ZIP
      </a>

    </div>
  );
}

export default ProjectCard;