<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = (e) => {
  e.preventDefault()
  isLoading.value = true
  
  // Simulação de autenticação
  setTimeout(() => {
    isLoading.value = false
    router.push('/')
  }, 1500)
}
</script>

<template>
  <div class="login-wrapper">
    <router-link to="/" class="back-button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Voltar para Início
    </router-link>

    <div class="login-card">
      <header class="login-header">
        <h1 class="logo">MÚSICA<span>.</span></h1>
        <h2>Bem-vindo de volta</h2>
        <p>Insira suas credenciais para acessar sua conta.</p>
      </header>

      <form @submit="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="seu@email.com" 
            required
          >
        </div>

        <div class="input-group">
          <div class="label-row">
            <label for="password">Senha</label>
            <a href="#" class="forgot-link">Esqueceu?</a>
          </div>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required
          >
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="!isLoading">Entrar na conta</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <footer class="login-footer">
        <p>Não tem uma conta? <router-link to="/explorar">Criar conta grátis</router-link></p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 1. CONTAINER CENTRALIZADO */
.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #020617; /* Slate 950 */
  background: radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%);
  font-family: 'Inter', system-ui, sans-serif;
  padding: 20px;
}

/* 2. CARD DE LOGIN */
.login-card {
  background: #0f172a; /* Slate 900 */
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 3. TIPOGRAFIA */
.login-header { text-align: center; margin-bottom: 2.5rem; }

.logo { 
  font-size: 1.25rem; 
  font-weight: 900; 
  letter-spacing: -0.5px;
  color: #fff; 
  margin-bottom: 1.5rem;
}
.logo span { color: #2563eb; }

.login-header h2 { color: #fff; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
.login-header p { color: #94a3b8; font-size: 0.9rem; }

/* 4. FORMULÁRIO */
.login-form { display: flex; flex-direction: column; gap: 1.5rem; }

.input-group { display: flex; flex-direction: column; gap: 0.5rem; }

.label-row { display: flex; justify-content: space-between; align-items: center; }

label { color: #f8fafc; font-size: 0.85rem; font-weight: 600; }

input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.9rem 1.1rem;
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.05);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.forgot-link { color: #2563eb; text-decoration: none; font-size: 0.8rem; font-weight: 600; }

/* 5. BOTÃO */
.btn-login {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-login:hover { background: #1d4ed8; transform: translateY(-1px); }
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

/* 6. FOOTER LOGIN */
.login-footer { margin-top: 2rem; text-align: center; }
.login-footer p { color: #64748b; font-size: 0.85rem; }
.login-footer a { color: #fff; text-decoration: none; font-weight: 600; margin-left: 5px; }
.login-footer a:hover { text-decoration: underline; }

/* BOTÃO VOLTAR */
.back-button {
  position: absolute;
  top: 40px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}
.back-button svg { width: 16px; height: 16px; }
.back-button:hover { color: #fff; }

/* LOADING SPINNER */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 480px) {
  .login-card { padding: 2rem; border-radius: 0; min-height: 100vh; border: none; }
  .back-button { top: 20px; left: 20px; }
}
</style>