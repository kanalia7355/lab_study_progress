'use client'

import { useState, useEffect } from 'react'
import { Sparkles, CheckCircle, Target } from 'lucide-react'

interface ProgressBarProps {
  progress: number
  label?: string
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'yellow' | 'red'
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true,
  color = 'blue',
  animated = true,
  size = 'md'
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayProgress(progress)
    }
  }, [progress, animated])

  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      setIsComplete(true)
      // 完了エフェクトをリセット
      const timer = setTimeout(() => setIsComplete(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [progress, isComplete])

  const colorConfig = {
    blue: {
      gradient: 'from-primary-500 via-primary-600 to-accent-500',
      bg: 'from-primary-50 to-accent-50',
      glow: 'shadow-primary-500/30',
      text: 'text-primary-700'
    },
    green: {
      gradient: 'from-success-500 via-success-600 to-success-700',
      bg: 'from-success-50 to-success-100',
      glow: 'shadow-success-500/30',
      text: 'text-success-700'
    },
    yellow: {
      gradient: 'from-warning-500 via-warning-600 to-warning-700',
      bg: 'from-warning-50 to-warning-100',
      glow: 'shadow-warning-500/30',
      text: 'text-warning-700'
    },
    red: {
      gradient: 'from-error-500 via-error-600 to-error-700',
      bg: 'from-error-50 to-error-100',
      glow: 'shadow-error-500/30',
      text: 'text-error-700'
    }
  }

  const sizeConfig = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-3', text: 'text-sm' },
    lg: { height: 'h-4', text: 'text-base' }
  }

  const config = colorConfig[color]
  const sizeStyle = sizeConfig[size]
  const progressValue = Math.min(100, Math.max(0, displayProgress))

  return (
    <div className="w-full space-y-3">
      {/* Label and Percentage */}
      {label && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {progress >= 100 ? (
              <CheckCircle className="w-4 h-4 text-success-600" />
            ) : (
              <Target className="w-4 h-4 text-primary-600" />
            )}
            <span className={`font-semibold text-neutral-800 dark:text-neutral-200 ${sizeStyle.text}`}>
              {label}
            </span>
          </div>
          {showPercentage && (
            <div className="flex items-center gap-2">
              {isComplete && (
                <Sparkles className="w-4 h-4 text-warning-500 animate-pulse" />
              )}
              <span className={`font-bold ${config.text} ${sizeStyle.text}`}>
                {Math.round(progressValue)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative overflow-hidden">
        <div className={`
          w-full ${sizeStyle.height} rounded-full relative overflow-hidden
          bg-gradient-to-r ${config.bg} border border-white/20
          shadow-inner
        `}>
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Progress Fill */}
          <div 
            className={`
              ${sizeStyle.height} rounded-full transition-all duration-1000 ease-out relative overflow-hidden
              bg-gradient-to-r ${config.gradient}
              ${isComplete ? `shadow-lg ${config.glow}` : ''}
            `}
            style={{ 
              width: `${progressValue}%`,
              transform: isComplete ? 'scale(1.02)' : 'scale(1)',
              transition: 'width 1s ease-out, transform 0.3s ease-out'
            }}
          >
            {/* Animated Shimmer Effect */}
            {animated && progressValue > 0 && (
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
            
            {/* Completion Pulse */}
            {isComplete && (
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            )}
          </div>

          {/* Milestone Markers */}
          {size === 'lg' && (
            <>
              <div className="absolute top-0 left-1/4 w-0.5 h-full bg-white/40" />
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/40" />
              <div className="absolute top-0 left-3/4 w-0.5 h-full bg-white/40" />
            </>
          )}
        </div>

        {/* Completion Celebration */}
        {isComplete && (
          <div className="absolute -top-1 -left-1 w-full h-full pointer-events-none">
            <div className="relative w-full h-full">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-warning-400 rounded-full animate-bounce"
                  style={{
                    left: `${20 + i * 15}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Stats */}
      {size === 'lg' && (
        <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  )
}