<script setup lang="ts">
import { computed } from 'vue'
import type { SavingsGoal } from '@/types'
import ProgressRing from '@/components/common/ProgressRing.vue'

const props = defineProps<{ goal: SavingsGoal }>()
const emit = defineEmits<{
  transfer: [id: string]
  edit: [goal: SavingsGoal]
  delete: [id: string]
}>()

const percentage = computed(() =>
  props.goal.targetAmount > 0
    ? Math.round((props.goal.savedAmount / props.goal.targetAmount) * 100)
    : 0
)
const remaining = computed(() => props.goal.targetAmount - props.goal.savedAmount)
const isAchieved = computed(() => percentage.value >= 100)
</script>

<template>
  <div class="savings-card card" :class="{ achieved: isAchieved }">
    <div v-if="isAchieved" class="fireworks">🎉</div>
    <div class="card-body">
      <ProgressRing :percentage="Math.min(percentage, 100)" :size="80" color="var(--color-success)" />
      <div class="goal-info">
        <h3>{{ goal.name }}</h3>
        <div class="amounts">
          <span>已存 ¥{{ goal.savedAmount }}</span>
          <span>目标 ¥{{ goal.targetAmount }}</span>
        </div>
        <div class="remaining">{{ isAchieved ? '已达成！🎉' : `还差 ¥${remaining}` }}</div>
        <div v-if="goal.deadline" class="deadline">截止 {{ goal.deadline }}</div>
        <div v-if="goal.autoAllocate > 0" class="auto">每月自动存 ¥{{ goal.autoAllocate }}</div>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn btn-ghost" @click="emit('transfer', goal.id)">转入</button>
      <button class="btn btn-ghost" @click="emit('edit', goal)">编辑</button>
      <button class="btn btn-ghost btn-danger-text" @click="emit('delete', goal.id)">删除</button>
    </div>
  </div>
</template>

<style scoped>
.savings-card { padding: 20px; }
.savings-card.achieved { border: 2px solid var(--color-success); position: relative; }
.fireworks { position: absolute; top: -10px; right: -10px; font-size: 32px; }
.card-body { display: flex; gap: 20px; align-items: center; }
.goal-info { flex: 1; }
.goal-info h3 { margin-bottom: 8px; }
.amounts { display: flex; gap: 16px; font-size: 14px; color: var(--color-text-secondary); }
.remaining { font-weight: 600; margin-top: 8px; color: var(--color-success); }
.deadline, .auto { font-size: 12px; color: var(--color-text-secondary); margin-top: 4px; }
.card-actions {
  display: flex; gap: 8px; margin-top: 16px;
  padding-top: 12px; border-top: 1px solid var(--color-border);
}
.btn-danger-text { color: var(--color-danger) !important; }
</style>
