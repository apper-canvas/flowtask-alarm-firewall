import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ tasks, onTaskCreate, onTaskUpdate, onTaskDelete, view, loading, error }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo',
    labels: []
  })

  const columns = [
    { id: 'todo', title: 'To Do', color: 'surface', icon: 'Circle' },
    { id: 'in-progress', title: 'In Progress', color: 'primary', icon: 'Clock' },
    { id: 'review', title: 'Review', color: 'accent', icon: 'Eye' },
    { id: 'done', title: 'Done', color: 'secondary', icon: 'CheckCircle' }
  ]

  const priorityColors = {
    low: 'surface-400',
    medium: 'primary',
    high: 'accent',
    urgent: 'red-500'
  }

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'todo',
      labels: []
    })
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      await onTaskCreate({
        ...newTask,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      resetForm()
      setShowCreateModal(false)
    } catch (err) {
      toast.error("Failed to create task")
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await onTaskUpdate(taskId, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, status) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== status) {
      await handleUpdateTask(draggedTask.id, { status })
    }
    setDraggedTask(null)
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd')
  }

  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className={`task-card group cursor-grab active:cursor-grabbing priority-${task?.priority || 'medium'} ${
        draggedTask?.id === task?.id ? 'opacity-50 rotate-2' : ''
      }`}
      onClick={() => setSelectedTask(task)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-surface-900 group-hover:text-primary transition-colors line-clamp-2">
            {task?.title || 'Untitled Task'}
          </h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleUpdateTask(task?.id, { status: 'done' })
              }}
              className="p-1 hover:bg-secondary/10 rounded"
            >
              <ApperIcon name="Check" size={14} className="text-secondary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTaskDelete(task?.id)
              }}
              className="p-1 hover:bg-red-100 rounded"
            >
              <ApperIcon name="Trash2" size={14} className="text-red-500" />
            </button>
          </div>
        </div>

        {task?.description && (
          <p className="text-sm text-surface-600 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task?.dueDate && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isPast(new Date(task.dueDate)) && task.status !== 'done'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-surface-100 text-surface-600'
              }`}>
                {formatDueDate(task.dueDate)}
              </span>
            )}
            {task?.priority && (
              <div className={`w-2 h-2 rounded-full bg-${priorityColors[task.priority]}`} />
            )}
          </div>
          
          {task?.labels?.length > 0 && (
            <div className="flex space-x-1">
              {(task.labels || []).slice(0, 2).map((label, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                >
                  {label}
                </span>
              ))}
              {task.labels.length > 2 && (
                <span className="text-xs text-surface-500">+{task.labels.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Task Board</h2>
          <p className="text-surface-600">Organize and track your work efficiently</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white font-medium px-6 py-3 rounded-xl shadow-card hover:shadow-soft transition-all"
        >
          <ApperIcon name="Plus" size={18} />
          <span>Add Task</span>
        </motion.button>
      </div>

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = (tasks || []).filter(task => task?.status === column.id)
            
            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="kanban-column min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={column.icon} 
                      size={16} 
                      className={`text-${column.color === 'surface' ? 'surface-500' : column.color}`} 
                    />
                    <h3 className="font-semibold text-surface-900">{column.title}</h3>
                  </div>
                  <span className="bg-surface-200 text-surface-600 text-xs px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <AnimatePresence>
                    {columnTasks.map((task) => (
                      <TaskCard key={task?.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-card"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {(tasks || []).map((task) => (
                  <motion.tr
                    key={task?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-1 h-8 rounded-full bg-${priorityColors[task?.priority || 'medium']}`} />
                        <div>
                          <div className="font-medium text-surface-900">{task?.title || 'Untitled'}</div>
                          {task?.description && (
                            <div className="text-sm text-surface-500 truncate max-w-xs">{task.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task?.status || 'todo'}
                        onChange={(e) => handleUpdateTask(task?.id, { status: e.target.value })}
                        className="text-sm border-none bg-transparent focus:ring-2 focus:ring-primary rounded-lg"
                      >
                        {columns.map(col => (
                          <option key={col.id} value={col.id}>{col.title}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${priorityColors[task?.priority || 'medium']}/10 text-${priorityColors[task?.priority || 'medium']}`}>
                        {task?.priority || 'medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-500">
                      {task?.dueDate ? formatDueDate(task.dueDate) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="p-1 hover:bg-surface-100 rounded transition-colors"
                        >
                          <ApperIcon name="Edit" size={14} className="text-surface-500" />
                        </button>
                        <button
                          onClick={() => onTaskDelete(task?.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <ApperIcon name="Trash2" size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-glass border border-white/20 w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900">Create New Task</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="input-field h-20 resize-none"
                    placeholder="Add task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-glass border border-white/20 w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-semibold text-surface-900 mb-2">
                    {selectedTask?.title || 'Untitled Task'}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-surface-600">
                    <span className={`px-2 py-1 rounded-full bg-${priorityColors[selectedTask?.priority || 'medium']}/10 text-${priorityColors[selectedTask?.priority || 'medium']}`}>
                      {selectedTask?.priority || 'medium'} priority
                    </span>
                    {selectedTask?.dueDate && (
                      <span>Due: {formatDueDate(selectedTask.dueDate)}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {selectedTask?.description && (
                <div className="mb-6">
                  <h4 className="font-medium text-surface-900 mb-2">Description</h4>
                  <p className="text-surface-700 bg-surface-50 rounded-lg p-4">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-surface-200">
                <div className="text-sm text-surface-500">
                  Created {selectedTask?.createdAt ? format(new Date(selectedTask.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleUpdateTask(selectedTask?.id, { 
                        status: selectedTask?.status === 'done' ? 'todo' : 'done' 
                      })
                      setSelectedTask(null)
                    }}
                    className={`btn-${selectedTask?.status === 'done' ? 'secondary' : 'primary'}`}
                  >
                    {selectedTask?.status === 'done' ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature