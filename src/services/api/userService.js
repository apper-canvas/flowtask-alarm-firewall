import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  constructor() {
    this.users = [...userData]
  }

  async getAll() {
    await delay(300)
    return [...this.users]
  }

  async getById(id) {
    await delay(200)
    const user = this.users.find(user => user.id === id)
    return user ? {...user} : null
  }

  async create(userData) {
    await delay(400)
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.users.push(newUser)
    return {...newUser}
  }

  async update(id, data) {
    await delay(300)
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    this.users[index] = {
      ...this.users[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return {...this.users[index]}
  }

  async delete(id) {
    await delay(250)
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    this.users.splice(index, 1)
    return true
  }
}

export default new UserService()