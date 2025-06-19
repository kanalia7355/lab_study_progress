'use client'

import { Experiment } from '@/app/lib/types'
import { formatChartDate } from '@/app/lib/utils'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Zap, Thermometer, Target, Brain } from 'lucide-react'

interface ExperimentChartProps {
  experiments: Experiment[]
  chartType: 'fps' | 'inference' | 'temperature' | 'fitness'
}

export default function ExperimentChart({ experiments, chartType }: ExperimentChartProps) {
  if (experiments.length === 0) return null

  const sortedData = [...experiments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(exp => ({
      date: formatChartDate(exp.date),
      name: exp.name,
      fps: exp.avgFps,
      inference: exp.avgInferenceTime * 1000, // ms
      temperature: exp.avgCpuTemp,
      fitness: exp.fitness || 0,
      model: exp.modelType
    }))

  const chartConfigs = {
    fps: {
      title: 'FPS パフォーマンス',
      dataKey: 'fps',
      gradient: ['#10b981', '#059669'],
      icon: <Zap className="w-5 h-5" />,
      unit: 'FPS',
      description: 'フレーム処理速度の推移',
      color: 'text-success-600'
    },
    inference: {
      title: '推論時間',
      dataKey: 'inference',
      gradient: ['#3b82f6', '#2563eb'],
      icon: <Target className="w-5 h-5" />,
      unit: 'ms',
      description: '1フレームあたりの処理時間',
      color: 'text-primary-600'
    },
    temperature: {
      title: 'CPU温度',
      dataKey: 'temperature',
      gradient: ['#ef4444', '#dc2626'],
      icon: <Thermometer className="w-5 h-5" />,
      unit: '°C',
      description: 'システム温度の監視',
      color: 'text-error-600'
    },
    fitness: {
      title: '適応度スコア',
      dataKey: 'fitness',
      gradient: ['#8b5cf6', '#7c3aed'],
      icon: <Brain className="w-5 h-5" />,
      unit: '',
      description: '遺伝的アルゴリズムの最適化指標',
      color: 'text-accent-600'
    }
  }

  const config = chartConfigs[chartType]
  
  // 最新値と前回値の比較
  const latestValue = sortedData[sortedData.length - 1]?.[config.dataKey as keyof typeof sortedData[0]] as number || 0
  const previousValue = sortedData[sortedData.length - 2]?.[config.dataKey as keyof typeof sortedData[0]] as number || latestValue
  const trend = latestValue > previousValue ? 'up' : latestValue < previousValue ? 'down' : 'stable'
  const trendPercent = previousValue !== 0 ? Math.abs(((latestValue - previousValue) / previousValue) * 100) : 0

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    return (
      <div className="glass-dark rounded-xl p-4 border border-neutral-700 shadow-xl">
        <p className="text-sm font-semibold text-neutral-200 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-neutral-300">
              {entry.name}: <span className="font-bold text-white">
                {entry.value.toFixed(2)}{config.unit}
              </span>
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="card group hover:shadow-2xl transition-all duration-500">
      {/* Chart Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-${config.gradient[0]} to-${config.gradient[1]} flex items-center justify-center shadow-lg`}>
            <div className={config.color}>
              {config.icon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              {config.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {config.description}
            </p>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="text-right">
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-success-600' : 
            trend === 'down' ? 'text-error-600' : 'text-neutral-600'
          }`}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {trend !== 'stable' && (
              <span>{trendPercent.toFixed(1)}%</span>
            )}
          </div>
          <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {latestValue.toFixed(2)}{config.unit}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id={`gradient-${chartType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.gradient[0]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={config.gradient[1]} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(107, 114, 128, 0.2)"
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="rgba(107, 114, 128, 0.7)"
              fontSize={12}
              tick={{ fill: 'rgba(107, 114, 128, 0.7)' }}
            />
            <YAxis 
              stroke="rgba(107, 114, 128, 0.7)"
              fontSize={12}
              tick={{ fill: 'rgba(107, 114, 128, 0.7)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.gradient[0]}
              strokeWidth={3}
              fill={`url(#gradient-${chartType})`}
              dot={{ 
                fill: config.gradient[0], 
                strokeWidth: 2, 
                stroke: '#fff',
                r: 4
              }}
              activeDot={{ 
                r: 6, 
                fill: config.gradient[0],
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Data Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-center">
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">最大値</div>
            <div className="font-semibold text-success-600">
              {Math.max(...sortedData.map(d => d[config.dataKey as keyof typeof d] as number)).toFixed(2)}{config.unit}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">平均値</div>
            <div className="font-semibold text-primary-600">
              {(sortedData.reduce((sum, d) => sum + (d[config.dataKey as keyof typeof d] as number), 0) / sortedData.length).toFixed(2)}{config.unit}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">最小値</div>
            <div className="font-semibold text-warning-600">
              {Math.min(...sortedData.map(d => d[config.dataKey as keyof typeof d] as number)).toFixed(2)}{config.unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}