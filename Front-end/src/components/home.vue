<script setup>
import { ref } from 'vue'

const plans = [
  {
    id: 'free',
    name: 'Essencial',
    price: '0,00',
    description: 'Perfeito para descobrir novas sonoridades sem custo.',
    features: ['Biblioteca de 50M de faixas', 'Qualidade de áudio padrão', 'Suporte com anúncios'],
    buttonText: 'Começar Grátis',
    color: '#64748b',
    featured: false
  },
  {
    id: 'basic',
    name: 'Pro',
    price: '14,90',
    description: 'A liberdade de ouvir o que quiser, onde estiver.',
    features: ['Sem interrupções', 'Pulos ilimitados', 'Áudio de alta fidelidade', 'Ouvir offline'],
    buttonText: 'Assinar Pro',
    color: '#3b82f6',
    featured: false
  },
  {
    id: 'premium',
    name: 'Elite',
    price: '29,90',
    description: 'O ápice da experiência sonora para audiófilos.',
    features: ['Áudio Ultra Hi-Fi (Lossless)', 'Até 6 perfis familiares', 'Acesso antecipado a álbuns', 'Dispositivos ilimitados'],
    buttonText: 'Seja Elite',
    color: '#8b5cf6',
    featured: true
  }
]
</script>

<template>
  <div class="site-wrapper">
    <nav class="navbar">
      <div class="nav-content">
        <div class="brand">
          <h1 class="logo">Music<span>fy</span></h1>
        </div>
        
        <div class="nav-right">
          <div class="nav-links">
            <a href="#explorar">Explorar</a>
            <a href="#sobre">Sobre</a>
          </div>
          <button class="btn-login">Entrar</button>
        </div>
      </div>
    </nav>

    <header class="hero-section">
      <div class="hero-content">
        <div class="badge-container">
          <span class="badge">Lançamento 2026</span>
        </div>
        <h2>Sua música, <br>do seu jeito.</h2>
        <p>Milhões de faixas com a maior fidelidade sonora do mercado.</p>
        <div class="hero-btns">
          <button class="btn-primary">Explorar Planos</button>
        </div>
      </div>
    </header>

    <section id="explorar" class="pricing-section">
      <div class="plans-wrapper">
        <div 
          v-for="plan in plans" 
          :key="plan.id" 
          :class="['plan-card', { 'is-featured': plan.featured }]"
        >
          <div v-if="plan.featured" class="popular-tag">RECOMENDADO</div>
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
          <button>
          <router-link :to="`/pagamento`"
          class="btn-plan" :style="{ backgroundColor: plan.color }">
            {{ plan.buttonText }}
          </router-link>
          </button>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <p>&copy; 2026 Musicfy. Sem fronteiras para o som.</p>
    </footer>
  </div>
</template>

<style>
/* Reset e Base Global */
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

#app { width: 100%; }
</style>

<style scoped>
.site-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar Estilizada */
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
.logo span { color: #3b82f6; }

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

.nav-links a:hover { color: #fff; }

.btn-login {
  background: #fff;
  color: #020617;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-login:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

/* Hero Section Refinada */
.hero-section {
  padding-top: 160px;
  padding-bottom: 100px;
  background: radial-gradient(circle at top, #1e1b4b 0%, #020617 70%);
  text-align: center;
}

.badge-container { margin-bottom: 1.5rem; }
.badge {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  max-width: 550px;
  margin: 0 auto 2.5rem;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
}

/* Seção de Planos (Grid Lado a Lado) */
.pricing-section {
  padding: 100px 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.plans-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: stretch;
}

.plan-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.is-featured {
  background: #131233;
  border: 2px solid #8b5cf6;
  transform: scale(1.05);
  z-index: 10;
}

.popular-tag {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: #8b5cf6; color: #fff; padding: 0.3rem 1rem; border-radius: 100px; font-size: 0.7rem; font-weight: 800;
}

.card-body { flex-grow: 1; }
.card-body h4 { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 1rem; }
.price { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 1rem; }
.val { font-size: 3rem; font-weight: 800; }
.desc { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin-bottom: 2rem; }

.feat-list { list-style: none; padding: 0; margin-bottom: 2rem; }
.feat-list li { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; font-size: 0.85rem; color: #cbd5e1; }
.dot { width: 6px; height: 6px; border-radius: 50%; }

.btn-plan {
  border: none; padding: 1rem; border-radius: 12px; color: #fff; font-weight: 700; cursor: pointer; transition: opacity 0.2s;
}

.site-footer {
  text-align: center;
  padding: 4rem 2rem;
  color: #475569;
  font-size: 0.85rem;
}

/* Responsividade */
@media (max-width: 1024px) {
  .plans-wrapper { grid-template-columns: 1fr 1fr; }
  .is-featured { transform: scale(1); }
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .plans-wrapper { grid-template-columns: 1fr; }
}
</style>