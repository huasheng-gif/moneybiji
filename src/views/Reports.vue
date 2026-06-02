<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import PieChart from '@/components/report/PieChart.vue'
import LineChart from '@/components/report/LineChart.vue'

const store = useFinanceStore()
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

const year = computed(() => parseInt(selectedMonth.value.split('-')[0]))
const month = computed(() => parseInt(selectedMonth.value.split('-')[1]))

const monthTransactions = computed(() =>
  store.transactions.filter(t => t.date.startsWith(selectedMonth.value))
)

const categoryBreakdown = computed(() => {
  const map = new Map<string, number>()
  monthTransactions.value.forEach(t => map.set(t.budgetId, (map.get(t.budgetId) || 0) + t.amount))
  return Array.from(map.entries()).map(([budgetId, amount]) => {
    const budget = store.budgets.find(b => b.id === budgetId)
    return { budgetId, name: budget?.name || budgetId, icon: budget?.icon || '📦', amount }
  }).sort((a, b) => b.amount - a.amount)
})

const dailyTrend = computed(() => {
  const map = new Map<string, number>()
  monthTransactions.value.forEach(t => map.set(t.date, (map.get(t.date) || 0) + t.amount))
  const days = new Date(year.value, month.value, 0).getDate()
  const labels: string[] = []; const data: number[] = []
  for (let d = 1; d <= days; d++) {
    const dateStr = `${selectedMonth.value}-${String(d).padStart(2, '0')}`
    labels.push(`${d}日`); data.push(map.get(dateStr) || 0)
  }
  return { labels, data }
})

const totalSpent = computed(() => monthTransactions.value.reduce((sum, t) => sum + t.amount, 0))

const peakDay = computed(() => {
  const map = new Map<string, number>()
  monthTransactions.value.forEach(t => map.set(t.date, (map.get(t.date) || 0) + t.amount))
  let peak = { date: '', amount: 0 }
  map.forEach((amount, date) => { if (amount > peak.amount) peak = { date, amount } })
  return peak.date ? peak : null
})

const lastMonthComparison = computed(() => {
  const lastMonth = month.value === 1 ? 12 : month.value - 1
  const lastYear = month.value === 1 ? year.value - 1 : year.value
  const prefix = `${lastYear}-${String(lastMonth).padStart(2, '0')}`
  const lastMonthMap = new Map<string, number>()
  store.transactions.filter(t => t.date.startsWith(prefix)).forEach(t => {
    lastMonthMap.set(t.budgetId, (lastMonthMap.get(t.budgetId) || 0) + t.amount)
  })
  return categoryBreakdown.value.map(cat => ({ ...cat, diff: cat.amount - (lastMonthMap.get(cat.budgetId) || 0) }))
})

const summary = computed(() => {
  const overBudget = categoryBreakdown.value.filter(c => { const b = store.budgets.find(x => x.id === c.budgetId); return b && c.amount > b.amount })
  const underBudget = categoryBreakdown.value.filter(c => { const b = store.budgets.find(x => x.id === c.budgetId); return b && c.amount < b.amount })
  const parts: string[] = []
  if (overBudget.length > 0) parts.push(`${overBudget.map(c => c.name).join('、')}超支`)
  if (underBudget.length > 0) parts.push(`${underBudget.map(c => c.name).join('、')}有节省`)
  return parts.length > 0 ? parts.join('，') + '。' : '本月消费正常 👍'
})
</script>

<template>
  <div class="reports-page">
    <div class="page-header"><h1>📈 月度报告</h1><input v-model="selectedMonth" type="month" class="input input-month" /></div>
    <div class="card summary-card">
      <p>{{ summary }}</p>
      <div class="summary-stat"><span>本月总消费</span><span class="big">¥{{ totalSpent }}</span></div>
    </div>
    <div v-if="peakDay" class="card peak-card">📅 消费峰值：<strong>{{ peakDay.date }}</strong>，花了 <strong>¥{{ peakDay.amount }}</strong></div>
    <div class="card chart-card">
      <h2>分类消费占比</h2>
      <PieChart v-if="categoryBreakdown.length > 0" :labels="categoryBreakdown.map(c => c.name)" :data="categoryBreakdown.map(c => c.amount)" />
      <div v-else class="empty">本月暂无消费记录</div>
      <div class="category-list">
        <div v-for="cat in categoryBreakdown" :key="cat.budgetId" class="category-row">
          <span>{{ cat.icon }} {{ cat.name }}</span>
          <span>¥{{ cat.amount }}</span>
          <span class="diff">
            <span v-if="(lastMonthComparison.find(l => l.budgetId === cat.budgetId)?.diff || 0) > 0" class="text-red">↑ ¥{{ lastMonthComparison.find(l => l.budgetId === cat.budgetId)?.diff }}</span>
            <span v-else-if="(lastMonthComparison.find(l => l.budgetId === cat.budgetId)?.diff || 0) < 0" class="text-green">↓ ¥{{ Math.abs(lastMonthComparison.find(l => l.budgetId === cat.budgetId)?.diff || 0) }}</span>
            <span v-else>-</span>
          </span>
        </div>
      </div>
    </div>
    <div class="card chart-card">
      <h2>每日消费趋势</h2>
      <LineChart v-if="dailyTrend.data.some(d => d > 0)" :labels="dailyTrend.labels" :data="dailyTrend.data" />
      <div v-else class="empty">本月暂无消费记录</div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.input-month { width: auto; }
.summary-card { text-align: center; padding: 24px; margin-bottom: 16px; }
.summary-card p { font-size: 16px; margin-bottom: 12px; }
.summary-stat { display: flex; justify-content: center; gap: 12px; align-items: baseline; color: var(--color-text-secondary); }
.big { font-size: 32px; font-weight: 700; color: var(--color-text); }
.peak-card { margin-bottom: 16px; padding: 16px; font-size: 15px; }
.chart-card { margin-bottom: 24px; padding: 24px; }
.chart-card h2 { margin-bottom: 16px; font-size: 16px; }
.category-list { margin-top: 20px; }
.category-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--color-border); }
.category-row span:first-child { flex: 1; }
.category-row span:nth-child(2) { font-weight: 600; width: 80px; text-align: right; }
.diff { width: 80px; text-align: right; font-size: 13px; }
.text-red { color: var(--color-danger); }
.text-green { color: var(--color-success); }
.empty { text-align: center; padding: 40px; color: var(--color-text-secondary); }
</style>
