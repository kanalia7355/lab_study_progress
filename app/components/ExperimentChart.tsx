'use client'

import { Experiment } from '@/app/lib/types'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ExperimentChartProps {
  experiments: Experiment[]
  chartType: 'fps' | 'inference' | 'temperature' | 'fitness'
}

export default function ExperimentChart({ experiments, chartType }: ExperimentChartProps) {
  if (experiments.length === 0) return null

  const sortedData = [...experiments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(exp => ({
      date: format(new Date(exp.date), 'MM/dd'),
      name: exp.name,
      fps: exp.avgFps,
      inference: exp.avgInferenceTime * 1000, // ms
      temperature: exp.avgCpuTemp,
      fitness: exp.fitness || 0,
      model: exp.modelType
    }))

  const chartConfigs = {
    fps: {
      title: 'FPS推移',
      dataKey: 'fps',
      color: '#10b981',
      unit: 'FPS'
    },
    inference: {
      title: '推論時間推移',
      dataKey: 'inference',
      color: '#3b82f6',
      unit: 'ms'
    },
    temperature: {
      title: 'CPU温度推移',
      dataKey: 'temperature',
      color: '#ef4444',
      unit: '°C'
    },
    fitness: {
      title: '適応度推移',
      dataKey: 'fitness',
      color: '#8b5cf6',
      unit: ''
    }
  }

  const config = chartConfigs[chartType]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{config.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(2)}${config.unit}`}
            labelFormatter={(label) => `日付: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={config.dataKey} 
            stroke={config.color} 
            strokeWidth={2}
            dot={{ fill: config.color }}
            name={config.title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}