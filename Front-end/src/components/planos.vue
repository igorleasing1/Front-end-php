<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/index.js'; 

const musicas = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const fetchMusicas = async () => {
  try {
    loading.value = true;
    const response = await api.get('/musicas/top');
    
    // Mapeando para o formato que o seu HTML espera
    const dadosBrutos = Array.isArray(response.data) ? response.data : [];
    
    musicas.value = dadosBrutos.map(item => ({
      id: item.mbid || Math.random(),
      titulo: item.name || 'Sem título',
      artista: item.artist?.name || 'Artista desconhecido',
      // CORREÇÃO AQUI: Acessando o campo '#text' do array de imagens
      capa: item.image?.[3]?.['#text'] || 'https://via.placeholder.com/300'
    }));
  } catch (error) {
    console.error('Erro:', error);
    musicas.value = [];
  } finally {
    loading.value = false;
  }
};

// Filtro seguro para evitar o erro de 'undefined' no console
const filteredMusicas = computed(() => {
  if (!musicas.value) return [];
  const busca = (searchQuery.value || '').toLowerCase();
  
  return musicas.value.filter(m => {
    const titulo = (m.titulo || '').toLowerCase();
    const artista = (m.artista || '').toLowerCase();
    return titulo.includes(busca) || artista.includes(busca);
  });
});

onMounted(fetchMusicas);
</script>

<template>
  <div class="music-container">
    <header class="header">
      <div class="search-box">
        <span class="icon">🔍</span>
        <input v-model="searchQuery" placeholder="Procurar músicas..." />
      </div>
    </header>

    <div v-if="loading" class="loading-state">Carregando biblioteca...</div>

    <div class="songs-grid">
  <div v-for="musica in filteredMusicas" :key="musica.id" class="music-card">
    <div class="image-wrapper">
      <img :src="musica.capa" :alt="musica.titulo" />
    </div>
    <div class="card-info">
      <h3>{{ musica.titulo }}</h3>
      <p>{{ musica.artista }}</p>
    </div>
  </div>
</div>    
  </div>
</template>

<style scoped>
.music-container {
  background: #090909;
  min-height: 100vh;
  padding: 2rem;
  color: white;
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.music-card {
  background: #181818;
  padding: 1rem;
  border-radius: 12px;
  transition: background 0.3s ease;
  cursor: pointer;
}

.music-card:hover {
  background: #282828;
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 0.8rem;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.play-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.music-card:hover .play-overlay {
  opacity: 1;
  transform: translateY(0);
}

.play-circle {
  background: #1db954; /* Verde Spotify */
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 1.2rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.card-info h3 {
  font-size: 1rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info p {
  color: #b3b3b3;
  font-size: 0.85rem;
  margin-top: 4px;
}
</style>