<script setup lang="ts">
import { useFinanceStore } from '@/stores/finance'
import { ref } from 'vue'

const store = useFinanceStore()
const editingId = ref<string | null>(null)
const overrideAmount = ref(0)

function quickAdd(templateId: string) {
  store.addFromTemplate(templateId)
}

function startEdit(templateId: string, currentAmount: number) {
  editingId.value = templateId
  overrideAmount.value = currentAmount
}

function confirmEdit(templateId: string) {
  store.addFromTemplate(templateId, overrideAmount.value)
  editingId.value = null
}
</script>

<template>
  <div class="quick-templates">
    <h3>⚡ 快捷记账</h3>
    <div class="template-grid">
      <div v-for="tpl in store.templates" :key="tpl.id" class="template-btn">
        <template v-if="editingId === tpl.id">
          <div class="edit-row">
            <input v-model.number="overrideAmount" type="number" class="input input-sm" />
            <button class="btn btn-primary btn-sm" @click="confirmEdit(tpl.id)">✓</button>
            <button class="btn btn-ghost btn-sm" @click="editingId = null">✕</button>
          </div>
        </template>
        <template v-else>
          <button class="template-main" @click="quickAdd(tpl.id)">
            <span class="tpl-label">{{ tpl.label }}</span>
            <span class="tpl-amount">¥{{ tpl.amount }}</span>
          </button>
          <button class="template-edit" @click="startEdit(tpl.id, tpl.amount)">✎</button>
        </template>
      </div>
    </div>
    <p v-if="store.templates.length === 0" class="empty-hint">去设置页面添加快捷模板 →</p>
  </div>
</template>

<style scoped>
.quick-templates h3 { margin-bottom: 12px; }
.template-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.template-btn {
  display: flex; align-items: center;
  background: var(--color-card); border: 1px solid var(--color-border);
  border-radius: 10px; overflow: hidden;
}
.template-main {
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 16px; border: none; background: none;
  cursor: pointer; gap: 4px;
}
.template-main:hover { background: var(--color-bg); }
.tpl-label { font-size: 13px; color: var(--color-text-secondary); }
.tpl-amount { font-size: 18px; font-weight: 700; color: var(--color-primary); }
.template-edit {
  padding: 8px; border: none; background: none;
  cursor: pointer; color: var(--color-text-secondary);
  border-left: 1px solid var(--color-border);
}
.template-edit:hover { background: var(--color-bg); }
.edit-row { display: flex; align-items: center; gap: 4px; padding: 8px; }
.input-sm { width: 80px; padding: 6px 8px; }
.btn-sm { padding: 6px 10px; font-size: 12px; }
.empty-hint { color: var(--color-text-secondary); font-size: 13px; }
</style>
