<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()
const fileInput = ref(null)


const isEditing = ref(false)
const editName = ref('')
const editEmail = ref('') 


const user = ref({
  name: '',
  email: '',
  avatar: '',
  isImage: false,
  publicPlaylists: 0,
  followers: 0,
  following: 0
})


const fetchUser = async () => {
  try {
    const userId = localStorage.getItem('user_id');
    if (!userId || userId === 'undefined') {
      router.push('/login');
      return;
    }

    const { data } = await api.get(`/user/${userId}`);
    const userData = data.data;

    if (userData) {
      user.value = {
        name: userData.name,
        email: userData.email,
        avatar: userData.profile_photo_base64,
        isImage: !!userData.profile_photo_base64,
        publicPlaylists: userData.playlists_count || 0,
        followers: userData.followers_count || 0,
        following: userData.following_count || 0
      };
      editName.value = userData.name;
      editEmail.value = userData.email;
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
  }
};


const handleSaveProfile = async () => {
  try {
    const userId = localStorage.getItem('user_id');
    
   
    const response = await api.put(`user/atualizar/${userId}`, {
      name: editName.value,
      email: editEmail.value
    });

    if (response.data.success) {
     
      await updateProfilePhoto();

     
      user.value.name = editName.value;
      user.value.email = editEmail.value;
      isEditing.value = false;
      
  
      localStorage.setItem('usuario', JSON.stringify(response.data.data));
      await fetchUser(); 
      
      alert("Perfil atualizado com sucesso!");
    }
  } catch (error) {
    console.error("Erro geral:", error);
    alert("Erro ao salvar dados básicos.");
  }
};

const updateProfilePhoto = async () => {
  try {
    const token = localStorage.getItem('token'); 
    
    if (!user.value.avatar || !user.value.isImage) return;

   
    const response = await api.put('user/foto', 
      { profile_photo_base64: user.value.avatar },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log("Foto salva com sucesso!");
      return true;
    }
  } catch (error) {
    console.error("Erro 403 ou similar na foto:", error.response);
    return false;
  }
};
const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    
    user.value.avatar = reader.result; 
    user.value.isImage = true;
  };
};

const logout = async () => {
  try {
    await api.post('/logout')
    localStorage.clear()
    router.push('/login')
  } catch (error) {
    console.error(error)
  }
};

const goBack = () => router.push('/')

onMounted(() => {
  fetchUser();
})
</script>

<template>
  <div class="profile-page">
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo" @click="goBack">MÚSICA<span>.</span></h1>
        <div class="nav-actions">
          <button class="btn-back-pill" @click="goBack">Início</button>
          <button class="btn-logout" @click="logout">Sair</button>
        </div>
      </div>
    </nav>

    <main class="main-wrapper">
      <header class="profile-hero">
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          
          <div class="profile-avatar-wrapper">
            <input type="file" ref="fileInput" @change="onFileSelected" hidden accept="image/*" />
            
            <div class="profile-avatar-big">
              <img v-if="user.isImage" :src="user.avatar" class="img-fill" />
              <span v-else>{{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}</span>
            </div>
            
            <div class="edit-badge" @click="fileInput.click()" title="Mudar foto">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
          </div>
          
          <div class="profile-info-block">
           
            
            <div v-if="!isEditing" class="view-mode">
              <h1 class="display-name"><strong>{{ user.name }}</strong></h1>
              <p class="user-email-display">{{ user.email }}</p>
              <button class="btn-outline-edit" @click="isEditing = true">Editar Perfil</button>
            </div>

            <div v-else class="edit-mode">
              <div class="edit-fields-group">
                <input v-model="editName" class="input-edit" placeholder="Seu nome" />
                <input v-model="editEmail" class="input-edit" placeholder="Seu e-mail" />
              </div>
              <div class="edit-buttons">
                <button class="btn-save" @click="handleSaveProfile">Salvar Alterações</button>
                <button class="btn-cancel" @click="isEditing = false">Cancelar</button>
              </div>
            </div>

            <div class="stats-row">
              <span class="stat-item"><strong>{{ user.publicPlaylists }}</strong> playlists</span>
              <span class="dot"></span>
              <span class="stat-item"><strong>{{ user.followers }}</strong> seguidores</span>
              <span class="dot"></span>
              <span class="stat-item"><strong>{{ user.following }}</strong> seguindo</span>
            </div>
          </div>
        </div>
      </header>

      <div class="content-body">
        <section class="shelf">
          <div class="shelf-header">
            <h2>Suas Playlists</h2>
          </div>
          <div class="empty-state-card">
            <div class="icon-circle">🎧</div>
            <p>Sua biblioteca musical aparece aqui.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-page { background-color:
   #080a10;
   min-height: 
   100vh; color:
    #fff; 
    font-family: 'Inter', sans-serif;
   }
.navbar { height: 70px;
   display: flex;
    align-items: center;
     background: rgba(8, 10, 16, 0.9); 
     backdrop-filter: blur(10px); position: sticky;
      top: 0; z-index: 10; 
      border-bottom: 1px solid rgba(255,255,255,0.05); }
.nav-content { width: 100%; 
  max-width: 1200px; 
  margin: 0 auto;
  display: flex;
   justify-content: space-between;
    align-items: center;
     padding: 0 2rem; 
    }
.nav-actions { 
  display: flex;
   gap: 15px;
   }

.profile-hero {  width: 70%; position: relative; padding: 4rem 2rem; margin-top: 2rem; border-radius: 30px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); overflow: hidden; }
.hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%); }
.hero-inner { position: relative; display: flex; align-items: center; gap: 3rem; z-index: 1; }

.profile-avatar-wrapper { position: relative; }
.profile-avatar-big { width: 180px; height: 180px; background: linear-gradient(135deg, #2563eb, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 800; border: 4px solid rgba(255,255,255,0.1); overflow: hidden; }
.img-fill { width: 100%; height: 100%; object-fit: cover; }
.edit-badge { position: absolute; bottom: 5px; right: 5px; background: #fff; color: #000; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
.edit-badge:hover { transform: scale(1.1); background: #3b82f6; color: #fff; }

.display-name { font-size: clamp(2rem, 5vw, 4.5rem); letter-spacing: -3px; margin: 0.5rem 0 0; line-height: 1; }
.user-email-display { color: #94a3b8; margin-bottom: 1.5rem; font-size: 1.1rem; }

.edit-fields-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem; max-width: 400px; }
.input-edit { background: rgba(255,255,255,0.05); border: 2px solid rgba(37, 99, 235, 0.5); border-radius: 12px; color: #fff; font-size: 1.2rem; padding: 12px 20px; width: 100%; outline: none; transition: 0.3s; }
.input-edit:focus { border-color: #2563eb; background: rgba(255,255,255,0.08); }

.btn-save { background: #2563eb; color: #fff; border: none; padding: 10px 25px; border-radius: 100px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-save:hover { background: #1d4ed8; transform: translateY(-2px); }
.btn-cancel { background: transparent; color: #94a3b8; border: none; padding: 10px 20px; cursor: pointer; font-weight: 600; }
.btn-outline-edit { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 20px; border-radius: 100px; cursor: pointer; font-size: 14px; transition: 0.3s; }
.btn-outline-edit:hover { background: rgba(255,255,255,0.1); border-color: #fff; }

.btn-logout { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 8px 20px; border-radius: 100px; cursor: pointer; font-weight: 600; transition: 0.3s; }
.btn-logout:hover { background: #ef4444; color: #fff; }

.stats-row { display: flex; gap: 15px; margin-top: 1.5rem; color: #94a3b8; font-size: 14px; }
.dot { width: 4px; height: 4px; background: #334155; border-radius: 50%; align-self: center; }

.shelf { margin-top: 3rem; }
.empty-state-card { background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px; padding: 4rem; text-align: center; color: #64748b; }

@media (max-width: 768px) {
  .hero-inner { flex-direction: column; text-align: center; }
  .profile-avatar-big { width: 140px; height: 140px; }
  .edit-fields-group { margin: 0 auto 1.5rem; }
}
</style>