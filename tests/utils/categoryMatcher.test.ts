import { describe, it, expect } from 'vitest'
import { matchCategory } from '@/utils/categoryMatcher'
import type { CategoryRule } from '@/types'

const rules: CategoryRule[] = [
  { keyword: '美团', budgetId: 'food' },
  { keyword: '滴滴', budgetId: 'transport' },
  { keyword: '淘宝', budgetId: 'other' }
]

describe('categoryMatcher', () => {
  it('should match keyword in description', () => {
    expect(matchCategory('美团外卖-黄焖鸡', rules)).toBe('food')
  })

  it('should return null when no match', () => {
    expect(matchCategory('未知商家', rules)).toBeNull()
  })

  it('should be case insensitive', () => {
    expect(matchCategory('滴滴出行', rules)).toBe('transport')
  })
})
