<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { parseCsvLine } from '@/utils/csvParser'
import { matchCategory } from '@/utils/categoryMatcher'
import type { Transaction } from '@/types'

const store = useFinanceStore()
const emit = defineEmits<{ imported: [count: number] }>()

const csvText = ref('')
const preview = ref<Transaction[]>([])
const error = ref('')

function parse() {
  error.value = ''
  try {
    const rows = parseCsvLine(csvText.value)
    preview.value = rows.map((row, i) => ({
      id: `import-${Date.now()}-${i}`,
      date: row.date,
      amount: row.amount,
      budgetId: matchCategory(row.description, store.settings.categoryRules) || 'other',
      note: row.description,
      source: 'import' as const
    }))
  } catch (e: any) {
    error.value = e.message || '解析失败'
  }
}

function confirmImport() {
  preview.value.forEach(tx => store.addTransaction(tx))
  emit('imported', preview.value.length)
  csvText.value = ''
  preview.value = []
}
</script>

<template>
  <div class="csv-importer">
    <h3>📥 导入账单</h3>
    <p class="hint">粘贴支付宝/微信导出的 CSV 内容</p>
    <textarea v-model="csvText" class="input textarea" placeholder="粘贴 CSV 内容..." rows="6" />
    <div class="actions"><button class="btn btn-primary" @click="parse" :disabled="!csvText">解析</button></div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="preview.length > 0" class="preview">
      <h4>预览 ({{ preview.length }} 笔)</h4>
      <div v-for="tx in preview.slice(0, 10)" :key="tx.id" class="preview-row">
        <span>{{ tx.date }}</span><span>{{ tx.note }}</span>
        <span>-¥{{ tx.amount }}</span>
        <span class="category">{{ store.budgets.find(b => b.id === tx.budgetId)?.name || tx.budgetId }}</span>
      </div>
      <p v-if="preview.length > 10" class="hint">...还有 {{ preview.length - 10 }} 笔</p>
      <div class="actions">
        <button class="btn btn-primary" @click="confirmImport">确认导入 {{ preview.length }} 笔</button>
        <button class="btn btn-ghost" @click="preview = []">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.csv-importer { margin-bottom: 24px; }
.csv-importer h3 { margin-bottom: 4px; }
.hint { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px; }
.textarea { font-family: monospace; font-size: 12px; resize: vertical; }
.actions { display: flex; gap: 8px; margin-top: 12px; }
.error { color: var(--color-danger); margin-top: 8px; font-size: 14px; }
.preview { margin-top: 16px; }
.preview h4 { margin-bottom: 8px; }
.preview-row { display: flex; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--color-border); font-size: 13px; }
.preview-row span:first-child { width: 100px; }
.preview-row span:nth-child(2) { flex: 1; }
.preview-row span:nth-child(3) { width: 80px; text-align: right; font-weight: 600; }
.category { width: 80px; color: var(--color-text-secondary); }
</style>
