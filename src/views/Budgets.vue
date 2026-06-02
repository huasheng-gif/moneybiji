<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import BudgetCard from '@/components/budget/BudgetCard.vue'
import BudgetForm from '@/components/budget/BudgetForm.vue'
import type { Budget } from '@/types'

const store = useFinanceStore()
const showForm = ref(false)
const editingBudget = ref<Budget | undefined>(undefined)

function handleSave(budget: Omit<Budget, 'id'> & { id?: string }) {
  if (budget.id) store.updateBudget(budget.id, budget)
  else store.addBudget({ ...budget, id: `b${Date.now()}` })
  showForm.value = false; editingBudget.value = undefined
}
function startEdit(budget: Budget) { editingBudget.value = budget; showForm.value = true }
function handleDelete(id: string) { if (confirm('确定删除这个预算桶？')) store.deleteBudget(id) }
</script>

<template>
  <div class="budgets-page">
    <div class="page-header">
      <h1>🗂️ 预算管理</h1>
      <button class="btn btn-primary" @click="showForm = true; editingBudget = undefined">+ 添加预算</button>
    </div>
    <div class="card flexible-card">
      <span>💰 灵活资金</span>
      <span class="amount" :class="store.flexibleBudget >= 0 ? 'text-green' : 'text-red'">¥{{ store.flexibleBudget }}</span>
      <span class="hint">（月薪 - 已分配）</span>
    </div>
    <BudgetForm v-if="showForm" :budget="editingBudget" @save="handleSave" @cancel="showForm = false; editingBudget = undefined" />
    <div class="budget-grid">
      <div v-for="b in store.budgetsWithSpent" :key="b.id" class="budget-wrapper">
        <BudgetCard :budget="b" />
        <div class="budget-actions">
          <button class="btn btn-ghost" @click="startEdit(b)">编辑</button>
          <button class="btn btn-ghost btn-danger-text" @click="handleDelete(b.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.flexible-card { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 16px; }
.flexible-card .amount { font-size: 24px; font-weight: 700; }
.text-green { color: var(--color-success); }
.text-red { color: var(--color-danger); }
.hint { font-size: 13px; color: var(--color-text-secondary); }
.budget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
.budget-actions { display: flex; gap: 8px; padding: 8px 16px; }
.btn-danger-text { color: var(--color-danger) !important; }
</style>
