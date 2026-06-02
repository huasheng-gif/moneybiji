<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', icon: '📊', label: '总览' },
  { path: '/transactions', icon: '💸', label: '流水' },
  { path: '/budgets', icon: '🗂️', label: '预算' },
  { path: '/savings', icon: '🎯', label: '储蓄' },
  { path: '/reports', icon: '📈', label: '报告' },
  { path: '/settings', icon: '⚙️', label: '设置' }
]
</script>

<template>
  <aside class="sidebar">
    <div class="logo">💰 记账助手</div>
    <nav>
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px; background: var(--color-card);
  border-right: 1px solid var(--color-border);
  padding: 20px 0; display: flex; flex-direction: column;
}
.logo {
  font-size: 20px; font-weight: 700;
  padding: 0 20px 20px; border-bottom: 1px solid var(--color-border);
  margin-bottom: 12px;
}
nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  text-decoration: none; color: var(--color-text-secondary);
  font-size: 14px; transition: all 0.2s;
}
.nav-item:hover { background: var(--color-bg); color: var(--color-text); }
.nav-item.active { background: var(--color-primary); color: white; }
.nav-icon { font-size: 18px; }
</style>
