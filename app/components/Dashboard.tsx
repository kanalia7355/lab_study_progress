'use client'

import { useState, useEffect } from 'react'
import { Phase, Experiment } from '@/app/lib/types'
import { 
  loadProgress, 
  saveProgress, 
  updateTaskStatus,
  loadExperiments 
} from '@/app/lib/storage'
import { getCompletedTasks, getTotalTasks, getCurrentPhase } from '@/app/lib/learningData'
import PhaseView from './PhaseView'
import ProgressBar from './ProgressBar'
import ExperimentList from './ExperimentList'
import { Calendar, Target, Zap, Brain } from 'lucide-react'

export default function Dashboard() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [activeTab, setActiveTab] = useState<'progress' | 'experiments'>('progress')

  useEffect(() => {
    setPhases(loadProgress())
    setExperiments(loadExperiments())
  }, [])

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    const updatedPhases = updateTaskStatus(phases, taskId, completed)
    setPhases(updatedPhases)
    saveProgress(updatedPhases)
  }

  const completedTasks = getCompletedTasks(phases)
  const totalTasks = getTotalTasks()
  const overallProgress = (completedTasks / totalTasks) * 100
  const currentPhase = getCurrentPhase(phases)

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          RPI4 YOLO最適化学習進捗トラッカー
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ラズパイ4でのYOLO最適化を遺伝的アルゴリズムで実現する学習プログラム
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">全体進捗</p>
              <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">完了タスク</p>
              <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">現在のフェーズ</p>
              <p className="text-lg font-semibold truncate">{currentPhase}</p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">実験数</p>
              <p className="text-2xl font-bold">{experiments.length}</p>
            </div>
            <Brain className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <ProgressBar 
          progress={overallProgress} 
          label="総合進捗" 
          color={overallProgress === 100 ? 'green' : 'blue'}
        />
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              学習進捗
            </button>
            <button
              onClick={() => setActiveTab('experiments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'experiments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              実験結果
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'progress' ? (
        <div>
          {phases.map(phase => (
            <PhaseView 
              key={phase.id} 
              phase={phase} 
              onTaskToggle={handleTaskToggle}
            />
          ))}
        </div>
      ) : (
        <ExperimentList experiments={experiments} />
      )}
    </div>
  )
}