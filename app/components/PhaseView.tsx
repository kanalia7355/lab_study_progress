'use client'

import { Phase } from '@/app/lib/types'
import TaskCard from './TaskCard'
import ProgressBar from './ProgressBar'
import { CheckCircle, Clock, Target, Sparkles } from 'lucide-react'

interface PhaseViewProps {
  phase: Phase
  onTaskToggle: (taskId: string, completed: boolean) => void
  onTaskEdit?: (task: any, phaseId: string) => void
  onTaskDelete?: (taskId: string) => void
}

export default function PhaseView({ phase, onTaskToggle, onTaskEdit, onTaskDelete }: PhaseViewProps) {
  const completedTasks = phase.tasks.filter(task => task.completed).length
  const progress = (completedTasks / phase.tasks.length) * 100
  const isCompleted = progress === 100

  return (
    <div className={`relative group ${isCompleted ? 'animate-bounce-in' : ''}`}>
      {/* Main Phase Card */}
      <div className="card overflow-hidden relative">
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          {isCompleted ? (
            <div className="w-4 h-4 bg-success-500 rounded-full animate-pulse" />
          ) : (
            <div className="w-4 h-4 bg-primary-400 rounded-full animate-pulse" />
          )}
        </div>

        {/* Phase Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              isCompleted 
                ? 'bg-gradient-to-br from-success-500 to-success-600' 
                : 'bg-gradient-to-br from-primary-500 to-accent-500'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <Target className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                isCompleted ? 'text-success-700' : 'gradient-text'
              }`}>
                {phase.name}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
                {phase.description}
              </p>
            </div>
          </div>

          {/* Phase Info */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
              <Clock className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-primary-700">{phase.days}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-success-50 to-primary-50 border border-success-100">
              <Sparkles className="w-4 h-4 text-success-600" />
              <span className="font-medium text-success-700">{completedTasks}/{phase.tasks.length} タスク完了</span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-success-100 to-success-200 border border-success-300">
                <CheckCircle className="w-4 h-4 text-success-700" />
                <span className="font-bold text-success-800">フェーズ完了！</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-neutral-800">進捗状況</h3>
            <span className={`text-sm font-bold ${
              isCompleted ? 'text-success-600' : 'text-primary-600'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar 
            progress={progress} 
            label="進捗状況"
            color={isCompleted ? 'green' : 'blue'}
          />
        </div>

        {/* Tasks Grid */}
        <div className="mb-8">
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            タスク一覧
          </h3>
          <div className="grid gap-4">
            {phase.tasks.map((task, index) => (
              <div 
                key={task.id}
                className="animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <TaskCard 
                  task={task} 
                  phaseId={phase.id}
                  onToggle={onTaskToggle}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="glass rounded-2xl p-6 border border-success-200/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <span className="gradient-text">マイルストーン</span>
          </h3>
          <div className="grid gap-3">
            {phase.milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-success-100 hover:bg-white/70 transition-all duration-300"
              >
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-neutral-700 leading-relaxed">
                  {milestone}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}