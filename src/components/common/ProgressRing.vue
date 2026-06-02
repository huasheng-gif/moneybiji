<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}>(), {
  size: 80,
  strokeWidth: 6,
  color: 'var(--color-primary)'
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value - (props.percentage / 100) * circumference.value)
</script>

<template>
  <svg :width="size" :height="size" class="progress-ring">
    <circle
      :cx="size / 2" :cy="size / 2" :r="radius"
      fill="none" stroke="var(--color-border)" :stroke-width="strokeWidth"
    />
    <circle
      :cx="size / 2" :cy="size / 2" :r="radius"
      fill="none" :stroke="color" :stroke-width="strokeWidth"
      stroke-linecap="round"
      :stroke-dasharray="circumference" :stroke-dashoffset="offset"
      class="ring-progress"
    />
    <text
      :x="size / 2" :y="size / 2"
      text-anchor="middle" dominant-baseline="central" class="ring-text"
    >
      {{ percentage }}%
    </text>
  </svg>
</template>

<style scoped>
.progress-ring { transform: rotate(-90deg); }
.ring-progress { transition: stroke-dashoffset 0.5s ease; }
.ring-text {
  font-size: 14px; font-weight: 600; fill: var(--color-text);
  transform: rotate(90deg); transform-origin: center;
}
</style>
