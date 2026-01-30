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
        <h1 class="logo">Sound<span>fy</span></h1>
        
        <router-link to="/" class="btn-text">Mudar plano</router-link>
      </header>

      <section class="summary">
        <div class="info">
          <h3>{{ plan.name }}</h3>
          <p>{{ plan.description }}</p>
        </div>
        <div class="price">
          R$ {{ plan.price.toFixed(2).replace('.', ',') }}<span>/mês</span>
        </div>
      </section>

      <section class="methods">
        <h4>Forma de pagamento</h4>
        
        <label :class="['method-tile', { active: paymentMethod === 'credit-card' }]">
          <div class="tile-main">
            <input type="radio" v-model="paymentMethod" value="credit-card">
            <div class="content">
              <span class="title">Cartão de Crédito</span>
            </div>
          </div>

          <Transition name="expand">
            <div v-if="paymentMethod === 'credit-card'" class="card-list">
              <p class="subtitle">Aceitamos as principais bandeiras:</p>
              <div class="brands-grid">
                <div v-for="brand in cardBrands" :key="brand.id" class="brand-badge" :title="brand.name">
                  <img :src="brand.logo" :alt="brand.name" class="card-logo">
                </div>
              </div>
            </div>
          </Transition>
        </label>

        <label :class="['method-tile', { active: paymentMethod === 'pix' }]">
          <div class="tile-main">
            <input type="radio" v-model="paymentMethod" value="pix">
            <div class="content">
              <span class="title">Pix</span>
              <span class="badge">Aprovação imediata</span>
            </div>
          </div>
        </label>
      </section>

      <button @click="handleCheckout" class="btn-primary">
        Finalizar Assinatura
      </button>

      <p class="legal">
        Ambiente seguro e criptografado. Cancele quando quiser.
      </p>
    </div>
  </div>
</template>

<style scoped>

.checkout-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #020617; 
  font-family: 'Inter', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
}

.checkout-card {
  background: #0f172a; 
  width: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.logo { font-size: 1.6rem; font-weight: 800; color: #fff; margin: 0; }
.logo span { color: #3b82f6; } 

.btn-text {
  background: none;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.btn-text:hover { color: #fff; }

.summary {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.summary h3 { margin: 0; font-size: 1rem; color: #fff; }
.summary p { margin: 0.2rem 0 0; font-size: 0.8rem; color: #94a3b8; }
.price { font-weight: 800; font-size: 1.3rem; color: #fff; }
.price span { font-size: 0.85rem; color: #94a3b8; }

.methods h4 { margin-bottom: 1.2rem; font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; }

.method-tile {
  display: flex;
  flex-direction: column;
  padding: 1.2rem;
  border: 2px solid #1e293b;
  border-radius: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fff;
}

.method-tile.active {
  border-color: #3b82f6; 
  background-color: rgba(59, 130, 246, 0.05);
}

.tile-main {
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

.method-tile input { accent-color: #3b82f6; width: 1.2rem; height: 1.2rem; }

.badge {
  background: #3b82f6;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  margin-left: 0.8rem;
  text-transform: uppercase;
}

.card-list {
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.brands-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.brand-badge {
  background: #ffffff;
  padding: 0.3rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px; 
  height: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.card-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.4s ease;
  max-height: 250px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.btn-primary {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1.2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  transition: all 0.3s;
}

.btn-primary:hover { 
  background: #2563eb; 
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
}

.legal {
  text-align: center;
  font-size: 0.75rem;
  color: #475569;
  margin-top: 2rem;
}
</style>