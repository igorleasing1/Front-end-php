<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api/index.js'; 

const router = useRouter();
const route = useRoute();

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const stripeError = ref('');
const detectedBrand = ref('unknown'); 

const currentStep = ref(1); 
const isLoading = ref(false);
const progress = ref(0);


const getLoggedUser = () => {
  try {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Erro ao ler usuário do localStorage", e);
    return null;
  }
};

const getAuthToken = () => localStorage.getItem('jwt_token'); 


const cardBrands = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  elo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Elo_logo_2022.svg',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
  unknown: 'https://cdn-icons-png.flaticon.com/512/179/179457.png'
};
  
const plan = ref({
  name: route.query.name || 'Plano não selecionado',
  price: route.query.price || '0,00',
  plan_id: route.query.plan_id,   
  price_id: route.query.plan_price_id
});

onMounted(() => {
  if (window.Stripe) {
    initStripe();
  } else {
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/";
    script.onload = initStripe;
    document.head.appendChild(script);
  }
});

const initStripe = () => {
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  if (!publicKey) {
    console.error("Erro: VITE_STRIPE_PUBLIC_KEY não definida no .env");
    return;
  }
  stripe.value = window.Stripe(publicKey);
};

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
      if (event.brand) detectedBrand.value = event.brand;
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
  const user = getLoggedUser();
  const token = getAuthToken();

    if (!token) {
  stripeError.value = "Você precisa estar logado para finalizar a assinatura.";
  router.push('/cadastro')
  return;
}

  isLoading.value = true;
  stripeError.value = '';
  progress.value = 10;

  try {
    const cleanPrice = parseFloat(plan.value.price.toString().replace(',', '.'));
    

    const { data: intentData } = await api.post('/create-payment-intent', 
      { amount: Math.round(cleanPrice * 100) },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    progress.value = 50;

    if (!intentData.clientSecret) {
        throw new Error("O servidor não retornou o clientSecret.");
    }

    const result = await stripe.value.confirmCardPayment(intentData.clientSecret, {
      payment_method: { 
        card: cardElement.value 
      }
    });

    if (result.error) {
      stripeError.value = result.error.message;
      isLoading.value = false;
    } else {
      progress.value = 80;

  
       await api.post('/assinaturas', {
          plan_id: plan.value.plan_id,
          plan_price_id: plan.value.price_id
              }, {
            headers: {
            Authorization: `Bearer ${token}`
  }
});

      progress.value = 100;
      alert('Assinatura ativada com sucesso!');
      router.push('/');
    }
  } catch (e) {
    console.error("Erro detalhado:", e);
    stripeError.value = e.response?.data?.message || "Erro ao processar pagamento.";
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="checkout-wrapper">
    <div v-if="isLoading" class="progress-bar-top" :style="{ width: progress + '%' }"></div>

    <div class="checkout-card">
      <header class="header">
        <button @click="currentStep === 2 ? currentStep = 1 : router.back()" class="back-btn">
          Voltar
        </button>
        <h1 class="logo">MÚSICA<span>.</span></h1>
      </header>

      <div class="summary">
        <div>
          <span class="label">Plano Selecionado</span>
          <h3>{{ plan.name }}</h3>
        </div>
        <div class="price">
          <span class="currency">R$</span>
          <span class="val">{{ plan.price }}</span>
        </div>
      </div>

      <div v-if="currentStep === 2" class="stripe-field-container">
        <div class="field-header">
          <span class="subtitle">Dados do Cartão</span>
          <img :src="cardBrands[detectedBrand] || cardBrands.unknown" class="detected-brand-icon" />
        </div>
        <div id="card-element"></div>
        <p v-if="stripeError" class="error-msg">{{ stripeError }}</p>
      </div>

      <button @click="handleAction" class="btn-primary" :disabled="isLoading">
        <span v-if="!isLoading">
          {{ currentStep === 1 ? 'Continuar para Pagamento' : 'Finalizar Assinatura' }}
        </span>
        <span v-else>Processando...</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

.progress-bar-top {
  position: fixed;
  top: 0; left: 0; height: 4px;
  background: #2563eb;
  transition: width 0.3s ease;
  z-index: 9999;
}

.stripe-field-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1rem;
}

#card-element { width: 100%; }

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.8rem;
}

.detected-brand-icon { height: 20px; }
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

/* --- ESTILOS DO NOVO BOTÃO DE VOLTAR --- */
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 99px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-btn svg {
  transition: transform 0.3s ease;
}

.back-btn:hover svg {
  transform: translateX(-2px);
}
/* -------------------------------------- */

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
.card-logo { width: 100%; height: 100%; object-fit: contain;}

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

.stripe-field-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detected-brand-icon {
  height: 24px;
  width: auto;
  border-radius: 4px;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .checkout-card { padding: 2rem; border-radius: 0; min-height: 100vh; max-width: 100%; }
}
</style>