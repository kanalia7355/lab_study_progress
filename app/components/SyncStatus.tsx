'use client'

import { useState, useEffect } from 'react'
import { Cloud, CloudOff, Wifi, WifiOff, RefreshCw, User, LogOut } from 'lucide-react'
import { cloudStorage } from '@/app/lib/cloudStorage'
import { getCurrentUser, signOut } from '@/app/lib/supabase'
import ThemeToggle from './ThemeToggle'

interface SyncStatusProps {
  onAuthRequired: () => void
}

export default function SyncStatus({ onAuthRequired }: SyncStatusProps) {
  const [user, setUser] = useState<any>(null)
  const [syncStatus, setSyncStatus] = useState({ isOnline: true, hasPendingChanges: false })
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    checkUser()
    
    // 同期状態を定期的にチェック
    const interval = setInterval(() => {
      setSyncStatus(cloudStorage.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  const handleForceSync = async () => {
    if (!user) {
      onAuthRequired()
      return
    }

    setIsRefreshing(true)
    try {
      await cloudStorage.forcSync()
      setSyncStatus(cloudStorage.getSyncStatus())
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getSyncIcon = () => {
    if (!user) {
      return <CloudOff className="w-4 h-4 text-gray-400" />
    }
    if (!syncStatus.isOnline) {
      return <WifiOff className="w-4 h-4 text-red-500" />
    }
    if (syncStatus.hasPendingChanges) {
      return <RefreshCw className="w-4 h-4 text-yellow-500" />
    }
    return <Cloud className="w-4 h-4 text-green-500" />
  }

  const getSyncText = () => {
    if (!user) return 'ローカルのみ'
    if (!syncStatus.isOnline) return 'オフライン'
    if (syncStatus.hasPendingChanges) return '同期待ち'
    return '同期済み'
  }

  const getSyncColor = () => {
    if (!user) return 'text-gray-600'
    if (!syncStatus.isOnline) return 'text-red-600'
    if (syncStatus.hasPendingChanges) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="flex items-center gap-4">
      {/* テーマ切り替え */}
      <ThemeToggle />

      {/* 同期状態 */}
      <div className="glass rounded-xl px-4 py-2 border border-white/20">
        <div className={`flex items-center gap-2 ${getSyncColor()}`}>
          {getSyncIcon()}
          <span className="text-sm font-medium">{getSyncText()}</span>
        </div>
      </div>

      {/* 手動同期ボタン */}
      {user && (syncStatus.hasPendingChanges || !syncStatus.isOnline) && (
        <button
          onClick={handleForceSync}
          disabled={isRefreshing || !syncStatus.isOnline}
          className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>同期</span>
        </button>
      )}

      {/* ユーザー情報 */}
      <div className="glass rounded-xl border border-white/20">
        {user ? (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="max-w-32 truncate font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-error-100 dark:hover:bg-error-900/20 rounded-lg text-error-600 transition-all duration-300 hover:scale-110"
              title="ログアウト"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthRequired}
            className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
          >
            <User className="w-4 h-4" />
            <span>ログイン</span>
          </button>
        )}
      </div>
    </div>
  )
}