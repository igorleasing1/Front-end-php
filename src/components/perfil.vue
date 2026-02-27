<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()
const fileInput = ref(null)


const isEditing = ref(false)
const editName = ref('')
const editEmail = ref('')
const photoChanged = ref(false)

const showPasswordModal = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loadingPassword = ref(false)


const likedSongs = ref([])
const loadingSongs = ref(true)
const user = ref({
  name: '',
  email: '',
  avatar: '',
  isImage: false,
  publicPlaylists: 0,
  followers: 0,
  following: 0,
  hasSubscription: false 
})


const normalizar = (valor) => {
  return String(valor || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/gi, '');
};

const gerarIdSeguro = (item) => {
  const nome = item.music_name || item.name;
  const artista = item.artist_name || item.artist?.name;
  return normalizar(`${nome}-${artista}`);
};


const fetchUser = async () => {
  try {
    const userId = localStorage.getItem('user_id');
    if (!userId || userId === 'undefined') {
      router.push('/login');
      return;
    }

   
    const [resUser, resSub] = await Promise.all([
      api.get(`/user/${userId}`),
      api.get('/minha-assinatura') 
    ]);

    const userData = resUser.data.data;
    
    if (userData) {
      user.value = {
        name: userData.name,
        email: userData.email,
        avatar: userData.profile_photo_base64,
        isImage: !!userData.profile_photo_base64,
        publicPlaylists: userData.playlists_count || 0,
        followers: userData.followers_count || 0,
        following: userData.following_count || 0,
        hasSubscription: resSub.data.subscribed 
      };
      editName.value = userData.name;
      editEmail.value = userData.email;
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
  }
};


const fetchLikedSongs = async () => {
  try {
    loadingSongs.value = true;
    const response = await api.get('/favoritos');
    const dadosBrutos = response.data.data || response.data || [];

    likedSongs.value = dadosBrutos.map(item => {
      return {
        id: item.music_id || gerarIdSeguro(item),
        titulo: item.music_name || item.name || 'Sem título',
        artista: item.artist_name || item.artist?.name || 'Artista desconhecido',
      
        capa: item.cover || item.image?.[3]?.['#text'] || 'https://via.placeholder.com/300/0f172a/FFFFFF?text=Vile+Music',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar músicas curtidas:', error);
  } finally {
    loadingSongs.value = false;
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
      
      if (photoChanged.value && user.value.avatar) {
        await api.put('user/foto', { 
          profile_photo_base64: user.value.avatar 
        });
        photoChanged.value = false; 
      }

      isEditing.value = false;
      await fetchUser();
      alert("Perfil atualizado com sucesso!");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Erro ao salvar dados.");
  }
};

const updatePassword = async () => {
  try {
    loadingPassword.value = true;
    await api.put('user/atualizarSenha', {
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value
    });

    alert("Senha atualizada com sucesso!");
    showPasswordModal.value = false;
    currentPassword.value = ''; newPassword.value = ''; confirmPassword.value = '';
  } catch (error) {
    alert(error.response?.data?.message || 'Erro ao atualizar senha');
  } finally {
    loadingPassword.value = false;
  }
};

const cancelSubscription = async () => {
  if (!confirm("Deseja realmente cancelar sua assinatura Premium?")) return;
  try {
    await api.post('/assinatura/cancel'); 
    alert("Assinatura cancelada.");
    await fetchUser(); 
  } catch (error) {
    alert("Erro ao cancelar assinatura.");
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
    photoChanged.value = true; 
  };
};

onMounted(() => {
  fetchUser();
  fetchLikedSongs();
});
</script>

<template>
<div class="vile-profile-page">

  <header class="profile-header">
    <div class="header-content">
      <div class="profile-avatar-container" @click="fileInput.click()">
        <input type="file" ref="fileInput" @change="onFileSelected" hidden accept="image/*" />
        <img v-if="user.isImage" :src="user.avatar" class="avatar-img" />
        <div v-else class="avatar-placeholder">
          <span>{{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}</span>
        </div>
        <div class="avatar-overlay"><span>✏️ Alterar</span></div>
      </div>

      <div class="profile-info">
        <span class="profile-label">Perfil</span>
        <h1 v-if="!isEditing" class="profile-name">{{ user.name }}</h1>
        <div v-else class="edit-inputs">
          <input v-model="editName" class="vile-input" placeholder="Nome" />
          <input v-model="editEmail" class="vile-input" placeholder="Email" />
        </div>
        <div class="profile-stats">
          <span>{{ user.publicPlaylists }} playlists</span> •
          <span>{{ user.followers }} seguidores</span> •
          <span>{{ user.following }} seguindo</span>
        </div>
      </div>
    </div>
  </header>

  <div class="profile-actions-bar">
    <div class="actions-left" v-if="!isEditing">
      <button class="pill-btn primary" @click="isEditing = true">Editar Perfil</button>
      <button class="pill-btn outline" @click="showPasswordModal = true">Alterar Senha</button>
      
      <button v-if="user.hasSubscription" class="pill-btn danger" @click="cancelSubscription">
        Cancelar Assinatura
      </button>
    </div>
    <div class="actions-left" v-else>
      <button class="pill-btn primary" @click="handleSaveProfile">Salvar Alterações</button>
      <button class="pill-btn text" @click="isEditing = false">Cancelar</button>
    </div>
  </div>

  <main class="main-content">
    <h2 class="section-title">Músicas Curtidas</h2>
    
    <div v-if="loadingSongs" class="loading">Carregando favoritos...</div>
    <div v-else-if="likedSongs.length === 0" class="empty-state">Nenhuma música curtida ainda.</div>
    
    <div v-else class="songs-grid">
      <div v-for="song in likedSongs" :key="song.id" class="song-card">
        <div class="song-img-container">
          <img :src="song.capa" class="song-cover" />
          <button class="btn-play-mini">▶</button>
        </div>
        <div class="song-details">
          <h4 class="song-title">{{ song.titulo }}</h4>
          <p class="song-artist">{{ song.artista }}</p>
        </div>
      </div>
    </div>
  </main>

  <div v-if="showPasswordModal" class="modal-overlay">
    <div class="modal-password">
      <h3>Alterar Senha</h3>
      <div class="modal-body">
        <label>Senha Atual</label>
        <input v-model="currentPassword" type="password" class="vile-input" />
        <label>Nova Senha</label>
        <input v-model="newPassword" type="password" class="vile-input" />
        <label>Confirmar Nova Senha</label>
        <input v-model="confirmPassword" type="password" class="vile-input" />
      </div>
      <div class="modal-buttons">
        <button class="pill-btn primary" @click="updatePassword" :disabled="loadingPassword">
          {{ loadingPassword ? 'Processando...' : 'Atualizar Senha' }}
        </button>
        <button class="pill-btn text" @click="showPasswordModal = false">Fechar</button>
      </div>
    </div>
  </div>

</div>
</template>

<style scoped>
.vile-profile-page {
  background-color: #080a10;
  min-height: 100vh;
  color: white;
}

.profile-header {
  background: linear-gradient(180deg, #1e3a8a 0%, #080a10 100%);
  padding: 100px 48px 30px;
  display: flex;
  align-items: flex-end;
}

.header-content { display: flex; align-items: flex-end; gap: 24px; }

.profile-avatar-container {
  width: 190px; height: 190px; border-radius: 50%;
  overflow: hidden; background: #111; position: relative; cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-overlay { 
  position: absolute; inset: 0; background: rgba(0,0,0,0.5); 
  display: flex; align-items: center; justify-content: center; 
  opacity: 0; transition: 0.3s; 
}
.profile-avatar-container:hover .avatar-overlay { opacity: 1; }

.profile-name { font-size: 4rem; font-weight: 900; margin: 8px 0; letter-spacing: -2px; }

.pill-btn {
  padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; border: none;
}

.pill-btn.primary { background-color: #2563eb; color: white; }
.pill-btn.primary:hover { background-color: #3b82f6; transform: scale(1.03); }

.pill-btn.outline { background: transparent; border: 1px solid #333; color: white; }
.pill-btn.outline:hover { border-color: #2563eb; }

.pill-btn.danger { background: transparent; border: 1px solid #ef4444; color: #ef4444; }
.pill-btn.danger:hover { background: #ef4444; color: white; }

.profile-actions-bar { padding: 20px 48px; }
.actions-left { display: flex; gap: 12px; }

.main-content { padding: 20px 48px; }
.songs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 24px; }

.song-card {
  background: #0c1222; padding: 16px; border-radius: 12px; transition: 0.3s; cursor: pointer;
}
.song-card:hover { background: #111a30; }

.song-img-container { position: relative; margin-bottom: 12px; }
.song-cover { width: 100%; aspect-ratio: 1; border-radius: 8px; object-fit: cover; }

.btn-play-mini {
  position: absolute; bottom: 8px; right: 8px; background: #2563eb;
  border: none; width: 38px; height: 38px; border-radius: 50%; color: white;
  opacity: 0; transform: translateY(5px); transition: 0.3s;
}
.song-card:hover .btn-play-mini { opacity: 1; transform: translateY(0); }

.song-title { font-size: 1rem; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.song-artist { color: #94a3b8; font-size: 0.85rem; }

.vile-input {
  background: #111; border: 1px solid #333; color: white;
  padding: 12px; border-radius: 8px; margin-bottom: 10px; width: 100%; box-sizing: border-box;
}


.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-password { background: #0f172a; padding: 32px; border-radius: 16px; width: 400px; border: 1px solid #1e293b; }
.modal-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
</style>