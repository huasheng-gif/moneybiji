import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { FinanceData, Budget, Template, Transaction, SavingsGoal, CategoryRule, BudgetWithSpent } from '@/types'
import { LocalStorageService } from '@/services/localStorage'
import { generateId } from '@/utils/id'
import { isInCurrentCycle, formatDate } from '@/utils/dateUtils'

const storage = new LocalStorageService()

const DEFAULT_DATA: FinanceData = {
  profile: { monthlySalary: 0, salaryDay: 15, currency: 'CNY' },
  budgets: [],
  templates: [],
  transactions: [],
  savingsGoals: [],
  settings: { categoryRules: [] }
}

export const useFinanceStore = defineStore('finance', () => {
  // === State ===
  const profile = ref(DEFAULT_DATA.profile)
  const budgets = ref<Budget[]>(DEFAULT_DATA.budgets)
  const templates = ref<Template[]>(DEFAULT_DATA.templates)
  const transactions = ref<Transaction[]>(DEFAULT_DATA.transactions)
  const savingsGoals = ref<SavingsGoal[]>(DEFAULT_DATA.savingsGoals)
  const settings = ref(DEFAULT_DATA.settings)

  // === 初始化 ===
  function init() {
    const data = storage.load()
    if (data) {
      profile.value = data.profile
      budgets.value = data.budgets
      templates.value = data.templates
      transactions.value = data.transactions
      savingsGoals.value = data.savingsGoals
      settings.value = data.settings
    }
  }

  function resetState() {
    storage.clear()
    profile.value = { ...DEFAULT_DATA.profile }
    budgets.value = []
    templates.value = []
    transactions.value = []
    savingsGoals.value = []
    settings.value = { categoryRules: [] }
  }

  // 自动保存
  function persist() {
    storage.save({
      profile: profile.value,
      budgets: budgets.value,
      templates: templates.value,
      transactions: transactions.value,
      savingsGoals: savingsGoals.value,
      settings: settings.value
    })
  }

  watch([profile, budgets, templates, transactions, savingsGoals, settings], persist, { deep: true })

  init()

  // === Computed ===
  const isNewUser = computed(() => profile.value.monthlySalary === 0)

  const flexibleBudget = computed(() => {
    const allocated = budgets.value.reduce((sum, b) => sum + b.amount, 0)
    return profile.value.monthlySalary - allocated
  })

  const currentCycleTransactions = computed(() => {
    return transactions.value.filter(t =>
      isInCurrentCycle(t.date, profile.value.salaryDay)
    )
  })

  const budgetsWithSpent = computed<BudgetWithSpent[]>(() => {
    return budgets.value.map(b => {
      const spent = currentCycleTransactions.value
        .filter(t => t.budgetId === b.id)
        .reduce((sum, t) => sum + t.amount, 0)
      return {
        ...b,
        spent,
        remaining: b.amount - spent,
        percentage: b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0
      }
    })
  })

  // === Actions ===
  function completeOnboarding(salary: number, salaryDay: number, initialBudgets: Budget[]) {
    profile.value = { monthlySalary: salary, salaryDay, currency: 'CNY' }
    budgets.value = initialBudgets
  }

  function addBudget(budget: Budget) {
    budgets.value.push(budget)
  }

  function updateBudget(id: string, updates: Partial<Budget>) {
    const idx = budgets.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      budgets.value[idx] = { ...budgets.value[idx], ...updates }
    }
  }

  function deleteBudget(id: string) {
    budgets.value = budgets.value.filter(b => b.id !== id)
  }

  function addTemplate(template: Omit<Template, 'id'>) {
    templates.value.push({ ...template, id: generateId() })
  }

  function updateTemplate(id: string, updates: Partial<Template>) {
    const idx = templates.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      templates.value[idx] = { ...templates.value[idx], ...updates }
    }
  }

  function deleteTemplate(id: string) {
    templates.value = templates.value.filter(t => t.id !== id)
  }

  function addTransaction(tx: Omit<Transaction, 'id'>) {
    transactions.value.push({ ...tx, id: generateId() })
  }

  function addFromTemplate(templateId: string, overrideAmount?: number) {
    const tpl = templates.value.find(t => t.id === templateId)
    if (!tpl) return
    addTransaction({
      date: formatDate(new Date()),
      amount: overrideAmount ?? tpl.amount,
      budgetId: tpl.budgetId,
      note: tpl.label,
      source: 'template'
    })
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  function addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) {
    savingsGoals.value.push({ ...goal, id: generateId(), savedAmount: 0 })
  }

  function updateSavingsGoal(id: string, updates: Partial<SavingsGoal>) {
    const idx = savingsGoals.value.findIndex(g => g.id === id)
    if (idx !== -1) {
      savingsGoals.value[idx] = { ...savingsGoals.value[idx], ...updates }
    }
  }

  function deleteSavingsGoal(id: string) {
    savingsGoals.value = savingsGoals.value.filter(g => g.id !== id)
  }

  function transferToSavings(goalId: string, amount: number) {
    const goal = savingsGoals.value.find(g => g.id === goalId)
    if (goal) {
      goal.savedAmount += amount
    }
  }

  function addCategoryRule(rule: CategoryRule) {
    settings.value.categoryRules.push(rule)
  }

  function deleteCategoryRule(keyword: string) {
    settings.value.categoryRules = settings.value.categoryRules.filter(r => r.keyword !== keyword)
  }

  function exportData(): string {
    const data: FinanceData = {
      profile: profile.value,
      budgets: budgets.value,
      templates: templates.value,
      transactions: transactions.value,
      savingsGoals: savingsGoals.value,
      settings: settings.value
    }
    return JSON.stringify(data, null, 2)
  }

  function importData(json: string) {
    const data = storage.importJson(json)
    profile.value = data.profile
    budgets.value = data.budgets
    templates.value = data.templates
    transactions.value = data.transactions
    savingsGoals.value = data.savingsGoals
    settings.value = data.settings
  }

  function clearAll() {
    storage.clear()
    profile.value = DEFAULT_DATA.profile
    budgets.value = []
    templates.value = []
    transactions.value = []
    savingsGoals.value = []
    settings.value = { categoryRules: [] }
  }

  function getBudgetSpent(budgetId: string): number {
    return currentCycleTransactions.value
      .filter(t => t.budgetId === budgetId)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  function getTodaySpent(): number {
    const todayStr = formatDate(new Date())
    return transactions.value
      .filter(t => t.date === todayStr)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return {
    profile, budgets, templates, transactions, savingsGoals, settings,
    isNewUser, flexibleBudget, currentCycleTransactions, budgetsWithSpent,
    completeOnboarding, init, resetState,
    addBudget, updateBudget, deleteBudget,
    addTemplate, updateTemplate, deleteTemplate,
    addTransaction, addFromTemplate, deleteTransaction,
    addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, transferToSavings,
    addCategoryRule, deleteCategoryRule,
    exportData, importData, clearAll,
    getBudgetSpent, getTodaySpent
  }
})
