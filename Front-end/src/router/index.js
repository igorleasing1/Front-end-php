import { createRouter, createWebHistory } from 'vue-router'
// Verifique se o HomeView também não está na pasta components! 
// Se estiver, mude para '../components/home.vue'
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
      // Ajustado para a pasta 'components' e nome 'Pagamentos.vue' conforme sua imagem
      component: () => import('../components/Pagamentos.vue')
    }
  ]
})

export default router