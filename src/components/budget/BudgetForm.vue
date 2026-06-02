<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Budget } from '@/types'
import EmojiPicker from '@/components/common/EmojiPicker.vue'

const props = defineProps<{ budget?: Budget }>()
const emit = defineEmits<{
  save: [budget: Omit<Budget, 'id'> & { id?: string }]
  cancel: []
}>()

const name = ref(props.budget?.name || '')
const amount = ref(props.budget?.amount || 0)
const icon = ref(props.budget?.icon || '📦')

watch(() => props.budget, (b) => {
  if (b) { name.value = b.name; amount.value = b.amount; icon.value = b.icon }
})

function submit() {
  if (!name.value || amount.value <= 0) return
  emit('save', {
    ...(props.budget ? { id: props.budget.id } : {}),
    name: name.value, amount: amount.value, icon: icon.value
  })
}
</script>

<template>
  <div class="budget-form card">
    <h3>{{ budget ? '编辑预算' : '添加预算' }}</h3>
    <div class="form-row">
      <EmojiPicker @select="(e: string) => icon = e" />
      <span class="icon-preview">{{ icon }}</span>
      <input v-model="name" class="input" placeholder="预算名称" />
      <input v-model.number="amount" type="number" class="input input-amount" placeholder="金额" />
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" @click="emit('cancel')">取消</button>
      <button class="btn btn-primary" @click="submit" :disabled="!name || amount <= 0">
        {{ budget ? '保存' : '添加' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.budget-form h3 { margin-bottom: 16px; }
.form-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.icon-preview { font-size: 28px; width: 40px; text-align: center; }
.form-row .input { flex: 1; }
.input-amount { width: 120px; flex: none !important; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; }
</style>
