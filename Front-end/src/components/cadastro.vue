<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/index.js'; 

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

// Regras de validação da senha
const passwordRules = computed(() => {
  const p = form.value.password;
  return {
    length: p.length >= 8,
    upper: /[A-Z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(p)
  };
});

// Verifica se as senhas são idênticas
const passwordsMatch = computed(() => {
  return form.value.password.length > 0 && 
         form.value.password === form.value.password_confirmation;
});

// Validação do formulário completo
const isFormValid = computed(() => {
  return (
    form.value.name.length > 0 &&
    form.value.email.includes('@') &&
    passwordRules.value.length &&
    passwordRules.value.upper &&
    passwordRules.value.number &&
    passwordRules.value.special &&
    passwordsMatch.value
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Rota configurada no seu api.php
    await api.post('/user/criar', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    });

    router.push('/login');
  } catch (error) {
    // Captura mensagens de erro do Laravel (ex: email já cadastrado)
    errorMessage.value = error.response?.data?.message || "Erro ao criar conta. Verifique os dados.";
  } finally {
    isLoading.value = false;
  }
};

const goLogin = () => router.push('/login');
</script>

<template>
  <div class="login-wrapper">
    <div class="glow-shape"></div>

    <div class="card">
      <div class="card-header">
        <div class="icon">🎵</div>
        <h2>Nova Conta</h2>
        <p v-if="!errorMessage">Comece sua jornada musical</p>
        <p v-else class="error-msg">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input type="text" v-model="form.name" placeholder="Nome Artístico" required />
        </div>
        
        <div class="input-group">
          <input type="email" v-model="form.email" placeholder="Email" required />
        </div>

        <div class="input-group">
          <input type="password" v-model="form.password" placeholder="Senha" required />
          
          <div class="rules-grid">
            <div class="rule-item" :class="{ 'active': passwordRules.length }">
              <span class="dot"></span> 8+ caracteres
            </div>
            <div class="rule-item" :class="{ 'active': passwordRules.upper }">
              <span class="dot"></span> Maiúscula
            </div>
            <div class="rule-item" :class="{ 'active': passwordRules.number }">
              <span class="dot"></span> Número
            </div>
            <div class="rule-item" :class="{ 'active': passwordRules.special }">
              <span class="dot"></span> Especial
            </div>
          </div>
        </div>

        <div class="input-group">
          <input 
            type="password" 
            v-model="form.password_confirmation" 
            placeholder="Confirmar Senha" 
            :class="{ 'input-error': form.password_confirmation && !passwordsMatch }"
            required 
          />
          <p v-if="form.password_confirmation && !passwordsMatch" class="match-error">
            As senhas não coincidem.
          </p>
        </div>

        <button type="submit" class="btn-main" :disabled="!isFormValid || isLoading">
          <span v-if="isLoading">Processando...</span>
          <span v-else>Cadastrar</span>
        </button>
      </form>

      <div class="divider">ou</div>

      <p class="footer-text">
        Já possui conta? 
        <a href="#" @click.prevent="goLogin">Faça login</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #030712; 
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden; 
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  padding: 2.5rem 3rem; 
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 420px; 
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 500;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  animation: float 4s ease-in-out infinite;
}

h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8a2be2 0%, #00d4ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 18px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s;
}

input:focus {
  border-color: #00d4ff;
  background: rgba(0, 0, 0, 0.4);
}

.input-error {
  border-color: #ef4444 !important;
}

.match-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 4px;
  text-align: left;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.rule-item {
  font-size: 0.7rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 4px;
  height: 4px;
  background: #374151;
  border-radius: 50%;
}

.rule-item.active { color: #10b981; }
.rule-item.active .dot { background: #10b981; }

.btn-main {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #8a2be2, #00d4ff);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 5px;
  transition: all 0.2s;
}

.btn-main:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 212, 255, 0.3);
}

.btn-main:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.divider {
  margin: 1rem 0;
  text-align: center;
  color: #374151;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.footer-text {
  text-align: center;
  font-size: 0.9rem;
  color: #9ca3af;
}

.footer-text a {
  color: #00d4ff;
  text-decoration: none;
  font-weight: 700;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.glow-shape {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>