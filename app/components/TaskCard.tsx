'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Code } from 'lucide-react'
import { Task } from '@/app/lib/types'

interface TaskCardProps {
  task: Task
  onToggle: (taskId: string, completed: boolean) => void
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  const categoryColors = {
    setup: 'border-blue-500',
    yolo: 'border-green-500',
    ga: 'border-purple-500',
    analysis: 'border-orange-500'
  }

  return (
    <div className={`card border-l-4 ${categoryColors[task.category]} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id, !task.completed)}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {task.completed && <Check className="w-3 h-3 text-white" />}
          </button>
          <div className="flex-1">
            <h3 className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {task.description}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {task.day}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                task.category === 'setup' ? 'bg-blue-100 text-blue-700' :
                task.category === 'yolo' ? 'bg-green-100 text-green-700' :
                task.category === 'ga' ? 'bg-purple-100 text-purple-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {task.category.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {task.codeSnippet && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>
      
      {expanded && task.codeSnippet && (
        <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <div className="flex items-center space-x-2 mb-2">
            <Code className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">コードスニペット</span>
          </div>
          <pre className="text-sm text-gray-300">
            <code>{task.codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  )
}