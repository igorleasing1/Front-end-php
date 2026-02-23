<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)
const isLoggedIn = ref(false)

// Função para checar se o token existe no LocalStorage
const checkAuth = () => {
  const token = localStorage.getItem('jwt_token')
  isLoggedIn.value = !!token // Transforma a existência do token em true/false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('usuario')
  isLoggedIn.value = false
  isMenuOpen.value = false

}


onMounted(checkAuth)


watch(() => route.path, checkAuth)
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      
      <div class="nav-left-group">
        <router-link to="/" class="home-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </router-link>

        <div class="brand">
          <h1 class="logo">MÚSICA<span>.</span></h1>
        </div>
      </div>

      <div class="nav-search">
        <div class="search-input-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" placeholder="O que você quer ouvir?" />
        </div>
      </div>

    <div class="nav-right">
  
  <template v-if="isLoggedIn">
    <router-link to="/planos" class="nav-link">Top Tracks</router-link>
    <router-link to="/artistas" class="nav-link">Artistas</router-link>
    <router-link to="/favoritos" class="nav-link">Favoritos</router-link>
  </template>

  <div v-else class="auth-group">
    <router-link to="/login" class="btn-login">Entrar</router-link>
    <router-link to="/cadastro" class="btn-signup">Inscreva-se</router-link>
  </div>

  <router-link to="/" class="nav-link-premium">Assine o premium</router-link>
  
  <div class="profile-container">
    <div class="profile-trigger" @click="toggleMenu">
      <div class="avatar">US</div>
      <svg class="chevron" :class="{ 'active': isMenuOpen }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
    
    <div v-if="isMenuOpen" class="simple-dropdown">
      <router-link to="/perfil">Meu Perfil</router-link>
      <button @click="logout" class="logout-btn">Sair</button>
    </div>
  </div>
</div>
</div>
</nav>
</template>

<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: #050a18;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.nav-content {
  width: 100%;
  padding: 0 16px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -1px;
}

.logo span { color: #2563eb; }

.nav-search {
  flex: 1;
  max-width: 380px;
  margin: 0 15px;
}

.search-input-wrapper input {
  width: 100%;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 12px 8px 40px;
  color: #fff;
  outline: none;
}

.search-icon { position: absolute; left: 14px; color: #94a3b8; }


.nav-right, .auth-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-link, .btn-login, .nav-link-premium {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: 0.2s;
  white-space: nowrap;
}

.nav-link:hover, .btn-login:hover, .nav-link-premium:hover { color: #fff; }

.btn-signup {
  background: #fff;
  color: #000;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
}

.avatar {
  width: 30px;
  height: 30px;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.simple-dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  background: #1e293b;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 140px;
  box-shadow: 0 10px 15px rgba(0,0,0,0.5);
}

.simple-dropdown a, .logout-btn {
  display: block;
  width: 100%;
  padding: 8px 16px;
  color: #fff;
  text-decoration: none;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.simple-dropdown a:hover, .logout-btn:hover { background: rgba(255,255,255,0.1); }

@media (max-width: 992px) {
  .nav-search, .nav-link-premium { display: none; }
}
</style>