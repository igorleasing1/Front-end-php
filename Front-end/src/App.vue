<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'

const router = useRouter()
const isProfileOpen = ref(false)

// Estados para o Loading Global
const isLoading = ref(false)
const progress = ref(0)

// Monitoramento Global de Rotas
router.beforeEach((to, from, next) => {
  isLoading.value = true
  progress.value = 0
  
  // Efeito de progresso simulado
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
    }
  }, 100)

  // Guardamos o interval no 'to' para limpar depois
  to.meta.interval = interval
  next()
})

router.afterEach((to) => {
  // Pequeno delay para garantir que o usuário veja a transição suave
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
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5">
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
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
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
  --bg-dark: #020617;
  --primary: #2563eb;
  --text-dim: #94a3b8;
  --border-subtle: rgba(255, 255, 255, 0.06);
}

/* ESTILOS DO LOADING GLOBAL */
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
  height: 3px;
  background: var(--primary);
  box-shadow: 0 0 15px var(--primary);
  transition: width 0.3s ease;
}

.sound-wave {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 40px;
  margin-bottom: 1.5rem;
}

.sound-wave span {
  width: 5px;
  background: var(--primary);
  border-radius: 10px;
  animation: wave-animation 1s ease-in-out infinite;
}

.sound-wave span:nth-child(1) { height: 20%; animation-delay: 0.1s; }
.sound-wave span:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.sound-wave span:nth-child(3) { height: 60%; animation-delay: 0.3s; }
.sound-wave span:nth-child(4) { height: 85%; animation-delay: 0.4s; }
.sound-wave span:nth-child(5) { height: 40%; animation-delay: 0.5s; }

@keyframes wave-animation {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.6); }
}

.loading-text {
  color: #fff;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

/* TRANSITIONS */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ... Restante do seu CSS original (Navbar, Dropdown, etc) ... */

.app-container {
  background-color: var(--bg-dark);
  min-height: 100vh;
}

.main-content {
  padding-top: 72px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left-group { display: flex; align-items: center; gap: 1.5rem; }

.home-btn {
  background: none; border: none; color: var(--text-dim);
  cursor: pointer; padding: 4px; display: flex; transition: 0.3s;
}

.home-btn:hover { color: #fff; }

.logo-text { font-size: 1.25rem; font-weight: 900; color: #fff; margin: 0; }
.logo-text span { color: var(--primary); }

.nav-search { flex: 1; max-width: 400px; margin: 0 2rem; }

.search-input-wrapper { position: relative; display: flex; align-items: center; }

.search-input-wrapper input {
  width: 100%; background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle); border-radius: 99px;
  padding: 9px 15px 9px 42px; color: #fff; font-size: 0.85rem; outline: none;
}

.search-icon { position: absolute; left: 14px; color: var(--text-dim); }

.nav-right { display: flex; align-items: center; gap: 1.5rem; }

.nav-auth { display: flex; align-items: center; gap: 1rem; }

.btn-login {
  background: none; border: none; color: var(--text-dim);
  font-weight: 700; font-size: 0.85rem; cursor: pointer;
}

.btn-signup {
  background: #fff; color: #000; border: none;
  padding: 8px 18px; border-radius: 99px; font-weight: 700;
  font-size: 0.85rem; cursor: pointer;
}

.profile-container { position: relative; }

.profile-trigger {
  background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle);
  padding: 4px 8px 4px 4px; border-radius: 99px;
  display: flex; align-items: center; gap: 8px; cursor: pointer;
}

.avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }

.chevron { width: 16px; height: 16px; color: var(--text-dim); transition: 0.3s; }
.chevron.active { transform: rotate(180deg); }

.profile-dropdown {
  position: absolute; top: calc(100% + 12px); right: 0;
  width: 220px; background: #0f172a; border: 1px solid var(--border-subtle);
  border-radius: 16px; padding: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.dropdown-header { padding: 12px; }
.user-name { color: #fff; font-weight: 700; font-size: 0.9rem; margin: 0; }
.user-email { color: var(--text-dim); font-size: 0.75rem; margin: 0; }
.dropdown-divider { height: 1px; background: var(--border-subtle); margin: 8px 0; }

.dropdown-item {
  display: block; width: 100%; padding: 10px 12px; color: var(--text-dim);
  border-radius: 8px; text-align: left; border: none; background: transparent;
  cursor: pointer; font-size: 0.85rem;
}

.dropdown-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
.dropdown-item.logout { color: #ef4444; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(-10px); }
</style>