'use client'

import { Phase } from '@/app/lib/types'
import TaskCard from './TaskCard'
import ProgressBar from './ProgressBar'
import { CheckCircle } from 'lucide-react'

interface PhaseViewProps {
  phase: Phase
  onTaskToggle: (taskId: string, completed: boolean) => void
}

export default function PhaseView({ phase, onTaskToggle }: PhaseViewProps) {
  const completedTasks = phase.tasks.filter(task => task.completed).length
  const progress = (completedTasks / phase.tasks.length) * 100

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {phase.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{phase.description}</p>
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {phase.days}
        </span>
      </div>

      <div className="mb-6">
        <ProgressBar 
          progress={progress} 
          label="進捗状況"
          color={progress === 100 ? 'green' : 'blue'}
        />
      </div>

      <div className="grid gap-4 mb-6">
        {phase.tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onToggle={onTaskToggle}
          />
        ))}
      </div>

      <div className="card bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          マイルストーン
        </h3>
        <ul className="space-y-2">
          {phase.milestones.map((milestone, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {milestone}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}