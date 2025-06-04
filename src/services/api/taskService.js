import taskData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...taskData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(task => task.id === id)
    return task ? {...task} : null
  }

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.tasks.push(newTask)
    return {...newTask}
  }

  async update(id, data) {
    await delay(300)
    const index = this.tasks.findIndex(task => task.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return {...this.tasks[index]}
  }

  async delete(id) {
    await delay(250)
    const index = this.tasks.findIndex(task => task.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }

  async getByStatus(status) {
    await delay(200)
    return this.tasks.filter(task => task.status === status).map(task => ({...task}))
  }

  async getByPriority(priority) {
    await delay(200)
    return this.tasks.filter(task => task.priority === priority).map(task => ({...task}))
  }
}

export default new TaskService()