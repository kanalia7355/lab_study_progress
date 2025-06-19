'use client'

import { useState } from 'react'
import { Experiment } from '@/app/lib/types'
import { formatDate } from '@/app/lib/utils'
import { Plus, Trash2, Edit, BarChart3 } from 'lucide-react'
import ExperimentForm from './ExperimentForm'
import ExperimentChart from './ExperimentChart'
import { deleteExperiment as deleteExp } from '@/app/lib/storage'

interface ExperimentListProps {
  experiments: Experiment[]
}

export default function ExperimentList({ experiments }: ExperimentListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null)
  const [showCharts, setShowCharts] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm('この実験結果を削除しますか？')) {
      try {
        await deleteExp(id)
        window.location.reload()
      } catch (error) {
        console.error('Failed to delete experiment:', error)
        alert('実験データの削除に失敗しました')
      }
    }
  }

  const handleEdit = (experiment: Experiment) => {
    setEditingExperiment(experiment)
    setShowForm(true)
  }

  const sortedExperiments = [...experiments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">実験結果</h2>
        <div className="flex space-x-2">
          {experiments.length > 0 && (
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>{showCharts ? 'チャート非表示' : 'チャート表示'}</span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingExperiment(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>新規実験</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ExperimentForm
              experiment={editingExperiment}
              onClose={() => {
                setShowForm(false)
                setEditingExperiment(null)
              }}
              onSave={() => {
                setShowForm(false)
                setEditingExperiment(null)
                window.location.reload()
              }}
            />
          </div>
        </div>
      )}

      {showCharts && experiments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <ExperimentChart experiments={experiments} chartType="fps" />
          <ExperimentChart experiments={experiments} chartType="inference" />
          <ExperimentChart experiments={experiments} chartType="temperature" />
          <ExperimentChart experiments={experiments} chartType="fitness" />
        </div>
      )}

      <div className="grid gap-4">
        {sortedExperiments.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">まだ実験結果がありません</p>
            <p className="text-sm text-gray-400 mt-2">新規実験ボタンから結果を追加してください</p>
          </div>
        ) : (
          sortedExperiments.map(experiment => (
            <div key={experiment.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{experiment.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">日時</p>
                      <p className="font-medium">
                        {formatDate(experiment.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">モデル</p>
                      <p className="font-medium">{experiment.modelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">平均FPS</p>
                      <p className="font-medium text-green-600">{experiment.avgFps.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">推論時間</p>
                      <p className="font-medium">{(experiment.avgInferenceTime * 1000).toFixed(1)}ms</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3">
                    <p className="text-sm font-medium mb-2">パラメータ</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Size:</span>
                        <span className="ml-1 font-medium">{experiment.parameters.modelSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Conf:</span>
                        <span className="ml-1 font-medium">{experiment.parameters.confidence}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">IoU:</span>
                        <span className="ml-1 font-medium">{experiment.parameters.iouThreshold}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">MaxDet:</span>
                        <span className="ml-1 font-medium">{experiment.parameters.maxDet}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">ImgSz:</span>
                        <span className="ml-1 font-medium">{experiment.parameters.imgsz}</span>
                      </div>
                    </div>
                  </div>

                  {experiment.fitness && (
                    <div className="mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">適応度:</span>
                      <span className="ml-2 font-medium text-purple-600">{experiment.fitness.toFixed(3)}</span>
                    </div>
                  )}

                  {experiment.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium mb-1">メモ:</p>
                      <p className="whitespace-pre-wrap">{experiment.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(experiment)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(experiment.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}