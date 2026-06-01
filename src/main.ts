import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/Dashboard.vue') },
    { path: '/onboarding', component: () => import('./views/Onboarding.vue') },
    { path: '/transactions', component: () => import('./views/Transactions.vue') },
    { path: '/budgets', component: () => import('./views/Budgets.vue') },
    { path: '/savings', component: () => import('./views/Savings.vue') },
    { path: '/reports', component: () => import('./views/Reports.vue') },
    { path: '/settings', component: () => import('./views/Settings.vue') }
  ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
