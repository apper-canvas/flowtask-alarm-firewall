import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { taskService } from '../services'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState('board')

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      try {
        const result = await taskService.getAll()
        setTasks(result || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load tasks")
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  const handleTaskCreate = async (newTask) => {
    try {
      const createdTask = await taskService.create(newTask)
      setTasks(prev => [...(prev || []), createdTask])
      toast.success("Task created successfully!")
    } catch (err) {
      toast.error("Failed to create task")
    }
  }

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const updatedTask = await taskService.update(taskId, updatedData)
      setTasks(prev => (prev || []).map(task => 
        task.id === taskId ? updatedTask : task
      ))
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => (prev || []).filter(task => task.id !== taskId))
      toast.success("Task deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(task => task?.status === 'done').length || 0,
    inProgress: tasks?.filter(task => task?.status === 'in-progress').length || 0,
    todo: tasks?.filter(task => task?.status === 'todo').length || 0
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors lg:hidden"
              >
                <ApperIcon name="Menu" size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-surface-900 hidden sm:block">FlowTask</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-surface-600">{stats.completed} completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-surface-600">{stats.inProgress} in progress</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('board')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'board' ? 'bg-primary text-white' : 'hover:bg-surface-100 text-surface-600'
                  }`}
                >
                  <ApperIcon name="LayoutGrid" size={18} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'list' ? 'bg-primary text-white' : 'hover:bg-surface-100 text-surface-600'
                  }`}
                >
                  <ApperIcon name="List" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -240, opacity: 0 }}
          animate={{ 
            x: sidebarOpen ? 0 : -240, 
            opacity: sidebarOpen ? 1 : 0 
          }}
          className={`
            fixed lg:relative lg:translate-x-0 z-40 w-64 h-screen bg-white/60 backdrop-blur-sm border-r border-surface-200 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:block transition-transform duration-300 ease-in-out
          `}
        >
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-surface-900">Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Target" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-surface-700">Total Tasks</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{stats.total}</span>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">Completion Rate</span>
                    <span className="text-sm font-bold text-secondary">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-secondary to-secondary-light h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-surface-900">Views</h3>
              <nav className="space-y-1">
                {[
                  { icon: 'Calendar', label: 'Today', count: tasks?.filter(t => {
                    const today = new Date().toDateString()
                    return t?.dueDate && new Date(t.dueDate).toDateString() === today
                  }).length || 0 },
                  { icon: 'Clock', label: 'Upcoming', count: stats.inProgress },
                  { icon: 'FolderOpen', label: 'Projects', count: 3 },
                  { icon: 'Tag', label: 'Labels', count: 8 }
                ].map((item, index) => (
                  <motion.a
                    key={item.label}
                    href="#"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon name={item.icon} size={16} className="text-surface-500 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-surface-700">{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className="bg-surface-200 text-surface-600 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </motion.a>
                ))}
              </nav>
            </div>
          </div>
        </motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MainFeature
                tasks={tasks || []}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                view={view}
                loading={loading}
                error={error}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home