<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/index.js';
 

const musicas = ref([]);
const loading = ref(true);
const searchQuery = ref('');


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
        capa: item.image?.[3]?.['#text'] || 'https://via.placeholder.com/300',
        isFavorited: jaEFavorito
      };
    });

  } catch (error) {

    if (error.response?.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      console.error('Erro ao carregar músicas:', error.response?.data || error);
    }

  } finally {
    loading.value = false;
  }
};


const toggleFavorite = async (musica) => {
  const originalStatus = musica.isFavorited;

  try {
    if (!originalStatus) {

      
      musica.isFavorited = true;

      await api.post('/favorite/criar', {
        music_id: musica.id,
        music_name: musica.titulo,
        artist_name: musica.artista
      });

    } else {

      musica.isFavorited = false;

      await api.delete(`/favorite/descurtir/${musica.id}`);
    }

  } catch (error) {

    musica.isFavorited = originalStatus;

    if (error.response?.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      console.error('Erro ao favoritar:', error.response?.data || error);
      alert('Erro no servidor. Tente novamente.');
    }
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
        <h2 class="section-title">Top músicas</h2>
        
        <div v-if="loading" class="loading">Carregando sua biblioteca...</div>

        <div v-else-if="filteredMusicas.length === 0" class="loading">
          Nenhuma música encontrada.
        </div>

        <div v-else class="grid-musicas">
          <div 
            v-for="musica in filteredMusicas" 
            :key="musica.id" 
            class="card-spotify"
          >
            <div class="capa-wrapper">
              <img :src="musica.capa" :alt="musica.titulo" loading="lazy" />
              
              <button class="btn-play">▶</button>

              <button 
                class="btn-like"
                :class="{ 'is-active': musica.isFavorited }"
                @click.stop="toggleFavorite(musica)"
              >
                {{ musica.isFavorited ? '💙' : '🤍' }}
              </button>
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
  /* Adicionei apenas uma transição suave para o feedback do clique */
  .btn-like {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.6);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-like:active {
    transform: scale(0.8);
  } 
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
    background-color: #0f172a;
    width: 300px;
    display: flex;
    align-items: center;
    padding: 8px 14px;
    border-radius: 30px;
  }

  .search-container input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    margin-left: 10px;
    width: 100%;
  }

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

  .grid-musicas {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .card-spotify {
    background-color: #0c1222;
    padding: 16px;
    border-radius: 12px;
    transition: 0.3s;
    cursor: pointer;
  }

  .card-spotify:hover {
    background-color: #111a30;
  }

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

  .btn-play {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: #2563eb;
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 18px;
    color: #fff;
    opacity: 0;
    transform: translateY(10px);
    transition: 0.3s;
  }

  .card-spotify:hover .btn-play {
    opacity: 1;
    transform: translateY(0);
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
    font-size: 16px;
    color: white;
    cursor: pointer;
    transition: 0.2s;
  }

  .btn-like:hover {
    transform: scale(1.1);
  }

  .titulo {
    font-size: 15px;
    font-weight: 600;
  }

  .artista {
    font-size: 13px;
    color: #94a3b8;
  }

  .loading {
    color: #94a3b8;
  }
  </style>