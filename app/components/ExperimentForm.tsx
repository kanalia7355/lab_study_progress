'use client'

import { useState } from 'react'
import { Experiment } from '@/app/lib/types'
import { addExperiment, updateExperiment } from '@/app/lib/storage'
import { X } from 'lucide-react'

interface ExperimentFormProps {
  experiment?: Experiment | null
  onClose: () => void
  onSave: () => void
}

export default function ExperimentForm({ experiment, onClose, onSave }: ExperimentFormProps) {
  const [formData, setFormData] = useState({
    name: experiment?.name || '',
    modelType: experiment?.modelType || 'yolov8n',
    avgFps: experiment?.avgFps || 0,
    avgInferenceTime: experiment?.avgInferenceTime || 0,
    avgCpuTemp: experiment?.avgCpuTemp || 0,
    fitness: experiment?.fitness || 0,
    parameters: {
      modelSize: experiment?.parameters.modelSize || 'yolov8n',
      confidence: experiment?.parameters.confidence || 0.25,
      iouThreshold: experiment?.parameters.iouThreshold || 0.45,
      maxDet: experiment?.parameters.maxDet || 300,
      imgsz: experiment?.parameters.imgsz || 640
    },
    notes: experiment?.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const experimentData: Experiment = {
      id: experiment?.id || `exp-${Date.now()}`,
      date: experiment?.date || new Date(),
      ...formData
    }

    try {
      if (experiment) {
        await updateExperiment(experiment.id, experimentData)
      } else {
        await addExperiment(experimentData)
      }
      onSave()
    } catch (error) {
      console.error('Failed to save experiment:', error)
      alert('実験データの保存に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">
          {experiment ? '実験結果編集' : '新規実験結果'}
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
          <label className="block text-sm font-medium mb-1">実験名</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">モデルタイプ</label>
            <select
              value={formData.modelType}
              onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="yolov8n">YOLOv8n</option>
              <option value="yolov8s">YOLOv8s</option>
              <option value="yolov5n">YOLOv5n</option>
              <option value="yolov5s">YOLOv5s</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">平均FPS</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.avgFps}
              onChange={(e) => setFormData({ ...formData, avgFps: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">推論時間 (秒)</label>
            <input
              type="number"
              step="0.001"
              required
              value={formData.avgInferenceTime}
              onChange={(e) => setFormData({ ...formData, avgInferenceTime: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CPU温度 (°C)</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.avgCpuTemp}
              onChange={(e) => setFormData({ ...formData, avgCpuTemp: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">適応度</label>
            <input
              type="number"
              step="0.001"
              value={formData.fitness}
              onChange={(e) => setFormData({ ...formData, fitness: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">パラメータ設定</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">モデルサイズ</label>
              <select
                value={formData.parameters.modelSize}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parameters: { ...formData.parameters, modelSize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="yolov8n">yolov8n</option>
                <option value="yolov8s">yolov8s</option>
                <option value="yolov5n">yolov5n</option>
                <option value="yolov5s">yolov5s</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">画像サイズ</label>
              <select
                value={formData.parameters.imgsz}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parameters: { ...formData.parameters, imgsz: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="320">320</option>
                <option value="416">416</option>
                <option value="512">512</option>
                <option value="640">640</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Confidence</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="0.9"
                value={formData.parameters.confidence}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parameters: { ...formData.parameters, confidence: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">IoU Threshold</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="0.9"
                value={formData.parameters.iouThreshold}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parameters: { ...formData.parameters, iouThreshold: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Detections</label>
              <select
                value={formData.parameters.maxDet}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parameters: { ...formData.parameters, maxDet: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="100">100</option>
                <option value="300">300</option>
                <option value="1000">1000</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メモ</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存
        </button>
      </div>
    </form>
  )
}