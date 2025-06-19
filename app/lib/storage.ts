import { Phase, Task, Experiment, Progress } from './types'
import { learningPhases } from './learningData'
import { cloudStorage } from './cloudStorage'

// クラウド同期対応のストレージ関数
export async function saveProgress(phases: Phase[]): Promise<void> {
  await cloudStorage.saveProgress(phases)
}

export async function loadProgress(): Promise<Phase[]> {
  const data = await cloudStorage.loadProgress()
  return data.length > 0 ? data : learningPhases
}

export async function saveExperiments(experiments: Experiment[]): Promise<void> {
  await cloudStorage.saveExperiments(experiments)
}

export async function loadExperiments(): Promise<Experiment[]> {
  return await cloudStorage.loadExperiments()
}

// 既存の関数は同期版として保持（下位互換性）
export function saveProgressSync(phases: Phase[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rpi-learning-progress', JSON.stringify(phases))
  }
}

export function loadProgressSync(): Phase[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rpi-learning-progress')
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

export async function addExperiment(experiment: Experiment): Promise<void> {
  const experiments = await loadExperiments()
  experiments.push(experiment)
  await saveExperiments(experiments)
}

export async function deleteExperiment(experimentId: string): Promise<void> {
  const experiments = await loadExperiments()
  const filtered = experiments.filter(exp => exp.id !== experimentId)
  await saveExperiments(filtered)
}

export async function updateExperiment(experimentId: string, updates: Partial<Experiment>): Promise<void> {
  const experiments = await loadExperiments()
  const updated = experiments.map(exp => 
    exp.id === experimentId ? { ...exp, ...updates } : exp
  )
  await saveExperiments(updated)
}

export function addTaskToPhase(phases: Phase[], phaseId: string, task: Task): Phase[] {
  return phases.map(phase => 
    phase.id === phaseId 
      ? { ...phase, tasks: [...phase.tasks, task] }
      : phase
  )
}

export function addCustomPhase(phases: Phase[], newPhase: Phase): Phase[] {
  return [...phases, newPhase]
}

export function deleteTask(phases: Phase[], taskId: string): Phase[] {
  return phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.filter(task => task.id !== taskId)
  }))
}

export function updateTask(phases: Phase[], taskId: string, updates: Partial<Task>): Phase[] {
  return phases.map(phase => ({
    ...phase,
    tasks: phase.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  }))
}