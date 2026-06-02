<script setup lang="ts">
import type { Transaction } from '@/types'

defineProps<{
  transaction: Transaction
  budgetName: string
  budgetIcon: string
}>()

const emit = defineEmits<{ delete: [id: string] }>()
</script>

<template>
  <div class="tx-item">
    <span class="tx-icon">{{ budgetIcon }}</span>
    <div class="tx-info">
      <div class="tx-note">{{ transaction.note || budgetName }}</div>
      <div class="tx-meta">{{ transaction.date }} · {{ budgetName }} · {{ transaction.source }}</div>
    </div>
    <div class="tx-right">
      <span class="tx-amount">-¥{{ transaction.amount }}</span>
      <button class="btn-delete" @click="emit('delete', transaction.id)">✕</button>
    </div>
  </div>
</template>

<style scoped>
.tx-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.tx-icon {
  font-size: 24px; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-bg); border-radius: 10px;
}
.tx-info { flex: 1; }
.tx-note { font-weight: 500; }
.tx-meta { font-size: 12px; color: var(--color-text-secondary); margin-top: 2px; }
.tx-right { display: flex; align-items: center; gap: 8px; }
.tx-amount { font-weight: 600; font-size: 16px; color: var(--color-danger); }
.btn-delete {
  border: none; background: none; color: var(--color-text-secondary);
  cursor: pointer; font-size: 14px; padding: 4px; border-radius: 4px;
}
.btn-delete:hover { background: var(--color-danger); color: white; }
</style>
