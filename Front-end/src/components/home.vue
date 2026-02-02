<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

const plans = [
  {
    id: 'free',
    name: 'Essencial',
    price: '0,00',
    description: 'A porta de entrada para sua jornada musical.',
    features: ['50 milhões de faixas', 'Modo aleatório', 'Qualidade padrão'],
    buttonText: 'Começar grátis',
    color: '#64748b',
    featured: false
  },
  {
    id: 'basic',
    name: 'Standard',
    price: '14,90',
    description: 'A escolha ideal para quem ouve todo dia.',
    features: ['Zero anúncios', 'Modo offline', 'Pulos ilimitados', 'Áudio HD'],
    buttonText: 'Assinar agora',
    color: '#2563eb',
    featured: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29,90',
    description: 'O som definitivo para quem não aceita menos.',
    features: ['Qualidade Lossless', 'Som Espacial', 'Lançamentos VIP', 'Até 6 contas'],
    buttonText: 'Experimentar',
    color: '#0f172a',
    featured: true
  }
]

const handleNavigation = (e) => {
  e.preventDefault()
  isLoading.value = true
  setTimeout(() => {
    router.push('/pagamento')
  }, 1200)
}
</script>

<template>
  <div class="site-wrapper">
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <p class="loading-text">Sincronizando áudio...</p>
        </div>
      </div>
    </Transition>

    <nav class="navbar">
      <div class="nav-content">
        <div class="brand">
          <h1 class="logo">MÚSICA<span>.</span></h1>
        </div>
        <div class="nav-right">
          <a href="#explorar" class="nav-link">Assine o premium</a>
          <button class="btn-outline">Entrar</button>
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-container">
        <span class="badge">Disponível em 4K Áudio</span>
        <h2 class="hero-title">Sinta cada batida.</h2>
        <p class="hero-subtitle">Mergulhe em uma biblioteca infinita com curadoria humana e tecnologia de ponta.</p>
        <div class="hero-actions">
          <a href="#explorar" class="btn-main">Conhecer Planos</a>
        </div>
      </div>
    </header>

    <section class="welcome">
      <div class="welcome-box">
        <h3 class="welcome-title">Ficamos felizes em ver você.</h3>
        <p class="welcome-text">Seja para relaxar ou para focar, temos o plano perfeito para o seu ritmo.</p>
      </div>
    </section>

    <section id="explorar" class="pricing">
      <div class="pricing-grid">
        <div 
          v-for="plan in plans" 
          :key="plan.id" 
          :class="['card', { 'featured': plan.featured }]"
        >
          <div v-if="plan.featured" class="tag">MAIS POPULAR</div>
          
          <div class="card-header">
            <span class="plan-label">{{ plan.name }}</span>
            <div class="price-row">
              <span class="currency">R$</span>
              <span class="amount">{{ plan.price }}</span>
              <span class="freq">/mês</span>
            </div>
            <p class="plan-desc">{{ plan.description }}</p>
          </div>

          <div class="card-body">
            <ul class="features">
              <li v-for="feat in plan.features" :key="feat">
                <span class="icon">✓</span> {{ feat }}
              </li>
            </ul>
          </div>

          <div class="card-footer">
            <a href="/pagamento" @click="handleNavigation"
               class="btn-plan" 
               :style="{ backgroundColor: plan.featured ? '#2563eb' : '#1e293b' }">
              {{ plan.buttonText }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>&copy; 2026 AudioCore. Música sem fronteiras.</p>
    </footer>
  </div>
</template>

<style>
/* -------------------------------------------------- 
  1. CONFIGURAÇÕES GLOBAIS & VARIÁVEIS
  -------------------------------------------------- 
*/
:root {
  --bg-dark: #020617;
  --bg-card: #0f172a;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --glass: rgba(255, 255, 255, 0.02);
  
  /* Curva de animação sofisticada */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* -------------------------------------------------- 
  2. NAVEGAÇÃO (NAVBAR)
  -------------------------------------------------- 
*/
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.logo span {
  color: var(--primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-link {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s var(--ease);
}

.nav-link:hover {
  color: #fff;
}

.btn-outline {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.6rem 1.25rem;
  border-radius: 99px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s var(--ease);
}

.btn-outline:hover {
  background: #fff;
  color: var(--bg-dark);
  border-color: #fff;
}

/* -------------------------------------------------- 
  3. CABEÇALHO PRINCIPAL (HERO)
  -------------------------------------------------- 
*/
.hero {
  padding: 160px 1.5rem 80px;
  text-align: center;
  background: radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%);
}

.badge {
  background: var(--glass);
  color: var(--primary);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 0.4rem 1rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  margin: 1.5rem 0;
  letter-spacing: -3px;
  line-height: 1;
}

.hero-subtitle {
  color: var(--text-dim);
  max-width: 540px;
  margin: 0 auto 2.5rem;
  font-size: 1.15rem;
}

.btn-main {
  background: var(--primary);
  color: #fff;
  padding: 1.1rem 2.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s var(--ease);
  display: inline-block;
  box-shadow: 0 10px 20px -10px rgba(37, 99, 235, 0.4);
}

.btn-main:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -10px rgba(37, 99, 235, 0.5);
}

/* -------------------------------------------------- 
  4. SEÇÃO DE BOAS-VINDAS
  -------------------------------------------------- 
*/
.welcome {
  padding: 40px 1.5rem;
}

.welcome-box {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background: var(--glass);
  border: 1px solid var(--border-subtle);
  padding: 4rem 2rem;
  border-radius: 32px;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
}

.welcome-text {
  color: var(--text-dim);
  font-size: 1.05rem;
  max-width: 500px;
  margin: 0 auto;
}

/* -------------------------------------------------- 
  5. CARDS DE PREÇO (PRICING)
  -------------------------------------------------- 
*/
.pricing {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 2rem 120px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 28px;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.4s var(--ease);
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.12);
}

.card.featured {
  background: #ffffff;
  color: #020617;
  transform: scale(1.05);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3);
}

.tag {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 0.65rem;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: 0.5px;
}

.plan-label {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-dim);
  letter-spacing: 1.5px;
}

.featured .plan-label { color: #64748b; }

.price-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 1.5rem 0;
}

.amount {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -2px;
}

.freq {
  font-size: 1rem;
  color: var(--text-dim);
}

.featured .freq { color: #64748b; }

.plan-desc {
  font-size: 0.95rem;
  color: var(--text-dim);
  margin-bottom: 2.5rem;
  min-height: 3rem;
  line-height: 1.5;
}

.featured .plan-desc { color: #475569; }

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 3rem 0;
  flex-grow: 1;
}

.features li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.icon {
  color: var(--primary);
  font-weight: bold;
}

.btn-plan {
  display: block;
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: opacity 0.2s var(--ease);
}

.btn-plan:hover {
  opacity: 0.9;
}

/* -------------------------------------------------- 
  6. RODAPÉ & UTILS
  -------------------------------------------------- 
*/
.footer {
  text-align: center;
  padding: 80px 1.5rem;
  border-top: 1px solid var(--border-subtle);
  color: #475569;
  font-size: 0.85rem;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-dark);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--glass);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsividade */
@media (max-width: 1024px) {
  .pricing-grid { grid-template-columns: 1fr 1fr; }
  .card.featured { transform: scale(1); }
}

@media (max-width: 768px) {
  .pricing-grid { grid-template-columns: 1fr; }
  .nav-right { display: none; }
  .hero-title { letter-spacing: -1.5px; }
}
</style>