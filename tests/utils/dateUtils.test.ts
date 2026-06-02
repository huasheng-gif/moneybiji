import { describe, it, expect } from 'vitest'
import { getCurrentCycleStart, isInCurrentCycle, getDaysInMonth } from '@/utils/dateUtils'

describe('dateUtils', () => {
  describe('getDaysInMonth', () => {
    it('should return 28 for Feb in non-leap year', () => {
      expect(getDaysInMonth(2026, 2)).toBe(28)
    })
    it('should return 29 for Feb in leap year', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29)
    })
    it('should return 31 for Jan', () => {
      expect(getDaysInMonth(2026, 1)).toBe(31)
    })
  })

  describe('getCurrentCycleStart', () => {
    it('should return current month salary day if today is after salary day', () => {
      const today = new Date(2026, 5, 20)
      const result = getCurrentCycleStart(15, today)
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(5)
      expect(result.getDate()).toBe(15)
    })

    it('should return previous month salary day if today is before salary day', () => {
      const today = new Date(2026, 5, 10)
      const result = getCurrentCycleStart(15, today)
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(4)
      expect(result.getDate()).toBe(15)
    })

    it('should handle salary day 31 in a 30-day month', () => {
      const today = new Date(2026, 6, 5)
      const result = getCurrentCycleStart(31, today)
      expect(result.getMonth()).toBe(5)
      expect(result.getDate()).toBe(30)
    })
  })

  describe('isInCurrentCycle', () => {
    it('should return true for date in current cycle', () => {
      const today = new Date(2026, 5, 20)
      expect(isInCurrentCycle('2026-06-16', 15, today)).toBe(true)
    })

    it('should return false for date before cycle start', () => {
      const today = new Date(2026, 5, 20)
      expect(isInCurrentCycle('2026-06-14', 15, today)).toBe(false)
    })
  })
})
