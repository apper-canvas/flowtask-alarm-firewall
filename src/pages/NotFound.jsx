import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center px-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-soft"
        >
          <ApperIcon name="AlertTriangle" size={40} className="text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-surface-900">404</h1>
          <h2 className="text-2xl font-semibold text-surface-700">Page not found</h2>
          <p className="text-surface-600 max-w-md mx-auto">
            The task you're looking for seems to have been completed and archived. 
            Let's get you back to your active workspace.
          </p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-card hover:shadow-soft"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound