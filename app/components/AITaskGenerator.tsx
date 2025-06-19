'use client'

import { useState } from 'react'
import { X, Upload, FileText, Brain, Loader } from 'lucide-react'
import { Task, Phase } from '@/app/lib/types'

interface AITaskGeneratorProps {
  phases: Phase[]
  onClose: () => void
  onTasksGenerated: (tasks: Task[], phaseId: string) => void
}

export default function AITaskGenerator({ phases, onClose, onTasksGenerated }: AITaskGeneratorProps) {
  const [inputType, setInputType] = useState<'text' | 'file'>('text')
  const [textContent, setTextContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPhase, setSelectedPhase] = useState(phases[0]?.id || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md') || file.type === 'text/plain')) {
      setSelectedFile(file)
    } else {
      alert('Markdownファイル (.md) またはテキストファイルのみアップロード可能です')
    }
  }

  const generateTasks = async () => {
    if (!textContent && !selectedFile) {
      alert('テキストを入力するかファイルをアップロードしてください')
      return
    }

    setIsGenerating(true)
    try {
      let content = textContent
      let contentType = 'テキスト'

      if (selectedFile) {
        content = await selectedFile.text()
        contentType = 'Markdown'
      }

      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          contentType
        }),
      })

      if (!response.ok) {
        throw new Error('タスク生成に失敗しました')
      }

      const data = await response.json()
      
      if (data.tasks && Array.isArray(data.tasks)) {
        setGeneratedTasks(data.tasks)
        setShowPreview(true)
      } else {
        throw new Error('不正なレスポンス形式')
      }
    } catch (error) {
      console.error('Error generating tasks:', error)
      alert('タスク生成中にエラーが発生しました。Gemini API keyが設定されているか確認してください。')
    } finally {
      setIsGenerating(false)
    }
  }

  const addGeneratedTasks = () => {
    const convertedTasks: Task[] = generatedTasks.map((task, index) => ({
      id: `ai-task-${Date.now()}-${index}`,
      title: task.title,
      description: task.description,
      category: task.category as any,
      day: task.day || 'Day 1',
      completed: false,
      codeSnippet: task.codeSnippet,
      notes: task.notes ? `AI生成タスク\n推定時間: ${task.estimatedHours || '不明'}時間\n優先度: ${task.priority || 'medium'}\n\n${task.notes}` : `AI生成タスク\n推定時間: ${task.estimatedHours || '不明'}時間\n優先度: ${task.priority || 'medium'}`
    }))

    onTasksGenerated(convertedTasks, selectedPhase)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">AIタスク生成</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!showPreview ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">入力方式</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setInputType('text')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      inputType === 'text'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>テキスト入力</span>
                  </button>
                  <button
                    onClick={() => setInputType('file')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      inputType === 'file'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>ファイルアップロード</span>
                  </button>
                </div>
              </div>

              {inputType === 'text' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    研究メモ・タスク内容
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="研究に関するメモ、やりたいこと、実験の内容などを自由に記述してください。AIが自動的にタスクに分解します。

例：
- ラズパイ4でYOLOv8を動かしたい
- 遺伝的アルゴリズムでハイパーパラメータを最適化
- 推論速度15FPS以上を目指す
- 温度監視機能を追加
- ベンチマーク結果をグラフ化"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Markdownファイル (.md) またはテキストファイル
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".md,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        クリックしてファイルをアップロード
                      </span>
                    </label>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-green-50 rounded border">
                        <p className="text-sm text-green-700">
                          📁 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">追加先フェーズ</label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={generateTasks}
                  disabled={isGenerating || (!textContent && !selectedFile)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>タスク生成</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">生成されたタスク ({generatedTasks.length}個)</h4>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  戻る
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {generatedTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <h5 className="font-semibold">{task.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {task.category?.toUpperCase() || 'GENERAL'}
                      </span>
                      <span>{task.day || 'Day 1'}</span>
                      <span>推定: {task.estimatedHours || '?'}時間</span>
                      <span className={`px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority || 'medium'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  修正
                </button>
                <button
                  onClick={addGeneratedTasks}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  タスクを追加 ({generatedTasks.length}個)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}