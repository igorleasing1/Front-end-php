
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/index.js'; 

const router = useRouter();
const route = useRoute()

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const stripeError = ref('');


const currentStep = ref(1); 
const isLoading = ref(false);
const progress = ref(0);
const paymentMethod = ref('credit-card');


const cardBrands = [
  { id: 'visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg' },
  { id: 'master', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  { id: 'elo', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Elo_logo_2022.svg' }
];

const plan = ref({
  name: route.query.name || 'Plano não selecionado',
  price: Number(route.query.price) || 0,
  description: 'Qualidade Master Studio (Lossless) + 6 Perfis'
})

onMounted(() => {
 
  if (window.Stripe) {
    stripe.value = window.Stripe('pk_test_51SxyEyCOkGmWUGLjtTG98ajkfWkSfRU8XeBs9akRV7tr1iFDTt6l0SJaUebNFYTfL1d5aklHA2lLMwHYrgSzukDm00Gx96fuTg');
  } else {
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => {
      stripe.value = window.Stripe('pk_test_51SxyEyCOkGmWUGLjtTG98ajkfWkSfRU8XeBs9akRV7tr1iFDTt6l0SJaUebNFYTfL1d5aklHA2lLMwHYrgSzukDm00Gx96fuTg');
    };
    document.head.appendChild(script);
  }
});

const mountStripe = () => {
  elements.value = stripe.value.elements();
  const style = {
    base: {
      color: "#ffffff",
      fontFamily: '"Inter", sans-serif',
      fontSize: "16px",
      "::placeholder": { color: "#64748b" }
    }
  };
  cardElement.value = elements.value.create("card", { style, hidePostalCode: true });
  
  setTimeout(() => {
    cardElement.value.mount("#card-element");
    cardElement.value.on('change', (event) => {
      stripeError.value = event.error ? event.error.message : '';
    });
  }, 100);
};

const handleAction = () => {
  if (currentStep.value === 1) {
    currentStep.value = 2;
    mountStripe();
  } else {
    processPayment();
  }
};

const processPayment = async () => {
  isLoading.value = true;
  progress.value = 30;

  try {
   
    const { data } = await api.post('/create-payment-intent', {
      amount: plan.value.price * 100,
    });

    progress.value = 70;

   
    const result = await stripe.value.confirmCardPayment(data.client_secret, {
      payment_method: { card: cardElement.value }
    });

    if (result.error) {
      stripeError.value = result.error.message;
      isLoading.value = false;
    } else {
      progress.value = 100;
      alert('Assinatura realizada com sucesso!');
      router.push('/');
    }
  } catch (e) {
    stripeError.value = "Erro ao conectar com o servidor.";
    isLoading.value = false;
  }
};


</script>

<template>
  <div class="checkout-wrapper">
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        <div class="sound-wave"><span></span><span></span><span></span></div>
        <p>Validando com Stripe...</p>
      </div>
    </Transition>

    <div class="checkout-card">
      <header class="header">
        <button @click="currentStep = 1" v-if="currentStep === 2" class="back-btn">←</button>
        <h1 class="logo">MÚSICA<span>.</span></h1>
      </header>

      <div class="summary">
        <span class="label">Plano Selecionado</span>
        <h3>{{ plan.name }}</h3>
        <p class="price">R$ {{ plan.price }}</p>
      </div>

      <Transition name="slide" mode="out-in">
        <div v-if="currentStep === 1" key="step1">
          <div class="method-tile active">
            <span>Cartão de Crédito</span>
            <div class="brands">
              <img v-for="b in cardBrands" :key="b.id" :src="b.logo" class="mini-logo" />
            </div>
          </div>
        </div>

        <div v-else key="step2">
          <div id="stripe-container">
            <div id="card-element"></div>
          </div>
          <p v-if="stripeError" class="error-msg">{{ stripeError }}</p>
        </div>
      </Transition>

      <button @click="handleAction" class="btn-primary" :disabled="isLoading">
        {{ currentStep === 1 ? 'Continuar para Pagamento' : 'Finalizar Assinatura' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.home-icon-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.3s;
}

.home-icon-btn:hover {
  color: #fff;
}

.logo { 
  font-size: 1.25rem; 
  font-weight: 900; 
  letter-spacing: -0.5px;
  color: #fff; 
  margin: 0; 
}
.logo span { color: #2563eb; }

/* REUTILIZANDO O CSS DO LOADING */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: #020617;
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bar-top {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: #2563eb;
  box-shadow: 0 0 15px #2563eb;
  transition: width 0.3s ease;
}

.sound-wave {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 40px;
  margin: 0 auto 1.5rem;
  justify-content: center;
}

.sound-wave span {
  width: 5px;
  background: #2563eb;
  border-radius: 10px;
  animation: wave 1s ease-in-out infinite;
}

.sound-wave span:nth-child(1) { height: 20%; animation-delay: 0.1s; }
.sound-wave span:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.sound-wave span:nth-child(3) { height: 60%; animation-delay: 0.3s; }
.sound-wave span:nth-child(4) { height: 85%; animation-delay: 0.4s; }
.sound-wave span:nth-child(5) { height: 40%; animation-delay: 0.5s; }

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.6); }
}

.loading-text {
  color: #f8fafc;
  font-weight: 600;
  letter-spacing: 1px;
}

/* --- RESTANTE DO SEU CSS ORIGINAL --- */
.btn-text {
  color: #64748b;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.2s ease;
}
.btn-text:hover { color: #fff; }

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

.methods h4 { 
  margin-bottom: 1.5rem; 
  font-size: 0.75rem; 
  color: #475569; 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  font-weight: 800;
}

.method-tile {
  
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
  width: 22px; height: 28px;
  display: flex; align-items: center; justify-content: center;
}
.card-logo { width: 1%;
    height: 100%;
    object-fit: contain;}

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

.mini-logo{
  display: flex;
  width: 80%;
  height: 100px;
 
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

.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 100px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .checkout-card { padding: 2rem; border-radius: 0; min-height: 100vh; max-width: 100%; }
}
</style>