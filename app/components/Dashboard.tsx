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
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden border-4 border-primary-200/50">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066cc' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-accent-400 to-success-400 rounded-full opacity-20 animate-pulse" />
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 via-accent-500 to-success-500 flex items-center justify-center shadow-xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse shadow-lg" />
                    <span className="text-sm font-bold text-success-700 bg-success-100 px-3 py-1 rounded-full">
                      システム稼働中
                    </span>
                  </div>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span style={{
                    background: 'var(--gradient-hero)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>RPI4 YOLO</span>
                  <br />
                  <span className="text-neutral-800 dark:text-neutral-100 text-4xl lg:text-5xl">最適化トラッカー</span>
                </h1>
                <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed font-medium">
                  <span className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-1 rounded-lg mr-2 text-sm font-bold">
                    🤖 AI POWERED
                  </span>
                  遺伝的アルゴリズムによるラズパイ4 YOLO最適化を
                  <br />
                  リアルタイムで管理・可視化する次世代ダッシュボード
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-xl border-2 border-primary-200">
                    <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-primary-800">AI駆動型</span>
                  </div>
                  <div className="flex items-center gap-2 bg-success-100 px-4 py-2 rounded-xl border-2 border-success-200">
                    <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-success-800">リアルタイム同期</span>
                  </div>
                  <div className="flex items-center gap-2 bg-accent-100 px-4 py-2 rounded-xl border-2 border-accent-200">
                    <div className="w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-accent-800">クロスプラットフォーム</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-end gap-6">
                <SyncStatus onAuthRequired={() => setShowAuthModal(true)} />
                <div className="text-center lg:text-right bg-white/90 p-6 rounded-2xl border-2 border-primary-200 shadow-xl">
                  <div className="text-4xl font-black mb-2" style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {Math.round(overallProgress)}%
                  </div>
                  <div className="text-sm font-bold text-primary-700">総合進捗</div>
                  <div className="progress-bar mt-2">
                    <div 
                      className="progress-fill"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
            <div className="relative card border-4 border-primary-300 bg-gradient-to-br from-white via-primary-50 to-accent-50">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-primary-800">全体進捗</p>
                  </div>
                  <p className="text-4xl font-black text-primary-700">{Math.round(overallProgress)}%</p>
                  <div className="progress-bar w-32 h-3 bg-primary-100 border-2 border-primary-300">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-success-500 to-success-600 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
            <div className="relative card border-4 border-success-300 bg-gradient-to-br from-white via-success-50 to-success-100">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-success-800">完了タスク</p>
                  </div>
                  <p className="text-4xl font-black text-success-700">{completedTasks}<span className="text-xl text-success-500">/{totalTasks}</span></p>
                  <p className="text-sm font-bold text-success-600 bg-success-200 px-3 py-1 rounded-full">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% 達成済み
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-400 to-success-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
            <div className="relative card border-4 border-accent-300 bg-gradient-to-br from-white via-accent-50 to-accent-100">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-accent-800">現在フェーズ</p>
                  </div>
                  <p className="text-lg font-black text-accent-700 leading-tight">{currentPhase}</p>
                  <p className="text-sm font-bold text-accent-600 bg-accent-200 px-3 py-1 rounded-full">
                    🔥 アクティブ
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-warning-500 to-warning-600 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
            <div className="relative card border-4 border-warning-300 bg-gradient-to-br from-white via-warning-50 to-warning-100">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-warning-800">実験数</p>
                  </div>
                  <p className="text-4xl font-black text-warning-700">{experiments.length}</p>
                  <p className="text-sm font-bold text-warning-600 bg-warning-200 px-3 py-1 rounded-full">
                    📊 記録済み実験
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
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