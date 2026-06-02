import type { CategoryRule } from '@/types'

/**
 * 根据关键词规则匹配分类
 * @returns 匹配到的 budgetId，未匹配返回 null
 */
export function matchCategory(description: string, rules: CategoryRule[]): string | null {
  const lower = description.toLowerCase()
  for (const rule of rules) {
    if (lower.includes(rule.keyword.toLowerCase())) {
      return rule.budgetId
    }
  }
  return null
}
