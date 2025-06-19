// Date formatting utility
export const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatChartDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    month: '2-digit',
    day: '2-digit'
  })
}