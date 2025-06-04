import projectData from '../mockData/projects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ProjectService {
  constructor() {
    this.projects = [...projectData]
  }

  async getAll() {
    await delay(300)
    return [...this.projects]
  }

  async getById(id) {
    await delay(200)
    const project = this.projects.find(project => project.id === id)
    return project ? {...project} : null
  }

  async create(projectData) {
    await delay(400)
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.projects.push(newProject)
    return {...newProject}
  }

  async update(id, data) {
    await delay(300)
    const index = this.projects.findIndex(project => project.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return {...this.projects[index]}
  }

  async delete(id) {
    await delay(250)
    const index = this.projects.findIndex(project => project.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    
    this.projects.splice(index, 1)
    return true
  }
}

export default new ProjectService()