import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useFinanceStore } from './stores/finance'
import './assets/main.css'

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

const pinia = createPinia()

router.beforeEach((to) => {
  const store = useFinanceStore()
  if (store.isNewUser && to.path !== '/onboarding') {
    return '/onboarding'
  }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
