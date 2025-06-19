import { supabase, getCurrentUser } from './supabase'
import { Phase, Experiment } from './types'

// クラウド同期対応のストレージシステム
export class CloudStorage {
  private static instance: CloudStorage
  private isOnline = true
  private syncInProgress = false
  private pendingChanges: string[] = []

  static getInstance(): CloudStorage {
    if (!CloudStorage.instance) {
      CloudStorage.instance = new CloudStorage()
    }
    return CloudStorage.instance
  }

  constructor() {
    // オンライン/オフライン状態の監視
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.syncPendingChanges()
      })
      window.addEventListener('offline', () => {
        this.isOnline = false
      })
    }
  }

  // 進捗データの保存
  async saveProgress(phases: Phase[]): Promise<void> {
    const user = await getCurrentUser()
    if (!user) {
      // ユーザーがログインしていない場合はローカルのみ
      this.saveToLocal('rpi-learning-progress', phases)
      return
    }

    try {
      // ローカルに即座に保存
      this.saveToLocal('rpi-learning-progress', phases)

      if (this.isOnline) {
        await this.syncToCloud('progress', phases)
      } else {
        this.addPendingChange('progress')
      }
    } catch (error) {
      console.error('Failed to save progress:', error)
      // クラウド保存に失敗してもローカルには保存済み
    }
  }

  // 進捗データの読み込み
  async loadProgress(): Promise<Phase[]> {
    const user = await getCurrentUser()
    if (!user) {
      // ログインしていない場合はローカルデータのみ
      return this.loadFromLocal('rpi-learning-progress') || []
    }

    try {
      if (this.isOnline) {
        // クラウドから最新データを取得
        const cloudData = await this.loadFromCloud('progress')
        if (cloudData) {
          // ローカルにも保存
          this.saveToLocal('rpi-learning-progress', cloudData)
          return cloudData
        }
      }
      
      // オフラインまたはクラウドデータがない場合はローカルから
      return this.loadFromLocal('rpi-learning-progress') || []
    } catch (error) {
      console.error('Failed to load progress:', error)
      // エラー時はローカルデータにフォールバック
      return this.loadFromLocal('rpi-learning-progress') || []
    }
  }

  // 実験データの保存
  async saveExperiments(experiments: Experiment[]): Promise<void> {
    const user = await getCurrentUser()
    if (!user) {
      this.saveToLocal('rpi-experiments', experiments)
      return
    }

    try {
      this.saveToLocal('rpi-experiments', experiments)

      if (this.isOnline) {
        await this.syncToCloud('experiments', experiments)
      } else {
        this.addPendingChange('experiments')
      }
    } catch (error) {
      console.error('Failed to save experiments:', error)
    }
  }

  // 実験データの読み込み
  async loadExperiments(): Promise<Experiment[]> {
    const user = await getCurrentUser()
    if (!user) {
      return this.loadFromLocal('rpi-experiments') || []
    }

    try {
      if (this.isOnline) {
        const cloudData = await this.loadFromCloud('experiments')
        if (cloudData) {
          this.saveToLocal('rpi-experiments', cloudData)
          return cloudData
        }
      }
      
      return this.loadFromLocal('rpi-experiments') || []
    } catch (error) {
      console.error('Failed to load experiments:', error)
      return this.loadFromLocal('rpi-experiments') || []
    }
  }

  // ローカルストレージ操作
  private saveToLocal(key: string, data: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  private loadFromLocal(key: string): any {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse local data:', e)
        }
      }
    }
    return null
  }

  // クラウド同期
  private async syncToCloud(type: 'progress' | 'experiments', data: any): Promise<void> {
    if (this.syncInProgress) return
    
    this.syncInProgress = true
    try {
      const user = await getCurrentUser()
      if (!user) return

      if (type === 'progress') {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            phases: data,
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      } else if (type === 'experiments') {
        // 既存の実験データを削除してから挿入
        await supabase
          .from('user_experiments')
          .delete()
          .eq('user_id', user.id)

        if (data.length > 0) {
          const experiments = data.map((exp: Experiment) => ({
            id: exp.id,
            user_id: user.id,
            name: exp.name,
            date: exp.date,
            model_type: exp.modelType,
            avg_fps: exp.avgFps,
            avg_inference_time: exp.avgInferenceTime,
            avg_cpu_temp: exp.avgCpuTemp,
            fitness: exp.fitness,
            parameters: exp.parameters,
            notes: exp.notes,
            updated_at: new Date().toISOString()
          }))

          const { error } = await supabase
            .from('user_experiments')
            .insert(experiments)

          if (error) throw error
        }
      }
    } finally {
      this.syncInProgress = false
    }
  }

  private async loadFromCloud(type: 'progress' | 'experiments'): Promise<any> {
    const user = await getCurrentUser()
    if (!user) return null

    if (type === 'progress') {
      const { data, error } = await supabase
        .from('user_progress')
        .select('phases')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error
      }

      return data?.phases || null
    } else if (type === 'experiments') {
      const { data, error } = await supabase
        .from('user_experiments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(exp => ({
        id: exp.id,
        name: exp.name,
        date: exp.date,
        modelType: exp.model_type,
        avgFps: exp.avg_fps,
        avgInferenceTime: exp.avg_inference_time,
        avgCpuTemp: exp.avg_cpu_temp,
        fitness: exp.fitness,
        parameters: exp.parameters,
        notes: exp.notes
      })) || []
    }

    return null
  }

  // 保留中の変更を同期
  private async syncPendingChanges(): Promise<void> {
    if (this.pendingChanges.length === 0) return

    for (const changeType of this.pendingChanges) {
      try {
        if (changeType === 'progress') {
          const localData = this.loadFromLocal('rpi-learning-progress')
          if (localData) {
            await this.syncToCloud('progress', localData)
          }
        } else if (changeType === 'experiments') {
          const localData = this.loadFromLocal('rpi-experiments')
          if (localData) {
            await this.syncToCloud('experiments', localData)
          }
        }
      } catch (error) {
        console.error('Failed to sync pending change:', changeType, error)
        continue // 他の変更の同期も試行
      }
    }

    this.pendingChanges = []
  }

  private addPendingChange(type: string): void {
    if (!this.pendingChanges.includes(type)) {
      this.pendingChanges.push(type)
    }
  }

  // 同期状態の取得
  getSyncStatus(): { isOnline: boolean; hasPendingChanges: boolean } {
    return {
      isOnline: this.isOnline,
      hasPendingChanges: this.pendingChanges.length > 0
    }
  }

  // 手動同期
  async forcSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('オフライン状態では同期できません')
    }
    await this.syncPendingChanges()
  }
}

// シングルトンインスタンス
export const cloudStorage = CloudStorage.getInstance()