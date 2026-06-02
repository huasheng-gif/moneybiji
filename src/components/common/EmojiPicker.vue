<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ select: [emoji: string] }>()

const commonEmojis = [
  '🍜', '🍕', '🍔', '☕', '🛒', '🏠', '🚇', '🚗',
  '🎮', '🎬', '📚', '💊', '👕', '📱', '✈️', '🎁',
  '📦', '💡', '🎵', '💼', '🏋️', '💇', '🐾', '💰'
]

const show = ref(false)
</script>

<template>
  <div class="emoji-picker-wrapper">
    <button class="btn btn-ghost" @click="show = !show">😀</button>
    <div v-if="show" class="emoji-grid">
      <button
        v-for="emoji in commonEmojis" :key="emoji"
        class="emoji-btn"
        @click="emit('select', emoji); show = false"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker-wrapper { position: relative; }
.emoji-grid {
  position: absolute; top: 100%; left: 0;
  background: var(--color-card); border: 1px solid var(--color-border);
  border-radius: var(--radius); padding: 8px;
  display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px;
  z-index: 100; box-shadow: var(--shadow);
}
.emoji-btn {
  width: 36px; height: 36px; border: none; background: none;
  font-size: 20px; cursor: pointer; border-radius: 6px;
}
.emoji-btn:hover { background: var(--color-bg); }
</style>
