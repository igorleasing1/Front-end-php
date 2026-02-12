<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/index.js';

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false); // Estado para feedback visual

const form = ref({
  name: '',
  email: '',
  password: ''
});

const title = computed(() => isLogin.value ? 'Bem-vindo' : 'Nova Conta');
const buttonText = computed(() => isLogin.value ? 'Entrar' : 'Cadastrar');

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isLogin.value) {
      // Endpoint: /login (POST)
      const response = await api.post('/login', {
        email: form.value.email,
        password: form.value.password
      });
      
      // Laravel geralmente retorna ['token' => '...']
      localStorage.setItem('token', response.data.token);
      router.push('/'); 
    } else {
      // Para cadastro, você precisará de uma rota Route::post('/register') no Laravel
      const response = await api.post('/register', form.value);
      localStorage.setItem('token', response.data.token);
      router.push('/');
    }
  } catch (error) {
    console.error('Erro na autenticação:', error.response?.data?.message || error.message);
    alert('Falha na autenticação. Verifique seus dados.');
  } finally {
    loading.value = false;
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  form.value = { name: '', email: '', password: '' };
};
</script>

<template>
  <div class="login-wrapper">
    <div class="glow-shape"></div>

    <div class="card">
      <div class="card-header">
        <div class="icon">🎵</div>
        <h2>{{ title }}</h2>
        <p>Acesse sua biblioteca musical</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="input-group">
          <input type="text" v-model="form.name" placeholder="Nome Artístico" required />
        </div>
        
        <div class="input-group">
          <input type="email" v-model="form.email" placeholder="Email" required />
        </div>

        <div class="input-group">
          <input type="password" v-model="form.password" placeholder="Senha" required />
        </div>

        <button type="submit" class="btn-main">{{ buttonText }}</button>
      </form>

      <div class="divider">ou</div>

      
      <p class="footer-text">
        {{ isLogin ? 'Não tem conta?' : 'Já possui conta?' }}
        <a href="#" @click.prevent="toggleMode">
          {{ isLogin ? 'Crie agora' : 'Faça login' }}
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* COPIE O CSS ABAIXO PARA DAR O VISUAL DE MÚSICA */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f0f0f;
  color: white;
  position: relative;
  overflow: hidden;
}

.card {
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(15px);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  width: 100%;
  max-width: 380px;
  z-index: 10;
}

.card-header { text-align: center; margin-bottom: 2rem; }
.icon { font-size: 3rem; margin-bottom: 0.5rem; animation: float 3s ease-in-out infinite; }
h2 { margin: 0; font-size: 1.8rem; background: linear-gradient(to right, #8a2be2, #00d4ff); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
p { color: #888; margin-top: 5px; font-size: 0.9rem; }

.input-group { margin-bottom: 1rem; }
input {
  width: 100%;
  padding: 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  outline: none;
}
input:focus { border-color: #8a2be2; }

.btn-main {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #8a2be2, #00d4ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.divider { margin: 1.5rem 0; text-align: center; color: #555; font-size: 0.8rem; }

.btn-spotify {
  width: 100%;
  padding: 12px;
  background: #1DB954;
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.footer-text { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; color: #888; }
.footer-text a { color: #00d4ff; text-decoration: none; margin-left: 5px; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>np