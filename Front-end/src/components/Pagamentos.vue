<script setup>
import { ref } from 'vue'

const paymentMethod = ref('credit-card')
const plan = ref({
  name: 'Plano Melomaníaco',
  price: 24.90,
  description: 'Qualidade Hi-Fi + Sem anúncios'
})

// Lista de cartões com URLs de logos oficiais
const cardBrands = [
  { id: 'visa', name: 'VISA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
  { id: 'master', name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  { id: 'elo', name: 'Elo', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Elo_logo.svg' },
  { id: 'amex', name: 'Amex', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg' },
  { id: 'hiper', name: 'Hipercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Hipercard_logo.svg' }
]

const handleCheckout = () => {
  alert(`Processando pagamento via: ${paymentMethod.value}`)
}
</script>

<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">
      <header class="header">
        <h1 class="logo">🎵 Music<span>Stream</span></h1>
        <button class="btn-text">Mudar plano</button>
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
              <span class="badge">Aprovação na hora</span>
            </div>
          </div>
        </label>
      </section>

      <button @click="handleCheckout" class="btn-primary">
        Finalizar Assinatura
      </button>

      <p class="legal">
        Cancele quando quiser. Sujeito aos Termos de Uso.
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
  background-color: #121212;
  font-family: 'Inter', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
}

.checkout-card {
  background: #181818;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  max-width: 450px;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; }
.logo span { color: #1db954; }

.btn-text {
  background: none;
  border: none;
  color: #b3b3b3;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.8rem;
}

.summary {
  background: #282828;
  padding: 1.2rem;
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border: 1px solid #333;
}

.summary h3 { margin: 0; font-size: 1rem; color: #fff; }
.summary p { margin: 0.2rem 0 0; font-size: 0.8rem; color: #b3b3b3; }
.price { font-weight: 800; font-size: 1.2rem; color: #fff; }
.price span { font-size: 0.8rem; color: #b3b3b3; }

.methods h4 { margin-bottom: 1rem; font-size: 0.9rem; color: #fff; text-transform: uppercase; letter-spacing: 1px; }

.method-tile {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 2px solid #333;
  border-radius: 0.75rem;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
}

.method-tile.active {
  border-color: #1db954;
  background-color: #242424;
}

.tile-main {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.method-tile input { accent-color: #1db954; width: 1.1rem; height: 1.1rem; }

.badge {
  background: #1db954;
  color: #000;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

/* Estilos da lista de cartões */
.card-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
}

.subtitle {
  font-size: 0.75rem;
  color: #b3b3b3;
  margin-bottom: 0.8rem;
}

.brands-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.brand-badge {
  background: #ffffff;
  padding: 0.4rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 28px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.card-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Animação */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.btn-primary {
  width: 100%;
  background: #1db954;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 500px;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover { 
  background: #1ed760; 
  transform: scale(1.02);
}

.legal {
  text-align: center;
  font-size: 0.7rem;
  color: #777;
  margin-top: 1.5rem;
}
</style>