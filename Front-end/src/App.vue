<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'

const router = useRouter()
const isProfileOpen = ref(false)

const isLoading = ref(false)
const progress = ref(0)

router.beforeEach((to, from, next) => {
  isLoading.value = true
  progress.value = 0
  
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
    }
  }, 100)

  to.meta.interval = interval
  next()
})

router.afterEach((to) => {
  setTimeout(() => {
    clearInterval(to.meta.interval)
    progress.value = 100
    setTimeout(() => {
      isLoading.value = false
    }, 200)
  }, 600)
})

const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
const goSignup = () => router.push('/cadastro')

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

const closeMenu = (e) => {
  if (!e.target.closest('.profile-container')) {
    isProfileOpen.value = false
  }
}

onMounted(() => window.addEventListener('click', closeMenu))
onUnmounted(() => window.removeEventListener('click', closeMenu))
</script>

<template>
  <div class="app-container">
    <Transition name="fade">
      <div v-if="isLoading" class="global-loading">
        <div class="progress-bar-top" :style="{ width: progress + '%' }"></div>
        <div class="loading-content">
          <div class="sound-wave">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <p class="loading-text">Sincronizando áudio...</p>
        </div>
      </div>
    </Transition>

    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left-group">
          <button @click="goHome" class="home-btn" title="Home">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <div class="brand">
            <h1 class="logo-text">MÚSICA<span>.</span></h1>
          </div>
        </div>

        <div class="nav-search">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="O que você quer ouvir?">
          </div>
        </div>

        <div class="nav-right">
          <div class="nav-auth">
            <button @click="goLogin" class="btn-login">Entrar</button>
            <button @click="goSignup" class="btn-signup">Inscreva-se</button>
          </div>

          <div class="profile-container">
            <button class="profile-trigger" @click.stop="toggleProfile">
              <div class="avatar">
                <img src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff" alt="Perfil">
              </div>
              <svg class="chevron" :class="{ 'active': isProfileOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            <Transition name="slide-up">
              <div v-if="isProfileOpen" class="profile-dropdown">
                <div class="dropdown-header">
                  <p class="user-name">Usuário AudioCore</p>
                  <p class="user-email">ouvinte@exemplo.com</p>
                </div>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="router.push('/perfil')">👤 Meu Perfil</button>
                <button class="dropdown-item" @click="router.push('/configuracoes')">⚙️ Configurações</button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout">🚪 Sair</button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --bg-dark: #030712;
  --primary: #2563eb;
  --text-dim: #94a3b8;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --nav-height: 88px;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--bg-dark);
  font-family: 'Inter', sans-serif;
}

.global-loading {
  position: fixed;
  inset: 0;
  background: var(--bg-dark);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.progress-bar-top {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #8a2be2, #00d4ff);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
  transition: width 0.3s ease;
}

.sound-wave {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 45px;
  margin-bottom: 1.5rem;
}

.sound-wave span {
  width: 6px;
  background: var(--primary);
  border-radius: 10px;
  animation: wave-animation 1s ease-in-out infinite;
}

@keyframes wave-animation {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.4); }
}

.loading-text {
  color: #fff;
  font-weight: 700;
  letter-spacing: 1.5px;
  font-size: 1rem;
  text-transform: uppercase;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text { 
  font-size: 1.6rem; 
  font-weight: 950; 
  color: #fff; 
  letter-spacing: 1.5px;
}

.logo-text span { color: var(--primary); }

.nav-search { 
  flex: 1; 
  max-width: 550px; 
  margin: 0 3.5rem; 
}

.search-input-wrapper input {
  width: 100%; 
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle); 
  border-radius: 99px;
  padding: 14px 20px 14px 52px; 
  color: #fff; 
  font-size: 1rem; 
  outline: none;
  transition: border-color 0.3s;
}

.search-input-wrapper input:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.09);
}

.search-icon { position: absolute; left: 18px; color: var(--text-dim); }

.btn-signup {
  background: #fff; 
  color: #000; 
  padding: 14px 28px; 
  border-radius: 99px; 
  font-weight: 800;
  font-size: 0.95rem; 
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
}

.btn-signup:hover { transform: scale(1.05); }

.main-content {
  padding-top: var(--nav-height);
  min-height: 100vh;
  box-sizing: border-box;
}

.profile-trigger {
  background: rgba(255,255,255,0.03); 
  border: 1px solid var(--border-subtle);
  padding: 6px 14px 6px 6px; 
  border-radius: 99px;
  display: flex; 
  align-items: center; 
  gap: 12px;
}

.avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(-15px); }
</style>