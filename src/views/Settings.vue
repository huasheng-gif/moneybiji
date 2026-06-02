<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import CsvImporter from '@/components/transaction/CsvImporter.vue'

const store = useFinanceStore()
const newRuleKeyword = ref('')
const newRuleBudgetId = ref(store.budgets[0]?.id || '')

const exportData = () => {
  const json = store.exportData()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `finance-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click(); URL.revokeObjectURL(url)
}

const importFile = () => {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = '.json'
  input.onchange = (e: any) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try { store.importData(ev.target?.result as string); alert('导入成功！') }
      catch (err: any) { alert('导入失败：' + err.message) }
    }
    reader.readAsText(file)
  }
  input.click()
}

const clearAll = () => { if (confirm('确定清除所有数据？此操作不可恢复！')) { store.clearAll(); alert('数据已清除') } }
const addRule = () => { if (newRuleKeyword.value && newRuleBudgetId.value) { store.addCategoryRule({ keyword: newRuleKeyword.value, budgetId: newRuleBudgetId.value }); newRuleKeyword.value = '' } }
const removeRule = (keyword: string) => store.deleteCategoryRule(keyword)
const imported = (count: number) => alert(`成功导入 ${count} 笔记录`)
</script>

<template>
  <div class="settings-page">
    <h1>⚙️ 设置</h1>
    <div class="card section">
      <h2>💰 发薪日设置</h2>
      <div class="form-row"><label>月薪</label><input v-model.number="store.profile.monthlySalary" type="number" class="input" /></div>
      <div class="form-row"><label>每月几号发薪</label><input v-model.number="store.profile.salaryDay" type="number" min="1" max="31" class="input" /></div>
    </div>
    <div class="card section"><CsvImporter @imported="imported" /></div>
    <div class="card section">
      <h2>🏷️ 自动分类规则</h2>
      <p class="hint">导入账单时，包含关键词的交易会自动归类</p>
      <div class="rules-list">
        <div v-for="rule in store.settings.categoryRules" :key="rule.keyword" class="rule-row">
          <span class="keyword">{{ rule.keyword }}</span><span>→</span>
          <span>{{ store.budgets.find(b => b.id === rule.budgetId)?.name || rule.budgetId }}</span>
          <button class="btn btn-ghost btn-sm" @click="removeRule(rule.keyword)">✕</button>
        </div>
      </div>
      <div class="form-row add-rule">
        <input v-model="newRuleKeyword" class="input" placeholder="关键词" />
        <select v-model="newRuleBudgetId" class="input">
          <option v-for="b in store.budgets" :key="b.id" :value="b.id">{{ b.icon }} {{ b.name }}</option>
        </select>
        <button class="btn btn-primary" @click="addRule" :disabled="!newRuleKeyword">添加</button>
      </div>
    </div>
    <div class="card section">
      <h2>💾 数据管理</h2>
      <div class="data-actions">
        <button class="btn btn-primary" @click="exportData">导出 JSON 备份</button>
        <button class="btn btn-ghost" @click="importFile">导入 JSON 备份</button>
        <button class="btn btn-danger" @click="clearAll">清除所有数据</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page h1 { margin-bottom: 24px; }
.section { margin-bottom: 24px; }
.section h2 { margin-bottom: 16px; font-size: 16px; }
.form-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.form-row label { width: 120px; font-size: 14px; font-weight: 500; }
.form-row .input { flex: 1; }
.hint { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px; }
.rules-list { margin-bottom: 16px; }
.rule-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--color-border); font-size: 14px; }
.keyword { background: var(--color-bg); padding: 2px 8px; border-radius: 4px; font-weight: 500; }
.add-rule { display: flex; gap: 8px; }
.add-rule .input { flex: 1; }
.data-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-sm { padding: 4px 8px; font-size: 12px; }
</style>
