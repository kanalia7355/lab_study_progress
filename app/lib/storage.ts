import { Phase, Experiment, Progress } from './types'
import { learningPhases } from './learningData'

const STORAGE_KEY = 'rpi-learning-progress'
const EXPERIMENTS_KEY = 'rpi-experiments'

export function saveProgress(phases: Phase[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(phases))
  }
}

export function loadProgress(): Phase[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved progress:', e)
      }
    }
  }
  return learningPhases
}

export function saveExperiments(experiments: Experiment[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(experiments))
  }
}

export function loadExperiments(): Experiment[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(EXPERIMENTS_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved experiments:', e)
      }
    }
  }
  return []
}

export function updateTaskStatus(phases: Phase[], taskId: string, completed: boolean): Phase[] {
  return phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed, completedAt: completed ? new Date() : undefined }
        : task
    )
  }))
}

export function addExperiment(experiment: Experiment): void {
  const experiments = loadExperiments()
  experiments.push(experiment)
  saveExperiments(experiments)
}

export function deleteExperiment(experimentId: string): void {
  const experiments = loadExperiments()
  const filtered = experiments.filter(exp => exp.id !== experimentId)
  saveExperiments(filtered)
}

export function updateExperiment(experimentId: string, updates: Partial<Experiment>): void {
  const experiments = loadExperiments()
  const updated = experiments.map(exp => 
    exp.id === experimentId ? { ...exp, ...updates } : exp
  )
  saveExperiments(updated)
}