<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SavingsGoal } from '@/types'

const props = defineProps<{ goal?: SavingsGoal }>()
const emit = defineEmits<{
  save: [data: Omit<SavingsGoal, 'id' | 'savedAmount'> & { id?: string }]
  cancel: []
}>()

const name = ref(props.goal?.name || '')
const targetAmount = ref(props.goal?.targetAmount || 0)
const deadline = ref(props.goal?.deadline || '')
const autoAllocate = ref(props.goal?.autoAllocate || 0)

watch(() => props.goal, (g) => {
  if (g) { name.value = g.name; targetAmount.value = g.targetAmount; deadline.value = g.deadline; autoAllocate.value = g.autoAllocate }
})

function submit() {
  if (!name.value || targetAmount.value <= 0) return
  emit('save', {
    ...(props.goal ? { id: props.goal.id } : {}),
    name: name.value, targetAmount: targetAmount.value,
    deadline: deadline.value, autoAllocate: autoAllocate.value
  })
}
</script>

<template>
  <div class="savings-form card">
    <h3>{{ goal ? '编辑目标' : '新建储蓄目标' }}</h3>
    <div class="form-group">
      <label>目标名称</label>
      <input v-model="name" class="input" placeholder="如：买新电脑" />
    </div>
    <div class="form-row">
      <div class="form-group"><label>目标金额</label><input v-model.number="targetAmount" type="number" class="input" placeholder="8000" /></div>
      <div class="form-group"><label>截止日期</label><input v-model="deadline" type="date" class="input" /></div>
    </div>
    <div class="form-group">
      <label>每月自动划拨（可选）</label>
      <input v-model.number="autoAllocate" type="number" class="input" placeholder="500" />
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" @click="emit('cancel')">取消</button>
      <button class="btn btn-primary" @click="submit" :disabled="!name || targetAmount <= 0">{{ goal ? '保存' : '创建' }}</button>
    </div>
  </div>
</template>

<style scoped>
.savings-form h3 { margin-bottom: 16px; }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: var(--color-text-secondary); }
.form-row { display: flex; gap: 12px; }
.form-row .form-group { flex: 1; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
</style>
