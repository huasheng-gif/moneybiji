<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'

const router = useRouter()
const store = useFinanceStore()

const step = ref(1)
const salary = ref(8000)
const salaryDay = ref(15)

interface BudgetInput { id: string; name: string; amount: number; icon: string }

const budgets = ref<BudgetInput[]>([
  { id: 'rent', name: '房租', amount: 2000, icon: '🏠' },
  { id: 'food', name: '吃饭', amount: 1500, icon: '🍜' },
  { id: 'transport', name: '交通', amount: 300, icon: '🚇' },
  { id: 'fun', name: '娱乐', amount: 500, icon: '🎮' }
])

const totalAllocated = () => budgets.value.reduce((sum, b) => sum + b.amount, 0)
const flexible = () => salary.value - totalAllocated()

function addBudget() {
  budgets.value.push({ id: `b${Date.now()}`, name: '', amount: 0, icon: '📦' })
}
function removeBudget(idx: number) { budgets.value.splice(idx, 1) }
function applySuggestion(pct: number) {
  budgets.value.forEach(b => { b.amount = Math.round((salary.value * pct) / budgets.value.length) })
}
function finish() {
  store.completeOnboarding(salary.value, salaryDay.value, budgets.value)
  router.push('/')
}
</script>

<template>
  <div class="onboarding">
    <div class="onboarding-card card">
      <div v-if="step === 1">
        <h2>👋 欢迎使用记账助手</h2>
        <p class="subtitle">先设置你的月薪，我们来帮你规划</p>
        <div class="form-group">
          <label>每月工资（税后）</label>
          <input v-model.number="salary" type="number" class="input input-lg" placeholder="8000" />
        </div>
        <div class="form-group">
          <label>每月几号发薪</label>
          <input v-model.number="salaryDay" type="number" min="1" max="31" class="input" placeholder="15" />
        </div>
        <button class="btn btn-primary btn-block" @click="step = 2" :disabled="salary <= 0">下一步 →</button>
      </div>

      <div v-if="step === 2">
        <h2>🗂️ 设置预算分桶</h2>
        <p class="subtitle">把工资分成几个桶，花起来心里有数</p>
        <div class="budget-summary">
          <span>月薪 ¥{{ salary }}</span>
          <span>已分配 ¥{{ totalAllocated() }}</span>
          <span :class="flexible() >= 0 ? 'text-green' : 'text-red'">灵活资金 ¥{{ flexible() }}</span>
        </div>
        <div class="budget-list">
          <div v-for="(b, idx) in budgets" :key="b.id" class="budget-row">
            <span class="budget-icon">{{ b.icon }}</span>
            <input v-model="b.name" class="input" placeholder="名称" />
            <input v-model.number="b.amount" type="number" class="input input-amount" placeholder="金额" />
            <button class="btn btn-ghost" @click="removeBudget(idx)">✕</button>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-ghost" @click="addBudget">+ 添加桶</button>
          <button class="btn btn-ghost" @click="applySuggestion(0.6)">一键建议比例</button>
        </div>
        <div class="step-nav">
          <button class="btn btn-ghost" @click="step = 1">← 上一步</button>
          <button class="btn btn-primary" @click="finish" :disabled="flexible() < 0">开始记账 🚀</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--color-bg); }
.onboarding-card { width: 480px; max-width: 90vw; }
h2 { margin-bottom: 8px; }
.subtitle { color: var(--color-text-secondary); margin-bottom: 24px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; }
.input-lg { font-size: 24px; padding: 14px; text-align: center; }
.budget-summary {
  display: flex; justify-content: space-between; font-size: 13px;
  color: var(--color-text-secondary); margin-bottom: 16px; padding: 12px;
  background: var(--color-bg); border-radius: 8px;
}
.text-green { color: var(--color-success); font-weight: 600; }
.text-red { color: var(--color-danger); font-weight: 600; }
.budget-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.budget-row { display: flex; align-items: center; gap: 8px; }
.budget-icon { font-size: 24px; width: 36px; text-align: center; }
.budget-row .input { flex: 1; }
.input-amount { width: 100px; flex: none !important; }
.actions { display: flex; gap: 8px; margin-bottom: 24px; }
.step-nav { display: flex; justify-content: space-between; }
.btn-block { width: 100%; justify-content: center; padding: 14px; font-size: 16px; }
</style>
