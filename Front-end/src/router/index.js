import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pagamento',
      name: 'pagamento',
      component: () => import('../components/Pagamentos.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../components/perfil.vue')
    },
    // Nova rota para Planos
    {
      path: '/planos',
      name: 'planos',
      component: () => import('../components/planos.vue')
    }
  ]
})

export default router