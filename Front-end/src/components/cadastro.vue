<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const handleRegister = (e) => {
  e.preventDefault()
  
  if (form.value.password !== form.value.confirmPassword) {
    alert("As senhas não coincidem!")
    return
  }

  isLoading.value = true
  
  // Simulação de criação de conta
  setTimeout(() => {
    isLoading.value = false
    router.push('/login')
  }, 2000)
}
</script>

<template>
  <div class="register-wrapper">
    <div class="side-info">
      <router-link to="/" class="brand-link">
        <h1 class="logo">MÚSICA<span>.</span></h1>
      </router-link>
      <div class="side-content">
        <h2>A sua melhor versão musical começa aqui.</h2>
        <p>Junte-se a milhares de audiófilos e descubra o som em sua forma mais pura.</p>
      </div>
    </div>

    <div class="register-container">
      <div class="register-card">
        <header class="card-header">
          <h2>Criar conta</h2>
          <p>Preencha os dados abaixo para começar.</p>
        </header>

        <form @submit="handleRegister" class="register-form">
          <div class="input-row">
            <div class="input-group">
              <label>Nome completo</label>
              <input type="text" v-model="form.name" placeholder="Ex: João Silva" required>
            </div>
          </div>

          <div class="input-group">
            <label>E-mail</label>
            <input type="email" v-model="form.email" placeholder="seu@email.com" required>
          </div>

          <div class="input-grid">
            <div class="input-group">
              <label>Senha</label>
              <input type="password" v-model="form.password" placeholder="••••••••" required>
            </div>
            <div class="input-group">
              <label>Confirmar senha</label>
              <input type="password" v-model="form.confirmPassword" placeholder="••••••••" required>
            </div>
          </div>

          <label class="checkbox-group">
            <input type="checkbox" v-model="form.terms" required>
            <span class="checkbox-text">
              Eu aceito os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a>.
            </span>
          </label>

          <button type="submit" class="btn-register" :disabled="isLoading">
            <span v-if="!isLoading">Criar minha conta</span>
            <span v-else class="loader"></span>
          </button>
        </form>

        <footer class="card-footer">
          <p>Já possui uma conta? <router-link to="/login">Fazer login</router-link></p>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. LAYOUT BASE */
.register-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #020617;
  font-family: 'Inter', system-ui, sans-serif;
}

/* 2. LADO ESQUERDO (INFO) */
.side-info {
  flex: 1;
  background: radial-gradient(circle at 100% 0%, #1e293b 0%, #020617 100%);
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.logo { font-size: 1.5rem; font-weight: 900; color: #fff; text-decoration: none; }
.logo span { color: #2563eb; }

.side-content h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -2px;
}

.side-content p {
  color: #94a3b8;
  font-size: 1.1rem;
  max-width: 400px;
}

/* 3. LADO DIREITO (FORM) */
.register-container {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.register-card {
  width: 100%;
  max-width: 480px;
  background: #0f172a;
  padding: 3.5rem;
  border-radius: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
}

.card-header { margin-bottom: 2.5rem; }
.card-header h2 { font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.card-header p { color: #64748b; font-size: 0.95rem; }

/* 4. FORMULÁRIO */
.register-form { display: flex; flex-direction: column; gap: 1.5rem; }

.input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.input-group { display: flex; flex-direction: column; gap: 0.5rem; }
label { color: #f8fafc; font-size: 0.85rem; font-weight: 600; }

input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  color: #fff;
  transition: 0.2s;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.05);
}

/* CHECKBOX */
.checkbox-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  margin-top: 0.5rem;
}

.checkbox-text { color: #94a3b8; font-size: 0.8rem; line-height: 1.4; }
.checkbox-text a { color: #2563eb; text-decoration: none; font-weight: 600; }

/* BOTÃO */
.btn-register {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 1.1rem;
  border-radius: 0.85rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-register:hover { background: #1d4ed8; transform: translateY(-2px); }

.card-footer { margin-top: 2rem; text-align: center; font-size: 0.9rem; color: #64748b; }
.card-footer a { color: #fff; text-decoration: none; font-weight: 600; }

/* LOADING */
.loader {
  width: 20px; height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 5. RESPONSIVIDADE */
@media (max-width: 1024px) {
  .side-info { display: none; }
  .register-wrapper { justify-content: center; align-items: center; }
}

@media (max-width: 480px) {
  .register-container { padding: 0; }
  .register-card { border-radius: 0; min-height: 100vh; padding: 3rem 1.5rem; }
  .input-grid { grid-template-columns: 1fr; }
}
</style>