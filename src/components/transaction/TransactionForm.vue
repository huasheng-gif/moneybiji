<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { formatDate } from '@/utils/dateUtils'

const store = useFinanceStore()
const emit = defineEmits<{ added: [] }>()

const amount = ref<number>(0)
const budgetId = ref(store.budgets[0]?.id || '')
const note = ref('')
const date = ref(formatDate(new Date()))

function submit() {
  if (amount.value <= 0 || !budgetId.value) return
  store.addTransaction({
    date: date.value,
    amount: amount.value,
    budgetId: budgetId.value,
    note: note.value,
    source: 'manual'
  })
  amount.value = 0
  note.value = ''
  emit('added')
}
</script>

<template>
  <div class="tx-form card">
    <h3>✏️ 手动记账</h3>
    <div class="form-row">
      <input v-model.number="amount" type="number" class="input" placeholder="金额" />
      <select v-model="budgetId" class="input">
        <option v-for="b in store.budgets" :key="b.id" :value="b.id">
          {{ b.icon }} {{ b.name }}
        </option>
      </select>
    </div>
    <div class="form-row">
      <input v-model="note" class="input" placeholder="备注（可选）" />
      <input v-model="date" type="date" class="input" />
    </div>
    <button class="btn btn-primary" @click="submit" :disabled="amount <= 0">记一笔 ✓</button>
  </div>
</template>

<style scoped>
.tx-form h3 { margin-bottom: 16px; }
.form-row { display: flex; gap: 8px; margin-bottom: 12px; }
.form-row .input { flex: 1; }
</style>
