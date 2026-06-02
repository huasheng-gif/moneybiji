<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import TransactionItem from '@/components/transaction/TransactionItem.vue'

const store = useFinanceStore()
const filterBudget = ref<string>('all')
const sortOrder = ref<'desc' | 'asc'>('desc')

const filteredTransactions = computed(() => {
  let list = [...store.transactions]
  if (filterBudget.value !== 'all') list = list.filter(t => t.budgetId === filterBudget.value)
  list.sort((a, b) => { const cmp = a.date.localeCompare(b.date); return sortOrder.value === 'desc' ? -cmp : cmp })
  return list
})

function getBudgetName(budgetId: string) { return store.budgets.find(b => b.id === budgetId)?.name || budgetId }
function getBudgetIcon(budgetId: string) { return store.budgets.find(b => b.id === budgetId)?.icon || '📦' }
function handleDelete(id: string) { if (confirm('确定删除这笔记录？')) store.deleteTransaction(id) }
</script>

<template>
  <div class="transactions-page">
    <h1>💸 支出流水</h1>
    <TransactionForm @added="() => {}" />
    <div class="filters card">
      <select v-model="filterBudget" class="input">
        <option value="all">全部分类</option>
        <option v-for="b in store.budgets" :key="b.id" :value="b.id">{{ b.icon }} {{ b.name }}</option>
      </select>
      <button class="btn btn-ghost" @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'">
        {{ sortOrder === 'desc' ? '最新优先' : '最早优先' }}
      </button>
      <span class="count">共 {{ filteredTransactions.length }} 笔</span>
    </div>
    <div class="card">
      <div v-if="filteredTransactions.length === 0" class="empty">暂无记录</div>
      <TransactionItem
        v-for="tx in filteredTransactions" :key="tx.id"
        :transaction="tx" :budget-name="getBudgetName(tx.budgetId)" :budget-icon="getBudgetIcon(tx.budgetId)"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.transactions-page h1 { margin-bottom: 24px; }
.filters { display: flex; align-items: center; gap: 12px; margin-top: 24px; margin-bottom: 16px; }
.filters .input { width: auto; flex: 1; }
.count { font-size: 13px; color: var(--color-text-secondary); }
.empty { text-align: center; padding: 40px; color: var(--color-text-secondary); }
</style>
