import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageService } from '@/services/localStorage'
import type { FinanceData } from '@/types'

const mockData: FinanceData = {
  profile: { monthlySalary: 8000, salaryDay: 15, currency: 'CNY' },
  budgets: [{ id: 'food', name: '吃饭', amount: 1500, icon: '🍜' }],
  templates: [{ id: 't1', label: '午饭', amount: 15, budgetId: 'food' }],
  transactions: [],
  savingsGoals: [],
  settings: { categoryRules: [] }
}

describe('LocalStorageService', () => {
  let service: LocalStorageService

  beforeEach(() => {
    localStorage.clear()
    service = new LocalStorageService()
  })

  it('should return null when no data exists', () => {
    expect(service.load()).toBeNull()
  })

  it('should save and load data correctly', () => {
    service.save(mockData)
    const loaded = service.load()
    expect(loaded).toEqual(mockData)
  })

  it('should clear data', () => {
    service.save(mockData)
    service.clear()
    expect(service.load()).toBeNull()
  })
})
