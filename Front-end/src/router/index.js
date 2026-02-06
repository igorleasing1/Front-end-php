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
    // ADICIONE ESTA ROTA ABAIXO:
    {
      path: '/perfil',
      name: 'perfil',
      // Certifique-se de que o nome do arquivo é Perfil.vue ou perfil.vue
      component: () => import('../components/perfil.vue') 
    }
  ]
})

export default router