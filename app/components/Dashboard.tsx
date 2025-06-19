'use client'

import { useState, useEffect } from 'react'
import { Phase, Experiment } from '@/app/lib/types'
import { 
  loadProgress, 
  saveProgress, 
  updateTaskStatus,
  loadExperiments,
  addTaskToPhase,
  updateTask,
  deleteTask
} from '@/app/lib/storage'
import { getCompletedTasks, getTotalTasks, getCurrentPhase } from '@/app/lib/learningData'
import PhaseView from './PhaseView'
import ProgressBar from './ProgressBar'
import ExperimentList from './ExperimentList'
import TaskForm from './TaskForm'
import AITaskGenerator from './AITaskGenerator'
import AuthModal from './AuthModal'
import SyncStatus from './SyncStatus'
import { Calendar, Target, Zap, Brain, Plus, FileText } from 'lucide-react'

export default function Dashboard() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [activeTab, setActiveTab] = useState<'progress' | 'experiments'>('progress')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [editingTask, setEditingTask] = useState<{ task: any; phaseId: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [phasesData, experimentsData] = await Promise.all([
        loadProgress(),
        loadExperiments()
      ])
      setPhases(phasesData)
      setExperiments(experimentsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    const updatedPhases = updateTaskStatus(phases, taskId, completed)
    setPhases(updatedPhases)
    await saveProgress(updatedPhases)
  }

  const handleAddTask = async (phaseId: string, task: any) => {
    let updatedPhases
    if (editingTask) {
      // 編集モード
      updatedPhases = updateTask(phases, editingTask.task.id, task)
    } else {
      // 新規追加モード
      updatedPhases = addTaskToPhase(phases, phaseId, task)
    }
    setPhases(updatedPhases)
    await saveProgress(updatedPhases)
    setEditingTask(null)
  }

  const handleEditTask = (task: any, phaseId: string) => {
    setEditingTask({ task, phaseId })
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('このタスクを削除しますか？')) {
      const updatedPhases = deleteTask(phases, taskId)
      setPhases(updatedPhases)
      await saveProgress(updatedPhases)
    }
  }

  const handleAITasksGenerated = async (tasks: any[], phaseId: string) => {
    let updatedPhases = phases
    tasks.forEach(task => {
      updatedPhases = addTaskToPhase(updatedPhases, phaseId, task)
    })
    setPhases(updatedPhases)
    await saveProgress(updatedPhases)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // 認証成功後にデータを再読み込み
    loadData()
  }

  const completedTasks = phases.length > 0 ? getCompletedTasks(phases) : 0
  const totalTasks = getTotalTasks()
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const currentPhase = getCurrentPhase(phases)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              RPI4 YOLO最適化学習進捗トラッカー
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ラズパイ4でのYOLO最適化を遺伝的アルゴリズムで実現する学習プログラム
            </p>
          </div>
          <SyncStatus onAuthRequired={() => setShowAuthModal(true)} />
        </div>
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
          <div className="flex justify-between items-center">
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
            
            {activeTab === 'progress' && (
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => {
                    setEditingTask(null)
                    setShowTaskForm(true)
                  }}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>新規タスク</span>
                </button>
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>AI生成</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'progress' ? (
        <div>
          {phases.map(phase => (
            <PhaseView 
              key={phase.id} 
              phase={phase} 
              onTaskToggle={handleTaskToggle}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        <ExperimentList experiments={experiments} />
      )}

      {showTaskForm && (
        <TaskForm
          phases={phases}
          onClose={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
          onSave={handleAddTask}
          editingTask={editingTask}
        />
      )}

      {showAIGenerator && (
        <AITaskGenerator
          phases={phases}
          onClose={() => setShowAIGenerator(false)}
          onTasksGenerated={handleAITasksGenerated}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}