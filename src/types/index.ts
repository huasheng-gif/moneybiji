/** 用户薪资配置 */
export interface Profile {
  monthlySalary: number
  salaryDay: number       // 1-31
  currency: string
}

/** 预算桶 */
export interface Budget {
  id: string
  name: string
  amount: number
  icon: string
}

/** 快捷记账模板 */
export interface Template {
  id: string
  label: string
  amount: number
  budgetId: string
}

/** 交易来源 */
export type TransactionSource = 'manual' | 'template' | 'import'

/** 支出记录 */
export interface Transaction {
  id: string
  date: string            // YYYY-MM-DD
  amount: number
  budgetId: string
  note: string
  source: TransactionSource
}

/** 储蓄目标 */
export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  deadline: string        // YYYY-MM-DD
  autoAllocate: number    // 每月自动划拨金额
}

/** 分类匹配规则 */
export interface CategoryRule {
  keyword: string
  budgetId: string
}

/** 应用设置 */
export interface Settings {
  categoryRules: CategoryRule[]
}

/** 完整数据结构 */
export interface FinanceData {
  profile: Profile
  budgets: Budget[]
  templates: Template[]
  transactions: Transaction[]
  savingsGoals: SavingsGoal[]
  settings: Settings
}

/** 预算桶 + 计算后的消费数据 */
export interface BudgetWithSpent extends Budget {
  spent: number
  remaining: number
  percentage: number      // 0-100
}

/** 月度报告数据 */
export interface MonthlyReport {
  year: number
  month: number
  totalSpent: number
  totalBudget: number
  categoryBreakdown: { budgetId: string; name: string; amount: number; icon: string }[]
  dailyTrend: { date: string; amount: number }[]
  peakDay: { date: string; amount: number } | null
  comparisonWithLastMonth: { budgetId: string; name: string; diff: number }[]
}
