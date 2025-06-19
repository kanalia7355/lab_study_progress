'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Code, Edit, Trash2, Calendar, Tag, Sparkles } from 'lucide-react'
import { Task } from '@/app/lib/types'

interface TaskCardProps {
  task: Task
  phaseId: string
  onToggle: (taskId: string, completed: boolean) => void
  onEdit?: (task: Task, phaseId: string) => void
  onDelete?: (taskId: string) => void
}

export default function TaskCard({ task, phaseId, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  const categoryConfig = {
    setup: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: '⚙️'
    },
    yolo: {
      gradient: 'from-green-500 to-green-600',
      bg: 'from-green-50 to-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: '🎯'
    },
    ga: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: '🧬'
    },
    analysis: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: '📊'
    }
  }

  const config = categoryConfig[task.category] || categoryConfig.setup

  return (
    <div className={`relative group transition-all duration-300 hover:scale-[1.02] ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {/* Task completion celebration effect */}
      {task.completed && (
        <div className="absolute -inset-1 bg-gradient-to-r from-success-400 to-success-600 rounded-2xl opacity-20 blur animate-pulse" />
      )}
      
      <div className={`card relative overflow-hidden border-l-4 border-l-transparent ${
        task.completed 
          ? 'bg-gradient-to-r from-success-50 to-success-100 border-l-success-400' 
          : `bg-gradient-to-r ${config.bg} border-l-primary-400`
      }`}>
        
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-2c9.942 0 18-8.058 18-18s-8.058-18-18-18V0c11.046 0 20 8.954 20 20zM2 2v2h36v2H2V2zm36 36v2H2v-2h36z'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Custom Checkbox */}
            <button
              onClick={() => onToggle(task.id, !task.completed)}
              className={`relative mt-1 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 group ${
                task.completed 
                  ? 'bg-gradient-to-br from-success-400 to-success-600 border-success-400 shadow-lg' 
                  : `border-neutral-300 hover:border-primary-400 hover:bg-primary-50`
              }`}
            >
              {task.completed && (
                <Check className="w-4 h-4 text-white animate-scale-in" />
              )}
              {!task.completed && (
                <div className="w-2 h-2 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>

            <div className="flex-1 space-y-3">
              {/* Task Header */}
              <div>
                <h3 className={`font-semibold text-lg transition-all duration-300 ${
                  task.completed 
                    ? 'text-success-700 line-through' 
                    : 'text-neutral-800 group-hover:text-primary-700'
                }`}>
                  {task.title}
                </h3>
                <p className={`text-sm mt-1 leading-relaxed ${
                  task.completed 
                    ? 'text-success-600' 
                    : 'text-neutral-600'
                }`}>
                  {task.description}
                </p>
              </div>

              {/* Task Meta */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 border border-neutral-200">
                  <Calendar className="w-3 h-3 text-neutral-500" />
                  <span className="text-xs font-medium text-neutral-700">{task.day}</span>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${config.bg} border ${config.border}`}>
                  <span className="text-xs">{config.icon}</span>
                  <span className={`text-xs font-semibold ${config.text}`}>
                    {task.category.toUpperCase()}
                  </span>
                </div>

                {task.completed && task.completedAt && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-success-100 to-success-200 border border-success-300">
                    <Sparkles className="w-3 h-3 text-success-600" />
                    <span className="text-xs font-medium text-success-700">
                      完了済み
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(task, phaseId)}
                className="p-2 rounded-xl hover:bg-primary-100 text-primary-600 transition-all duration-300 hover:scale-110"
                title="タスクを編集"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-xl hover:bg-error-100 text-error-600 transition-all duration-300 hover:scale-110"
                title="タスクを削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {task.codeSnippet && (
              <button
                onClick={() => setExpanded(!expanded)}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  expanded 
                    ? 'bg-accent-100 text-accent-600' 
                    : 'hover:bg-neutral-100 text-neutral-600'
                }`}
                title="コードを表示/非表示"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
        
        {/* Code Snippet Expansion */}
        {expanded && task.codeSnippet && (
          <div className="mt-6 animate-slide-up">
            <div className="glass-dark rounded-2xl p-6 border border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-neutral-200">コードスニペット</span>
                  <p className="text-xs text-neutral-400">実装の参考にしてください</p>
                </div>
              </div>
              <div className="bg-neutral-900/80 rounded-xl p-4 border border-neutral-700">
                <pre className="text-sm text-neutral-300 overflow-x-auto">
                  <code>{task.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}