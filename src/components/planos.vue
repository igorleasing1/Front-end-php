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
    const dadosBrutos = Array.isArray(response.data) ? response.data : [];
    
    musicas.value = dadosBrutos.map(item => ({
      id: item.mbid || Math.random(),
      titulo: item.name || 'Sem título',
      artista: item.artist?.name || 'Artista desconhecido',
      capa: item.image?.[3]?.['#text'] || 'https://via.placeholder.com/300'
    }));
  } catch (error) {
    console.error('Erro:', error);
    musicas.value = [];
  } finally {
    loading.value = false;
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
    <header class="top-bar">
      <div class="search-container">
        <span class="icon">🔍</span>
        <input v-model="searchQuery" placeholder="O que você quer ouvir?" />
      </div>
    </header>

    <main class="content">
      <h2 class="section-title">Suas músicas favoritas</h2>
      
      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else class="grid-musicas">
        <div v-for="musica in filteredMusicas" :key="musica.id" class="card-spotify">
          <div class="capa-wrapper">
            <img :src="musica.capa" :alt="musica.titulo" />
            <button class="btn-play">▶</button>
          </div>
          <div class="info">
            <h3 class="titulo">{{ musica.titulo }}</h3>
            <p class="artista">{{ musica.artista }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

.spotify-layout {
  min-height: 100vh;

  background: #050a18; 
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
}


.top-bar {
  padding: 20px 40px;
}

.search-container {
  /* Cor do input de busca conforme o print */
  background-color: #0f172a; 
  width: 300px;
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1); /* Bordas sutis como na imagem */
  transition: 0.3s;
}

.search-container input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  margin-left: 10px;
  width: 100%;
  font-size: 14px;
}

.search-container input::placeholder {
  color: #94a3b8; /* Cor cinza azulada do placeholder */
}

/* ===== CONTEÚDO ===== */
.content {
  padding: 0 40px 40px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* ===== GRID ===== */
.grid-musicas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ===== CARD (Cor idêntica ao container do print) ===== */
.card-spotify {
  background-color: #0c1222; /* Azul escuro dos containers da imagem */
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: 0.3s;
  cursor: pointer;
}

.card-spotify:hover {
  background-color: #111a30;
  border-color: rgba(255, 255, 255, 0.1);
}

/* ===== CAPA ===== */
.capa-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  margin-bottom: 12px;
}

.capa-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* ===== BOTÃO PLAY (Azul Royal da Imagem) ===== */
.btn-play {
  position: absolute;
  bottom: 8px;
  right: 8px;
  /* Usei o azul do botão "Conhecer Planos" da sua imagem */
  background-color: #2563eb; 
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 18px;
  color: #fff; /* Texto branco para o play no azul */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: 0.3s;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

.card-spotify:hover .btn-play {
  opacity: 1;
  transform: translateY(0);
}

/* ===== TEXTO ===== */
.titulo {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #fff;
}

.artista {
  font-size: 13px;
  color: #94a3b8; /* Cor secundária suavizada */
}

.loading {
  color: #94a3b8;
  font-size: 14px;
}

</style>