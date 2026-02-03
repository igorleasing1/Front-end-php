<script setup>
import { ref } from 'vue'

const paymentMethod = ref('credit-card')

const plan = ref({
  name: 'Plano Audiophile',
  price: 29.90,
  description: 'Qualidade Master Studio (Lossless) + 6 Perfis'
})

const cardBrands = [
  { id: 'visa', name: 'VISA', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg' },
  { id: 'master', name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  { id: 'elo', name: 'Elo', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Elo_logo_2022.svg' },
  { id: 'amex', name: 'Amex', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg' },
  { id: 'hiper', name: 'Hipercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Hipercard_logo.svg' }
]

const handleCheckout = () => {
  alert(`Processando pagamento via: ${paymentMethod.value}`)
}
</script>

<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">
      <header class="header">
        <h1 class="logo">MÚSICA<span>.</span></h1>
        <router-link to="/" class="btn-text">Mudar plano</router-link>
      </header>

      <section class="summary">
        <div class="info">
          <span class="label">Plano selecionado</span>
          <h3>{{ plan.name }}</h3>
          <p>{{ plan.description }}</p>
        </div>
        <div class="price">
          <span class="currency">R$</span>
          <span class="val">{{ plan.price.toFixed(2).replace('.', ',') }}</span>
          <span class="period">/mês</span>
        </div>
      </section>

      <section class="methods">
        <h4>Forma de pagamento</h4>
        
        <label :class="['method-tile', { active: paymentMethod === 'credit-card' }]">
          <div class="tile-main">
            <div class="radio-custom">
              <input type="radio" v-model="paymentMethod" value="credit-card">
              <span class="check"></span>
            </div>
            <div class="content">
              <span class="title">Cartão de Crédito</span>
            </div>
          </div>

          <Transition name="expand">
            <div v-if="paymentMethod === 'credit-card'" class="card-details-area">
              <p class="subtitle">Bandeiras aceitas</p>
              <div class="brands-grid">
                <div v-for="brand in cardBrands" :key="brand.id" class="brand-badge">
                  <img :src="brand.logo" :alt="brand.name" class="card-logo">
                </div>
              </div>
            </div>
          </Transition>
        </label>

        <label :class="['method-tile', { active: paymentMethod === 'pix' }]">
          <div class="tile-main">
            <div class="radio-custom">
              <input type="radio" v-model="paymentMethod" value="pix">
              <span class="check"></span>
            </div>
            <div class="content">
              <span class="title">Pix</span>
              <span class="status-badge">Liberação imediata</span>
            </div>
          </div>
        </label>
      </section>

      <footer class="actions">
        <button @click="handleCheckout" class="btn-primary">
          Confirmar e Assinar
        </button>
        <div class="security-info">
          <svg viewBox="0 0 24 24" fill="currentColor" class="lock-icon"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
          Transação criptografada de ponta a ponta
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------------------- 
  1. ESTRUTURA E FUNDO
  -------------------------------------------------- 
*/
.checkout-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #020617;
  font-family: 'Inter', system-ui, sans-serif;
  padding: 20px;
}

.checkout-card {
  background: #0f172a;
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
}

/* -------------------------------------------------- 
  2. CABEÇALHO
  -------------------------------------------------- 
*/
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.logo { 
  font-size: 1.25rem; 
  font-weight: 900; 
  letter-spacing: -0.5px;
  color: #fff; 
  margin: 0; 
}
.logo span { color: #2563eb; }

.btn-text {
  color: #64748b;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.2s ease;
}
.btn-text:hover { color: #fff; }

/* -------------------------------------------------- 
  3. RESUMO DO PEDIDO
  -------------------------------------------------- 
*/
.summary {
  background: rgba(255, 255, 255, 0.02);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.label {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #2563eb;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.summary h3 { margin: 0; font-size: 1.1rem; color: #fff; letter-spacing: -0.3px; }
.summary p { margin: 0.3rem 0 0; font-size: 0.85rem; color: #64748b; }

.price { text-align: right; color: #fff; }
.val { font-size: 1.75rem; font-weight: 800; letter-spacing: -1px; }
.currency { font-size: 1rem; font-weight: 700; margin-right: 4px; }
.period { font-size: 0.85rem; color: #64748b; margin-left: 2px; }

/* -------------------------------------------------- 
  4. MÉTODOS DE PAGAMENTO
  -------------------------------------------------- 
*/
.methods h4 { 
  margin-bottom: 1.5rem; 
  font-size: 0.75rem; 
  color: #475569; 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  font-weight: 800;
}

.method-tile {
  display: block;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.01);
  border: 2px solid #1e293b;
  border-radius: 1.25rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.method-tile.active {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.03);
}

.tile-main {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Radio Customizado */
.radio-custom { position: relative; width: 20px; height: 20px; }
.radio-custom input { opacity: 0; position: absolute; }
.check {
  position: absolute; top: 0; left: 0;
  width: 20px; height: 20px;
  border: 2px solid #334155;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.method-tile.active .check { border-color: #2563eb; border-width: 6px; }

.title { color: #fff; font-weight: 600; font-size: 0.95rem; }

.status-badge {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  margin-left: 1rem;
  text-transform: uppercase;
}

/* -------------------------------------------------- 
  5. DETALHES DO CARTÃO
  -------------------------------------------------- 
*/
.card-details-area {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.subtitle { font-size: 0.75rem; color: #64748b; margin-bottom: 1rem; }
.brands-grid { display: flex; gap: 0.75rem; }

.brand-badge {
  background: #fff;
  padding: 0.4rem;
  border-radius: 8px;
  width: 44px; height: 28px;
  display: flex; align-items: center; justify-content: center;
}
.card-logo { width: 100%; height: 100%; object-fit: contain; }

/* -------------------------------------------------- 
  6. BOTÃO E SEGURANÇA
  -------------------------------------------------- 
*/
.btn-primary {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 1.25rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 20px 30px -10px rgba(37, 99, 235, 0.5);
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #475569;
  font-size: 0.75rem;
  margin-top: 1.5rem;
  font-weight: 500;
}

.lock-icon { width: 14px; height: 14px; }

/* Animação Expand */
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 100px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }

@media (max-width: 480px) {
  .checkout-card { padding: 2rem; border-radius: 0; height: 100vh; max-width: 100%; }
}
</style>