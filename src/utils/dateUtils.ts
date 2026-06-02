/** 获取某月天数 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * 获取当前发薪周期的起始日期
 * @param salaryDay 发薪日 (1-31)
 * @param today 当前日期（可注入，方便测试）
 */
export function getCurrentCycleStart(salaryDay: number, today: Date = new Date()): Date {
  const year = today.getFullYear()
  const month = today.getMonth() // 0-based

  // 当月的实际发薪日（处理31号在30天月份的情况）
  const actualDay = Math.min(salaryDay, getDaysInMonth(year, month + 1))
  const cycleStartThisMonth = new Date(year, month, actualDay)

  if (today >= cycleStartThisMonth) {
    return cycleStartThisMonth
  } else {
    // 本月还没到发薪日，周期从上月开始
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const prevActualDay = Math.min(salaryDay, getDaysInMonth(prevYear, prevMonth + 1))
    return new Date(prevYear, prevMonth, prevActualDay)
  }
}

/**
 * 判断某个交易日期是否在当前发薪周期内
 */
export function isInCurrentCycle(transactionDate: string, salaryDay: number, today: Date = new Date()): boolean {
  const cycleStart = getCurrentCycleStart(salaryDay, today)
  const txDate = new Date(transactionDate + 'T00:00:00')
  return txDate >= cycleStart && txDate <= today
}

/** 格式化日期为 YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 获取今天的日期字符串 */
export function today(): string {
  return formatDate(new Date())
}
