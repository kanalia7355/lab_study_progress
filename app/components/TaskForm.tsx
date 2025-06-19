'use client'

import { useState } from 'react'
import { Task, Phase } from '@/app/lib/types'
import { X, Plus } from 'lucide-react'

interface TaskFormProps {
  phases: Phase[]
  onClose: () => void
  onSave: (phaseId: string, task: Task) => void
  editingTask?: { task: Task; phaseId: string } | null
}

export default function TaskForm({ phases, onClose, onSave, editingTask }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: editingTask?.task.title || '',
    description: editingTask?.task.description || '',
    category: editingTask?.task.category || 'setup' as const,
    day: editingTask?.task.day || 'Day 1',
    phaseId: editingTask?.phaseId || phases[0]?.id || '',
    codeSnippet: editingTask?.task.codeSnippet || '',
    notes: editingTask?.task.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTask: Task = {
      id: editingTask?.task.id || `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      day: formData.day,
      completed: editingTask?.task.completed || false,
      completedAt: editingTask?.task.completedAt,
      codeSnippet: formData.codeSnippet || undefined,
      notes: formData.notes || undefined
    }

    onSave(formData.phaseId, newTask)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {editingTask ? 'タスク編集' : '新規タスク追加'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">タスク名</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="例: システム環境の構築"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">説明</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="タスクの詳細な説明"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">フェーズ</label>
                <select
                  value={formData.phaseId}
                  onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">カテゴリー</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="setup">Setup</option>
                  <option value="yolo">YOLO</option>
                  <option value="ga">Genetic Algorithm</option>
                  <option value="analysis">Analysis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">実施日</label>
              <input
                type="text"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="例: Day 1, Day 2-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">コードスニペット（任意）</label>
              <textarea
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                placeholder="関連するコマンドやコードを記述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">メモ（任意）</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="追加のメモや注意事項"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{editingTask ? '更新' : '追加'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}