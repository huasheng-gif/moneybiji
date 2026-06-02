<script setup lang="ts">
import type { BudgetWithSpent } from '@/types'

defineProps<{ budget: BudgetWithSpent }>()

function getBarColor(pct: number): string {
  if (pct < 60) return 'green'
  if (pct < 85) return 'yellow'
  return 'red'
}
</script>

<template>
  <div class="budget-card card">
    <div class="budget-header">
      <span class="icon">{{ budget.icon }}</span>
      <span class="name">{{ budget.name }}</span>
      <span class="amount">¥{{ budget.spent }} / ¥{{ budget.amount }}</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress-bar-fill" :class="getBarColor(budget.percentage)"
        :style="{ width: Math.min(budget.percentage, 100) + '%' }"
      />
    </div>
    <div class="budget-footer">
      <span>剩余 ¥{{ budget.remaining }}</span>
      <span>{{ budget.percentage }}%</span>
    </div>
  </div>
</template>

<style scoped>
.budget-card { padding: 16px; }
.budget-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.icon { font-size: 24px; }
.name { font-weight: 600; flex: 1; }
.amount { font-size: 13px; color: var(--color-text-secondary); }
.budget-footer {
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--color-text-secondary); margin-top: 8px;
}
</style>
