<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import api from '../api/index.js';

const { proxy } = getCurrentInstance();

const musicas = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const playlists = ref([]);
const showPlaylistModal = ref(false);
const musicaSelecionada = ref(null);

const normalizar = (valor) => {
  return String(valor || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/gi, '');
};

const gerarIdSeguro = (item) => {
  return normalizar(`${item.name}-${item.artist?.name}`);
};

const fetchMusicas = async () => {
  try {
    loading.value = true;

    const [resTop, resFavoritos] = await Promise.all([
      api.get('/musicas/top'),
      api.get('/favorite')
    ]);

    const dadosBrutos = Array.isArray(resTop.data)
      ? resTop.data
      : [];

    const meusFavoritos =
      Array.isArray(resFavoritos.data?.data)
        ? resFavoritos.data.data
        : Array.isArray(resFavoritos.data)
          ? resFavoritos.data
          : [];

    const favoritosIds = meusFavoritos.map(f =>
      normalizar(f.music_id)
    );

    musicas.value = dadosBrutos.map(item => {
      const musicaId = gerarIdSeguro(item);
      const jaEFavorito = favoritosIds.includes(musicaId);

      return {
        id: musicaId,
        titulo: item.name || 'Sem título',
        artista: item.artist?.name || 'Artista desconhecido',
        capa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMJpwsDYz99DT098MzvjrU1tFAXFJvaow5YQ&s',
        isFavorited: jaEFavorito
      };
    });

  } catch (error) {
    proxy.$toast('Erro ao carregar músicas.', 'error');
  } finally {
    loading.value = false;
  }
};

const toggleFavorite = async (musica) => {
  const originalStatus = musica.isFavorited;

  try {

    const totalFavoritas = musicas.value.filter(m => m.isFavorited).length;

    if (!originalStatus && totalFavoritas >= 5) {
      proxy.$toast('Seu plano Tier 1 permite apenas 5 músicas favoritas.', 'error');
      return;
    }

    if (!originalStatus) {

      musica.isFavorited = true;

      await api.post('/favorite/criar', {
        music_id: musica.id,
        music_name: musica.titulo,
        artist_name: musica.artista
      });

      proxy.$toast('Música adicionada aos favoritos 🎵', 'success');

    } else {

      musica.isFavorited = false;

      await api.delete(`/favorite/descurtir/${musica.id}`);

      proxy.$toast('Música removida dos favoritos ❌', 'success');
    }

  } catch (error) {
    musica.isFavorited = originalStatus;
    proxy.$toast('Erro no servidor.', 'error');
  }
};


const abrirModalPlaylist = async (musica) => {
  try {
    musicaSelecionada.value = musica;
    showPlaylistModal.value = true;

    const res = await api.get('/playlist');
    playlists.value = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];

  } catch (error) {
    proxy.$toast('Erro ao carregar playlists', 'error');
  }
};

const adicionarNaPlaylist = async (playlistId) => {
  try {

    await api.post(`/playlist/${playlistId}/musicas`, {
      music_id: musicaSelecionada.value.id,
      music_name: musicaSelecionada.value.titulo,
      artist_name: musicaSelecionada.value.artista
    });

    proxy.$toast('Música adicionada à playlist 🎶', 'success');
    showPlaylistModal.value = false;

  } catch (error) {
    proxy.$toast('Erro ao adicionar na playlist', 'error');
  }
};

const filteredMusicas = computed(() => {
  const busca = (searchQuery.value || '').toLowerCase();

  return musicas.value.filter(m =>
    m.titulo.toLowerCase().includes(busca) ||
    m.artista.toLowerCase().includes(busca)
  );
});

onMounted(fetchMusicas);
</script>

<template>
  <div class="spotify-layout">

    <main class="content">
      <h2 class="section-title">Top músicas</h2>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else class="grid-musicas">
        <div 
          v-for="musica in filteredMusicas" 
          :key="musica.id" 
          class="card-spotify"
        >
          <div class="capa-wrapper">
            <img :src="musica.capa" />

            <button class="btn-play">▶</button>

            <button 
              class="btn-like"
              :class="{ 'is-active': musica.isFavorited }"
              @click.stop="toggleFavorite(musica)"
            >
              {{ musica.isFavorited ? '💙' : '🤍' }}
            </button>

            <button 
              class="btn-add"
              @click.stop="abrirModalPlaylist(musica)"
            >
              ➕
            </button>
          </div>

          <div class="info">
            <h3 class="titulo">{{ musica.titulo }}</h3>
            <p class="artista">{{ musica.artista }}</p>
          </div>
        </div>
      </div>
    </main>

    
    <div v-if="showPlaylistModal" class="modal-overlay">
      <div class="modal">
        <h3>Adicionar à Playlist</h3>

        <div v-if="playlists.length === 0">
          Você ainda não tem playlists.
        </div>

        <div v-else class="playlist-list">
          <button
            v-for="playlist in playlists"
            :key="playlist.id"
            class="playlist-item"
            @click="adicionarNaPlaylist(playlist.id)"
          >
            {{ playlist.name }}
          </button>
        </div>

        <button class="btn-close" @click="showPlaylistModal = false">
          Fechar
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.spotify-layout {
  min-height: 100vh;
  background: #050a18;
  color: #fff;
}

.content {
  padding: 40px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

.grid-musicas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card-spotify {
  background-color: #0c1222;
  padding: 16px;
  border-radius: 12px;
  transition: 0.3s;
}

.card-spotify:hover {
  background-color: #111a30;
}

.capa-wrapper {
  position: relative;
  aspect-ratio: 1;
  margin-bottom: 12px;
}

.capa-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.btn-play {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #2563eb;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: white;
  opacity: 0;
  transition: 0.3s;
}

.card-spotify:hover .btn-play {
  opacity: 1;
}

.btn-like {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
}

.btn-add {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0,0,0,0.6);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #0c1222;
  padding: 20px;
  border-radius: 12px;
  width: 300px;
}

.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.playlist-item {
  background: #111a30;
  border: none;
  padding: 8px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.playlist-item:hover {
  background: #2563eb;
}

.btn-close {
  background: #1e293b;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
}
</style>