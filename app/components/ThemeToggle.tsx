'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', systemPrefersDark)
    } else {
      root.classList.toggle('dark', newTheme === 'dark')
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return <div className="w-10 h-10" /> // Placeholder to prevent hydration mismatch
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/20 backdrop-blur-lg border border-white/20">
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === 'light'
              ? 'bg-white shadow-lg text-amber-600'
              : 'text-neutral-600 hover:bg-white/50'
          }`}
          title="ライトモード"
        >
          <Sun className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-neutral-800 shadow-lg text-blue-400'
              : 'text-neutral-600 hover:bg-white/50'
          }`}
          title="ダークモード"
        >
          <Moon className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleThemeChange('system')}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === 'system'
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg text-white'
              : 'text-neutral-600 hover:bg-white/50'
          }`}
          title="システム設定"
        >
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}