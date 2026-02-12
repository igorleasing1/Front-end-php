import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/home.vue' 
import LoginView from '../components/login.vue' 

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
    // ROTA DE LOGIN ADICIONADA:
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/login.vue') // Ou use o import dinâmico como nos de cima
    }
  ]
})

export default router