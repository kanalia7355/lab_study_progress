'use client'

import { useState } from 'react'
import { X, User, Lock, Mail, Loader } from 'lucide-react'
import { signInWithPassword, signUp } from '@/app/lib/supabase'

interface AuthModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let result
      if (mode === 'signin') {
        result = await signInWithPassword(email, password)
      } else {
        result = await signUp(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        if (mode === 'signup' && !result.data.user?.email_confirmed_at) {
          setError('確認メールを送信しました。メールを確認してからログインしてください。')
        } else {
          onSuccess()
        }
      }
    } catch (err) {
      setError('認証に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">
              {mode === 'signin' ? 'ログイン' : 'アカウント作成'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {mode === 'signin' 
              ? 'ログインして進捗データをデバイス間で同期' 
              : '無料アカウントを作成してクラウド同期を開始'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              メールアドレス
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="your-email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={mode === 'signup' ? '8文字以上のパスワード' : 'パスワード'}
                minLength={mode === 'signup' ? 8 : undefined}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>処理中...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'ログイン' : 'アカウント作成'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {mode === 'signin' 
              ? 'アカウントをお持ちでない方はこちら' 
              : 'すでにアカウントをお持ちの方はこちら'
            }
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            ログインせずに続行（ローカルのみ）
          </button>
        </div>
      </div>
    </div>
  )
}