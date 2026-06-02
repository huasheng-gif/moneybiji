<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import './assets/main.css'

const route = useRoute()
const isOnboarding = () => route.path === '/onboarding'
</script>

<template>
  <div class="app-layout" v-if="!isOnboarding()">
    <AppSidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
  <router-view v-else />
</template>
