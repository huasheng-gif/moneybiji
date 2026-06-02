<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import BudgetCard from '@/components/budget/BudgetCard.vue'
import QuickTemplates from '@/components/transaction/QuickTemplates.vue'
import ProgressRing from '@/components/common/ProgressRing.vue'

const store = useFinanceStore()
const router = useRouter()

if (store.isNewUser) router.replace('/onboarding')

const totalSpent = computed(() =>
  store.currentCycleTransactions.reduce((sum, t) => sum + t.amount, 0)
)
const spentPercentage = computed(() =>
  store.profile.monthlySalary > 0 ? Math.round((totalSpent.value / store.profile.monthlySalary) * 100) : 0
)
const todayTransactions = computed(() => {
  const todayStr = new Date().toISOString().slice(0, 10)
  return store.transactions.filter(t => t.date === todayStr).slice(-5).reverse()
})
function getBudgetName(budgetId: string): string {
  return store.budgets.find(b => b.id === budgetId)?.name || budgetId
}
</script>

<template>
  <div class="dashboard">
    <h1>📊 本月总览</h1>
    <div class="overview-row">
      <div class="overview-card card">
        <ProgressRing :percentage="spentPercentage" :size="100" />
        <div class="overview-text">
          <div class="big-number">¥{{ totalSpent }}</div>
          <div class="sub-text">已花 / ¥{{ store.profile.monthlySalary }}</div>
        </div>
      </div>
      <div class="overview-card card">
        <div class="stat"><div class="stat-label">今日消费</div><div class="stat-value">¥{{ store.getTodaySpent() }}</div></div>
        <div class="stat"><div class="stat-label">灵活资金</div><div class="stat-value">¥{{ store.flexibleBudget }}</div></div>
      </div>
    </div>
    <div class="card section"><QuickTemplates /></div>
    <div class="section">
      <h2>🗂️ 预算状态</h2>
      <div class="budget-grid">
        <BudgetCard v-for="b in store.budgetsWithSpent" :key="b.id" :budget="b" />
      </div>
    </div>
    <div class="card section">
      <h2>📝 今日流水</h2>
      <div v-if="todayTransactions.length === 0" class="empty">今天还没有消费记录</div>
      <div v-for="tx in todayTransactions" :key="tx.id" class="tx-row">
        <span class="tx-note">{{ tx.note }}</span>
        <span class="tx-budget">{{ getBudgetName(tx.budgetId) }}</span>
        <span class="tx-amount">-¥{{ tx.amount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard h1 { margin-bottom: 24px; }
.section { margin-top: 24px; }
.section h2 { margin-bottom: 16px; font-size: 18px; }
.overview-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.overview-card { display: flex; align-items: center; gap: 20px; padding: 24px; }
.big-number { font-size: 32px; font-weight: 700; }
.sub-text { color: var(--color-text-secondary); font-size: 14px; }
.stat { flex: 1; }
.stat-label { font-size: 13px; color: var(--color-text-secondary); }
.stat-value { font-size: 24px; font-weight: 700; }
.budget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.tx-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--color-border); }
.tx-note { flex: 1; }
.tx-budget { font-size: 13px; color: var(--color-text-secondary); margin-right: 16px; }
.tx-amount { font-weight: 600; color: var(--color-danger); }
.empty { color: var(--color-text-secondary); font-size: 14px; padding: 20px 0; text-align: center; }
</style>
