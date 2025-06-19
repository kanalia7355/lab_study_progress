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
import { Calendar, Target, Zap, Brain, Plus, FileText, Sparkles, BarChart3, TrendingUp, Activity } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">データを読み込み中</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Hero Header */}
        <header className="mb-8">
          <div className="card">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  RPI4 YOLO最適化学習進捗トラッカー
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  ラズパイ4でのYOLO最適化を遺伝的アルゴリズムで実現する学習プログラム
                </p>
              </div>
              <SyncStatus onAuthRequired={() => setShowAuthModal(true)} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">全体進捗</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">完了タスク</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}/{totalTasks}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">現在のフェーズ</p>
                <p className="text-lg font-semibold text-purple-600 truncate">{currentPhase}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">実験数</p>
                <p className="text-2xl font-bold text-orange-600">{experiments.length}</p>
              </div>
              <Brain className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">総合進捗</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">{completedTasks}/{totalTasks} タスク完了</span>
            </div>
            <ProgressBar 
              progress={overallProgress} 
              label="総合進捗" 
              color={overallProgress === 100 ? 'green' : 'blue'}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="card">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    activeTab === 'progress'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>学習進捗</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('experiments')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    activeTab === 'experiments'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>実験結果</span>
                  </div>
                </button>
              </nav>
              
              {activeTab === 'progress' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEditingTask(null)
                      setShowTaskForm(true)
                    }}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新規タスク</span>
                  </button>
                  <button
                    onClick={() => setShowAIGenerator(true)}
                    className="btn-accent flex items-center gap-2 text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI生成</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {activeTab === 'progress' ? (
            <div className="space-y-6">
              {phases.map((phase) => (
                <div key={phase.id}>
                  <PhaseView 
                    phase={phase} 
                    onTaskToggle={handleTaskToggle}
                    onTaskEdit={handleEditTask}
                    onTaskDelete={handleDeleteTask}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <ExperimentList experiments={experiments} />
            </div>
          )}
        </div>

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
    </div>
  )
}