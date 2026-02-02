<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: '0,00',
    description: 'Para quem ama música e não quer gastar nada agora.',
    features: ['Acesso a 50 milhões de faixas', 'Modo aleatório inteligente', 'Qualidade padrão eficiente'],
    buttonText: 'testar',
    color: '#64748b',
    featured: false
  },
  {
    id: 'basic',
    name: 'Intermediario',
    price: '14,90',
    description: 'A escolha inteligente para ouvir sem interrupções.',
    features: ['Zero anúncios', 'Baixe para ouvir offline', 'Pule faixas à vontade', 'Áudio de alta definição'],
    buttonText: 'Testar ',
    color: '#3b82f6',
    featured: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29,90',
    description: 'Para quem exige a perfeição em cada nota.',
    features: ['Qualidade Master Studio (Lossless)', 'Dolby Atmos Espacial', 'Acesso a lançamentos exclusivos', 'Plano Família (até 6 contas)'],
    buttonText: 'Testar ',
    color: '#8b5cf6',
    featured: true
  }
]

const handleNavigation = (e) => {
  e.preventDefault()
  isLoading.value = true
  setTimeout(() => {
    router.push('/pagamento')
  }, 1500)
}
</script>

<template>
  <div class="site-wrapper">
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <p class="loading-text">Aguarde um momento...</p>
        </div>
      </div>
    </Transition>

    <nav class="navbar">
      <div class="nav-content">
        <div class="brand">
          <h1 class="logo"><span>TESTE</span></h1>
        </div>
        
        <div class="nav-right">
          <div class="nav-links">
            <a href="#explorar">Planos</a>
            
          </div>
          <RouterLink to="/login" class="btn-login">Login</RouterLink>
        </div>
      </div>
    </nav>

    <header class="hero-section">
      <div class="hero-content">
        <h2>Ouça agora nossas músicas, <br></h2>
        <p>Não apenas ouça. Sinta. Redescubra seus artistas favoritos com a tecnologia de áudio mais imersiva do mundo.</p>
        
        <p class="promo-text">
          <strong>teste</strong> 
        </p>

        <div class="hero-btns">
          <a href="#explorar" class="btn-primary">Ver Planos e Preços</a>
        </div>
      </div>
    </header>

    <section id="explorar" class="pricing-section">
      <div class="section-header">
        <h3>Escolha o ritmo da sua assinatura</h3>
        <p>Cancele quando quiser. Sem taxas escondidas, apenas música boa.</p>
      </div>

      <div class="plans-wrapper">
        <div 
          v-for="plan in plans" 
          :key="plan.id" 
          :class="['plan-card', { 'is-featured': plan.featured }]"
        >
          <div v-if="plan.featured" class="popular-tag">MAIS VENDIDO</div>
          
          <div class="card-body">
            <h4 :style="{ color: plan.color }">{{ plan.name }}</h4>
            
            <div class="price">
              <span class="currency">R$</span>
              <span class="val">{{ plan.price }}</span>
              <span class="period">/mês</span>
            </div>

            <p class="desc">{{ plan.description }}</p>

            <ul class="feat-list">
              <li v-for="f in plan.features" :key="f">
                <span class="dot" :style="{ background: plan.color }"></span>
                {{ f }}
              </li>
            </ul>
          </div>

          <div class="btn-container-reset">
            <a href="/pagamento" @click="handleNavigation"
               class="btn-plan" :style="{ backgroundColor: plan.color }">
              {{ plan.buttonText }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <p>&copy; </p>
    </footer>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: #020617;
  color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

#app {
  width: 100%;
}
</style>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: #020617;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #94a3b8;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.logo span {
  color: #3b82f6;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #fff;
}

.btn-login {
  background: #fff;
  color: #020617;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
}

.hero-section {
  padding-top: 160px;
  padding-bottom: 100px;
  background: radial-gradient(circle at top, #1e1b4b 0%, #020617 70%);
  text-align: center;
}

.hero-section h2 {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;
  letter-spacing: -2px;
}

.hero-section p {
  font-size: 1.15rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.promo-text {
  font-size: 0.95rem;
  color: #e2e8f0;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2.5rem;
}

.btn-primary {
  display: inline-block;
  text-decoration: none;
  background: #3b82f6;
  color: #fff;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-weight: 700;
  transition: 0.3s;
}

.pricing-section {
  padding: 80px 2rem 100px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-header h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.plans-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.plan-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.15);
}

.is-featured {
  background: linear-gradient(180deg, #131233 0%, #0f172a 100%);
  border: 2px solid #8b5cf6;
  transform: scale(1.05);
  z-index: 10;
}

.popular-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #8b5cf6;
  color: #fff;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
}

.card-body {
  flex-grow: 1;
}

.card-body h4 {
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  font-weight: 800;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.val {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
}

.desc {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  min-height: 45px;
}

.feat-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.feat-list li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.btn-container-reset {
  background: none;
  border: none;
  padding: 0;
  width: 100%;
}

.btn-plan {
  display: block;
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: 0.2s;
}

.btn-plan:hover {
  opacity: 0.9;
}

.site-footer {
  text-align: center;
  padding: 4rem 2rem;
  color: #475569;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
}

@media (max-width: 1024px) {
  .plans-wrapper {
    grid-template-columns: 1fr 1fr;
  }
  .is-featured {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .plans-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>