<template>
  <div class="spotify-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h1 class="logo">Musicfy</h1>

      <nav class="menu">
        <router-link to="/" class="link" active-class="active">
          🏠 Home
        </router-link>

        <router-link to="/buscar" class="link" active-class="active">
          🔍 Buscar
        </router-link>

        <router-link to="/biblioteca" class="link" active-class="active">
          📚 Sua Biblioteca
        </router-link>
      </nav>

      <div class="playlists">
        <p class="title">PLAYLISTS</p>
        <span>Minha Playlist</span>
        <span>Favoritas</span>
        <span>Daily Mix</span>
      </div>
    </aside>

    <!-- CONTEÚDO -->
    <main class="content">
      <header class="topbar">
        <h2>Boa noite</h2>
      </header>

      <section>
        <h3>Feito para você</h3>

        <div class="cards">
          <div
            class="card"
            v-for="music in musics"
            :key="music.id"
          >
            <div class="image">
              <img :src="music.image" />
              <button class="play" @click="playMusic(music)">
                ▶
              </button>
            </div>

            <strong>{{ music.title }}</strong>
            <span>{{ music.artist }}</span>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<script setup>
const musics = [
  {
    id: 1,
    title: 'Daily Mix 1',
    artist: 'Post Malone, Travis Scott',
    image: 'https://i.scdn.co/image/ab67706f00000003a3c0b6b8bff5c3d1b6d9d6c7'
  },
  {
    id: 2,
    title: 'Chill Hits',
    artist: 'The Weeknd, Drake',
    image: 'https://i.scdn.co/image/ab67706f00000003e4eadd417a05b2546e866934'
  },
  {
    id: 3,
    title: 'Top Brasil',
    artist: 'Matuê, Veigh',
    image: 'https://i.scdn.co/image/ab67706f00000003fca9a0f63b0c64f8f6d4c6d5'
  },
  {
    id: 4,
    title: 'Pop Mix',
    artist: 'Dua Lipa, Ariana',
    image: 'https://i.scdn.co/image/ab67706f00000003e7d9c77dc1b9c6b7dcb2b4f5'
  }
]

function playMusic(music) {
  console.log('Tocando:', music.title)
}
</script>

<style scoped>
.spotify-layout {
  display: flex;
  height: 100vh;
  background: #121212;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 230px;
  background: #000;
  padding: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.menu .link {
  display: block;
  padding: 10px 0;
  color: #b3b3b3;
  text-decoration: none;
}

.menu .active,
.menu .link:hover {
  color: #fff;
}

.playlists {
  margin-top: 30px;
  font-size: 14px;
}

.playlists .title {
  color: #777;
  margin-bottom: 10px;
}

.playlists span {
  display: block;
  margin-bottom: 8px;
  color: #b3b3b3;
}

/* CONTEÚDO */
.content {
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
}

.topbar {
  margin-bottom: 30px;
}

/* CARDS */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.card {
  background: #181818;
  padding: 15px;
  border-radius: 8px;
  transition: 0.3s;
  cursor: pointer;
}

.card:hover {
  background: #282828;
}

.image {
  position: relative;
}

.image img {
  width: 100%;
  border-radius: 6px;
}

.play {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #1db954;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 16px;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
}

.card:hover .play {
  opacity: 1;
}

.card strong {
  display: block;
  margin-top: 10px;
}

.card span {
  font-size: 14px;
  color: #b3b3b3;
}
</style>