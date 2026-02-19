<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/index.js';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
  email: '',
  password: ''
});


const isFormValid = computed(() => {
  return form.value.email.includes('@') && form.value.password.length >= 6;
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
   
    const response = await api.post('/login', {
      email: form.value.email,
      password: form.value.password
    });


   
    if (response.data.token) {
      localStorage.setItem('user_token', response.data.data.token);
    }
    localStorage.setItem('user_data', JSON.stringify(response.data.user));

  
    router.push('/');
    
  } catch (error) {
 
    if (error.response && error.response.status === 401) {
      errorMessage.value = "E-mail ou senha incorretos.";
    } else {
      errorMessage.value = error.response?.data?.message || "Erro ao conectar com o servidor.";
    }
    console.error('Erro no login:', error);
  } finally {
    isLoading.value = false;
  }
};

const goSignup = () => {
  router.push('/cadastro');
};
</script>

<template>
  <div class="login-wrapper">
    <div class="glow-shape"></div>

    <div class="card">
      <div class="card-header">
        <div class="icon">🎵</div>
        <h2>Bem-vindo</h2>
        <p v-if="!errorMessage">Acesse sua biblioteca musical</p>
        <p v-else class="error-msg">{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input 
            type="email" 
            v-model="form.email" 
            placeholder="Email" 
            :disabled="isLoading"
            required 
          />
        </div>

        <div class="input-group">
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="Senha" 
            :disabled="isLoading"
            required 
          />
        </div>

        <button type="submit" class="btn-main" :disabled="!isFormValid || isLoading">
          <span v-if="isLoading">Verificando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <div class="divider">ou</div>

      <p class="footer-text">
        Não tem conta? 
        <a href="#" @click.prevent="goSignup">Crie agora</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Mantendo seus estilos originais e adicionando ajustes de feedback */

.error-msg {
  color: #f87171 !important; /* Vermelho suave */
  font-weight: 500;
  font-size: 0.85rem !important;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #030712; 
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden; 
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  padding: 3rem 3.5rem; 
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
  margin-bottom: 2rem;
}

.icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  animation: float 4s ease-in-out infinite;
}

h2 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8a2be2 0%, #00d4ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #9ca3af;
  font-size: 0.95rem;
  margin-top: 6px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #00d4ff;
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-main {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #8a2be2, #00d4ff);
  border: none;
  border-radius: 14px;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s;
}

.btn-main:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 212, 255, 0.2);
}

.btn-main:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.divider {
  margin: 1.5rem 0;
  text-align: center;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.footer-text {
  text-align: center;
  font-size: 0.95rem;
  color: #9ca3af;
}

.footer-text a {
  color: #00d4ff;
  text-decoration: none;
  font-weight: 700;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.glow-shape {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>