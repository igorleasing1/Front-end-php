<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const isLoading = ref(false)
const isProfileOpen = ref(false)
const progress = ref(0)

const plans = ref([])
const user = ref(null)


const fetchUser = async () => {
  try {
    const { data } = await api.get('/user')
    

    if (data.success && data.data && data.data.length > 0) {
      const userData = data.data[0] 
      
      user.value = {
        name: userData.name,
        email: userData.email,
        
        avatar: userData.profile_photo_base64 || userData.name.charAt(0).toUpperCase(),
        isImage: !!userData.profile_photo_base64,
        
        publicPlaylists: userData.playlists_count || 0,
        followers: userData.followers_count || 0,
        following: userData.following_count || 0
      }
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
  }
}

const fetchPlans = async () => {
  try {
    const { data } = await api.get('/getplanos')

    plans.value = data.map(plan => ({
      ...plan,
      name: plan.nome || plan.name || 'Plano',
      price: plan.preço || plan.valor || plan.price || '0,00',
      description: plan.descricao || plan.description || '',
      features: plan.caracteristicas || plan.features || [],
      buttonText: plan.texto_botao || plan.buttonText || 'Assinar',
      featured: plan.featured || false,
      color: '#2563eb'
    }))

  } catch (error) {
    console.error("Erro ao carregar planos:", error)
  }
}

const handleNavigation = (plan) => {
  isLoading.value = true
  progress.value = 0

  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 12
    }
  }, 100)

  setTimeout(() => {
    clearInterval(interval)
    progress.value = 100

    router.push({
      path: '/pagamento',
      query: {
        name: plan.name,
        price: plan.price
      }
    })
  }, 1200)
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

const closeMenu = (e) => {
  if (!e.target.closest('.profile-container')) {
    isProfileOpen.value = false
  }
}

const logout = async () => {
  try {
    await api.post('/logout')
    localStorage.removeItem('jwt_token')
    router.push('/login')
  } catch (error) {
    console.error(error)
  }
}

const goBack = () => router.push('/')

onMounted(() => {
  window.addEventListener('click', closeMenu)
  fetchPlans()
  fetchUser()
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})
</script>

<template>
  <div class="profile-page">
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo" @click="goBack">MÚSICA<span>.</span></h1>
        <button class="btn-back-pill" @click="goBack">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Início
        </button>
      </div>
    </nav>

    <main class="main-wrapper">
      <header class="profile-hero">
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          <div class="profile-avatar-wrapper">
            <div class="profile-avatar-big" style="overflow: hidden;">
              <img v-if="user?.isImage" :src="user.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
              <span v-else>{{ user?.avatar || '?' }}</span>
            </div>
            <div class="edit-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </div>
          </div>
          
          <div class="profile-info-block">
            <span class="label-caps">PERFIL VERIFICADO</span>
            <h1 class="display-name"><strong>{{ user?.name || '...' }}</strong></h1>
            <div class="stats-row">
              <span class="stat-item"><strong>{{ user?.publicPlaylists }}</strong> playlists</span>
              <span class="dot"></span>
              <span class="stat-item"><strong>{{ user?.followers }}</strong> seguidores</span>
              <span class="dot"></span>
              <span class="stat-item"><strong>{{ user?.following }}</strong> seguindo</span>
            </div>
          </div>
        </div>
      </header>

      <div class="content-body">
        <section class="shelf">
          <div class="shelf-header">
            <h2>Artistas favoritos</h2>
            <button class="text-link">Ver todos</button>
          </div>
          
          <div class="artists-grid">
            </div>
        </section>

        <section class="shelf">
          <div class="shelf-header">
            <h2>Suas Playlists</h2>
          </div>
          <div class="empty-state-card">
            <div class="icon-circle">🎧</div>
            <p>Comece a criar sua biblioteca musical.</p>
            <button class="btn-primary-small">Criar Playlist</button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-page {
  background-color: #080a10;
  min-height: 100vh;
  color: #ffffff;
}

.main-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
}

/* Navbar */
.navbar {
  height: 70px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background: rgba(8, 10, 16, 0.8);
  backdrop-filter: blur(15px);
  z-index: 100;
}

.nav-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 20px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-back-pill:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-5px);
}

/* Hero Section Modernizada */
.profile-hero {
  position: relative;
  padding: 4rem 2rem;
  margin-top: 1rem;
  border-radius: 30px;
  overflow: hidden;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.25) 0%, transparent 50%);
}

.hero-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 3rem;
  z-index: 1;
}

.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar-big {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: 900;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  border: 4px solid rgba(255, 255, 255, 0.1);
}

.edit-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #fff;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  cursor: pointer;
}

.label-caps {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #3b82f6;
  margin-bottom: 0.5rem;
  display: block;
}

.display-name {
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 950;
  letter-spacing: -4px;
  margin: 0 0 1rem 0;
  line-height: 0.9;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #cbd5e1;
}

.dot {
  width: 4px;
  height: 4px;
  background: #475569;
  border-radius: 50%;
}

/* Prateleiras de Conteúdo (Shelves) */
.shelf {
  margin-top: 4rem;
}

.shelf-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.shelf-header h2 {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.text-link {
  background: none;
  border: none;
  color: #94a3b8;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
}

/* Grid de Artistas */
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.artist-item {
  background: rgba(255, 255, 255, 0.02);
  padding: 1.5rem;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid transparent;
}

.artist-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.05);
  transform: translateY(-10px);
}

.artist-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.25rem;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
}

.artist-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}

.artist-item:hover .artist-thumb img {
  transform: scale(1.1);
}

.play-hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.artist-item:hover .play-hover {
  opacity: 1;
}

.play-btn-circle {
  background: #2563eb;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transform: translateY(20px);
  transition: 0.4s;
}

.artist-item:hover .play-btn-circle {
  transform: translateY(0);
}

.artist-item h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.artist-item p {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 4px;
}

/* Empty State Card */
.empty-state-card {
  background: linear-gradient(rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 5rem 2rem;
  text-align: center;
}

.icon-circle {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.btn-primary-small {
  background: #ffffff;
  color: #000;
  border: none;
  padding: 12px 30px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 14px;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary-small:hover {
  transform: scale(1.05);
  background: #3b82f6;
  color: white;
}

@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  .display-name {
    letter-spacing: -2px;
  }
  .profile-avatar-big {
    width: 140px;
    height: 140px;
    font-size: 3rem;
  }
}
</style>