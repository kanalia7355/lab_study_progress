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
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-accent-200 border-b-accent-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <h2 className="text-xl font-semibold gradient-text mb-2">Loading...</h2>
          <p className="text-neutral-600">データを読み込み中</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Hero Header */}
        <header className="mb-12 animate-fade-in">
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse status-online" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="gradient-text">RPI4 YOLO</span>
                  <br />
                  <span className="text-neutral-800 dark:text-neutral-200">最適化トラッカー</span>
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  🤖 遺伝的アルゴリズムによるラズパイ4 YOLO最適化を
                  <br />
                  リアルタイムで管理・可視化する次世代ダッシュボード
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>AI駆動型</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="w-2 h-2 bg-success-500 rounded-full" />
                    <span>リアルタイム同期</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="w-2 h-2 bg-accent-500 rounded-full" />
                    <span>クロスプラットフォーム</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-end gap-4">
                <SyncStatus onAuthRequired={() => setShowAuthModal(true)} />
                <div className="text-center lg:text-right">
                  <div className="text-3xl font-bold gradient-text">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-neutral-600">総合進捗</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <p className="text-sm font-medium text-neutral-600">全体進捗</p>
                </div>
                <p className="text-3xl font-bold gradient-text">{Math.round(overallProgress)}%</p>
                <div className="progress-bar w-24 h-2">
                  <div 
                    className="progress-fill h-full"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </div>
          
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-success-600" />
                  <p className="text-sm font-medium text-neutral-600">完了タスク</p>
                </div>
                <p className="text-3xl font-bold text-success-700">{completedTasks}<span className="text-lg text-neutral-500">/{totalTasks}</span></p>
                <p className="text-xs text-neutral-500">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% 達成済み</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-100 to-success-200 flex items-center justify-center group-hover:from-success-200 group-hover:to-success-300 transition-all duration-300">
                <Activity className="w-6 h-6 text-success-700" />
              </div>
            </div>
          </div>
          
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent-600" />
                  <p className="text-sm font-medium text-neutral-600">現在フェーズ</p>
                </div>
                <p className="text-lg font-semibold text-accent-700 leading-tight">{currentPhase}</p>
                <p className="text-xs text-neutral-500">アクティブ</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center group-hover:from-accent-200 group-hover:to-accent-300 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-accent-700" />
              </div>
            </div>
          </div>
          
          <div className="card group hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-warning-600" />
                  <p className="text-sm font-medium text-neutral-600">実験数</p>
                </div>
                <p className="text-3xl font-bold text-warning-700">{experiments.length}</p>
                <p className="text-xs text-neutral-500">記録済み実験</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-100 to-warning-200 flex items-center justify-center group-hover:from-warning-200 group-hover:to-warning-300 transition-all duration-300">
                <BarChart3 className="w-6 h-6 text-warning-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">総合進捗</h3>
              <span className="text-sm text-neutral-600">{completedTasks}/{totalTasks} タスク完了</span>
            </div>
            <ProgressBar 
              progress={overallProgress} 
              label="総合進捗" 
              color={overallProgress === 100 ? 'green' : 'blue'}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="glass rounded-2xl p-2">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'progress'
                      ? 'bg-white shadow-lg text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>学習進捗</span>
                  </div>
                  {activeTab === 'progress' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('experiments')}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'experiments'
                      ? 'bg-white shadow-lg text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>実験結果</span>
                  </div>
                  {activeTab === 'experiments' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                  )}
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
        <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
          {activeTab === 'progress' ? (
            <div className="space-y-6">
              {phases.map((phase, index) => (
                <div 
                  key={phase.id}
                  className="animate-slide-up"
                  style={{animationDelay: `${0.1 * index}s`}}
                >
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
            <div className="animate-fade-in">
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