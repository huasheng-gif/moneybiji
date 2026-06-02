import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFinanceStore } from '@/stores/finance'

describe('FinanceStore', () => {
  beforeEach(() => {
    // 先创建新 Pinia 再清 localStorage，确保旧 store 的 watcher 不会重新持久化
    setActivePinia(createPinia())
    localStorage.clear()
  })

  function getStore() {
    const store = useFinanceStore()
    store.resetState()
    return store
  }

  describe('onboarding', () => {
    it('should initialize as new user', () => {
      const store = getStore()
      expect(store.isNewUser).toBe(true)
    })

    it('should complete onboarding with salary and budgets', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' },
        { id: 'rent', name: '房租', amount: 2000, icon: '🏠' }
      ])
      expect(store.profile.monthlySalary).toBe(8000)
      expect(store.profile.salaryDay).toBe(15)
      expect(store.budgets).toHaveLength(2)
      expect(store.isNewUser).toBe(false)
    })
  })

  describe('transactions', () => {
    it('should add a transaction', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      store.addTransaction({
        date: '2026-06-01',
        amount: 15,
        budgetId: 'food',
        note: '午饭',
        source: 'manual'
      })
      expect(store.transactions).toHaveLength(1)
      expect(store.transactions[0].amount).toBe(15)
    })

    it('should add transaction from template', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      store.addTemplate({ label: '午饭', amount: 15, budgetId: 'food' })
      store.addFromTemplate(store.templates[0].id)
      expect(store.transactions).toHaveLength(1)
      expect(store.transactions[0].source).toBe('template')
      expect(store.transactions[0].note).toBe('午饭')
    })

    it('should delete a transaction', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      store.addTransaction({ date: '2026-06-01', amount: 15, budgetId: 'food', note: '午饭', source: 'manual' })
      store.deleteTransaction(store.transactions[0].id)
      expect(store.transactions).toHaveLength(0)
    })
  })

  describe('budgets', () => {
    it('should add a budget', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [])
      store.addBudget({ id: 'fun', name: '娱乐', amount: 500, icon: '🎮' })
      expect(store.budgets).toHaveLength(1)
    })

    it('should update a budget', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      store.updateBudget('food', { amount: 2000 })
      expect(store.budgets[0].amount).toBe(2000)
    })

    it('should delete a budget', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      store.deleteBudget('food')
      expect(store.budgets).toHaveLength(0)
    })

    it('should calculate flexible budget', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      expect(store.flexibleBudget).toBe(6500)
    })
  })

  describe('savings', () => {
    it('should add a savings goal', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [])
      store.addSavingsGoal({ name: '买电脑', targetAmount: 8000, deadline: '2026-12-31', autoAllocate: 500 })
      expect(store.savingsGoals).toHaveLength(1)
      expect(store.savingsGoals[0].savedAmount).toBe(0)
    })

    it('should transfer money to savings goal', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [])
      store.addSavingsGoal({ name: '买电脑', targetAmount: 8000, deadline: '2026-12-31', autoAllocate: 500 })
      store.transferToSavings(store.savingsGoals[0].id, 1000)
      expect(store.savingsGoals[0].savedAmount).toBe(1000)
    })
  })

  describe('export/import', () => {
    it('should export data as JSON string', () => {
      const store = getStore()
      store.completeOnboarding(8000, 15, [
        { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }
      ])
      const json = store.exportData()
      const parsed = JSON.parse(json)
      expect(parsed.profile.monthlySalary).toBe(8000)
    })

    it('should import data from JSON string', () => {
      const store = getStore()
      const data = {
        profile: { monthlySalary: 10000, salaryDay: 20, currency: 'CNY' },
        budgets: [],
        templates: [],
        transactions: [],
        savingsGoals: [],
        settings: { categoryRules: [] }
      }
      store.importData(JSON.stringify(data))
      expect(store.profile.monthlySalary).toBe(10000)
    })
  })
})
