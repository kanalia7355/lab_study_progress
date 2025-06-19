// 学習項目の型定義
export interface Task {
  id: string
  title: string
  description: string
  category: 'setup' | 'yolo' | 'ga' | 'analysis'
  day: string // e.g., "Day 1-2"
  completed: boolean
  completedAt?: Date
  notes?: string
  codeSnippet?: string
}

export interface SubTask {
  id: string
  taskId: string
  title: string
  completed: boolean
  completedAt?: Date
}

export interface Experiment {
  id: string
  name: string
  date: Date
  modelType: string
  avgFps: number
  avgInferenceTime: number
  avgCpuTemp: number
  fitness?: number
  parameters: {
    modelSize: string
    confidence: number
    iouThreshold: number
    maxDet: number
    imgsz: number
  }
  notes?: string
}

export interface Progress {
  totalTasks: number
  completedTasks: number
  currentPhase: 'environment' | 'yolo' | 'genetic' | 'analysis'
  startDate: Date
  lastUpdated: Date
  experiments: Experiment[]
}

export interface LearningPlan {
  phases: Phase[]
}

export interface Phase {
  id: string
  name: string
  description: string
  days: string
  tasks: Task[]
  milestones: string[]
}