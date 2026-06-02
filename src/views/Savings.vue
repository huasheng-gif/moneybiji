<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import SavingsCard from '@/components/savings/SavingsCard.vue'
import SavingsForm from '@/components/savings/SavingsForm.vue'
import type { SavingsGoal } from '@/types'

const store = useFinanceStore()
const showForm = ref(false)
const editingGoal = ref<SavingsGoal | undefined>(undefined)
const transferAmount = ref(0)
const transferTargetId = ref<string | null>(null)

function handleSave(data: Omit<SavingsGoal, 'id' | 'savedAmount'> & { id?: string }) {
  if (data.id) store.updateSavingsGoal(data.id, data)
  else store.addSavingsGoal(data)
  showForm.value = false; editingGoal.value = undefined
}
function startEdit(goal: SavingsGoal) { editingGoal.value = goal; showForm.value = true }
function startTransfer(goalId: string) { transferTargetId.value = goalId; transferAmount.value = 0 }
function confirmTransfer() {
  if (transferTargetId.value && transferAmount.value > 0) {
    store.transferToSavings(transferTargetId.value, transferAmount.value)
    transferTargetId.value = null
  }
}
function handleDelete(id: string) { if (confirm('确定删除这个储蓄目标？')) store.deleteSavingsGoal(id) }
</script>

<template>
  <div class="savings-page">
    <div class="page-header">
      <h1>🎯 储蓄目标</h1>
      <button class="btn btn-primary" @click="showForm = true; editingGoal = undefined">+ 新建目标</button>
    </div>
    <div v-if="transferTargetId" class="card transfer-modal">
      <h3>💰 转入储蓄</h3>
      <div class="form-row">
        <input v-model.number="transferAmount" type="number" class="input" placeholder="转入金额" />
        <button class="btn btn-primary" @click="confirmTransfer" :disabled="transferAmount <= 0">确认</button>
        <button class="btn btn-ghost" @click="transferTargetId = null">取消</button>
      </div>
      <p class="hint">灵活资金余额: ¥{{ store.flexibleBudget }}</p>
    </div>
    <SavingsForm v-if="showForm" :goal="editingGoal" @save="handleSave" @cancel="showForm = false; editingGoal = undefined" />
    <div class="goals-grid">
      <SavingsCard v-for="goal in store.savingsGoals" :key="goal.id" :goal="goal"
        @transfer="startTransfer" @edit="startEdit" @delete="handleDelete" />
    </div>
    <div v-if="store.savingsGoals.length === 0 && !showForm" class="empty card">还没有储蓄目标，点击上方按钮创建一个吧 🎯</div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.transfer-modal { margin-bottom: 16px; padding: 16px; }
.transfer-modal h3 { margin-bottom: 12px; }
.form-row { display: flex; gap: 8px; align-items: center; }
.form-row .input { flex: 1; }
.hint { font-size: 12px; color: var(--color-text-secondary); margin-top: 8px; }
.goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
.empty { text-align: center; padding: 40px; color: var(--color-text-secondary); }
</style>
