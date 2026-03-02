<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/index.js';

const playlists = ref([]);
const loadingPlaylists = ref(true);
const errorPlaylists = ref(null);

const musicas = ref([]);
const playlistSelecionada = ref(null);
const loadingMusicas = ref(false);
const errorMusicas = ref(null);

const token = localStorage.getItem('token'); 

const fetchPlaylists = async () => {
  try {
    loadingPlaylists.value = true;
    const response = await api.get('/playlist', {
      headers: { Authorization: `Bearer ${token}` }
    });
    playlists.value = response.data.data;
  } catch (err) {
    console.error(err);
    errorPlaylists.value = 'Erro ao carregar playlists';
  } finally {
    loadingPlaylists.value = false;
  }
};

const fetchMusicas = async (playlist) => {
  try {
    playlistSelecionada.value = playlist;
    loadingMusicas.value = true;
    const response = await api.get(`/playlist/${playlist.id}/musicas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    musicas.value = response.data.data; 
  } catch (err) {
    console.error(err);
    errorMusicas.value = 'Erro ao carregar músicas';
  } finally {
    loadingMusicas.value = false;
  }
};

const openMusica = (url) => {
  if (url) window.open(url, '_blank');
  else alert('URL da música não disponível');
};

onMounted(() => {
  fetchPlaylists();
});
</script>

<template>
  <div class="min-h-screen bg-[#05070a] text-white p-8 font-sans">
    
    <header class="mb-10">
      <h1 class="text-3xl font-bold mb-6 tracking-tight">Suas Playlists</h1>
      
      <div v-if="loadingPlaylists" class="flex gap-2">
        <div v-for="i in 3" :key="i" class="h-8 w-24 bg-gray-800 animate-pulse rounded-md"></div>
      </div>
      
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="playlist in playlists"
          :key="playlist.id"
          @click="fetchMusicas(playlist)"
          :class="[
            'playlist-btn',
            playlistSelecionada?.id === playlist.id ? 'active' : ''
          ]"
        >
          {{ playlist.name || playlist.title }}
        </button>
      </div>
    </header>

    <div class="border-t border-gray-900 my-8"></div>

    <section>
      <div v-if="playlistSelecionada" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-400">
          Músicas em: <span class="text-white">{{ playlistSelecionada.name }}</span>
        </h2>
      </div>

      <div class="divc">
        <div
          v-for="musica in musicas"
          :key="musica.id"
          class="music-card group"
          @click="openMusica(musica.music_url)"
        >
          <div class="image-container">
            <img 
              :src=" 'data:image/jpeg;base64,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'" 
              class="card-image"
              alt="Capa"
              @error="(e) => e.target.src = 'https://i.imgur.com/8K5M6Yq.png'"
            >
            
           
          </div>

          <div class="mt-3">
            <h3 class="song-title">{{ musica.music_name }}</h3>
            <p class="artist-name">{{ musica.artist_name }}</p>
          </div>
        </div>
      </div>

      <div v-if="!loadingMusicas && musicas.length === 0 && playlistSelecionada" class="empty-state">
        <p>Nenhuma música encontrada aqui.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>

               .divc{
                display:flex;
                
               }
.playlist-btn {
  background: #111827;
  color: #9ca3af;
  border: 1px solid #1f2937;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.playlist-btn:hover {
  border-color: #4b5563;
  color: #ffffff;
}

.playlist-btn.active {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}


.music-card {
  background: #111827;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  max-width: 180px;
  margin: 0 auto;
}

.music-card:hover {
  background: #1f2937;
  transform: translateY(-4px);
}

/* Imagem e Aspect Ratio */
.image-container {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #0d1117;
}

.card-image {
  width: 100%;
  height: 100%;
  object-cover: cover;
  transition: transform 0.5s ease;
}

.music-card:hover .card-image {
  transform: scale(1.05);
}


.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.music-card:hover .card-overlay {
  opacity: 1;
}

.icon-btn {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 9999px;
  padding: 6px;
  font-size: 10px;
  color: white;
  transition: transform 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.2);
  background: #000;
}

.bottom-left { bottom: 8px; left: 8px; }
.top-right { top: 8px; right: 8px; }


.song-title {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.artist-name {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #4b5563;
}


</style>