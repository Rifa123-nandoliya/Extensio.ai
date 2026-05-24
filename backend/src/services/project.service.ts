import Project
from "../models/project.model";

export async function
saveProject(

  data: any

) {

  const project =
    await Project.create(data);

  return project;

}