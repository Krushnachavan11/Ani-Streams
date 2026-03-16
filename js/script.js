
    /* ─── DATA ─── */
    const animeData = [
      { title: "Demon Slayer S4", ep: "Ep 12", score: "9.1", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { title: "Jujutsu Kaisen S3", ep: "Ep 8", score: "8.6", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" },
      { title: "One Piece", ep: "Ep 1090", score: "8.9", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg" },
      { title: "Blue Lock S2", ep: "Ep 5", score: "8.2", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1258/126929.jpg" },
      { title: "Solo Leveling S2", ep: "Ep 10", score: "8.4", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1049/141165.jpg" },
      { title: "Chainsaw Man S2", ep: "Ep 6", score: "8.7", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg" },
      { title: "Frieren", ep: "Ep 28", score: "9.3", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg" },
      { title: "Overlord V", ep: "Ep 3", score: "7.9", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1939/131167.jpg" },
      { title: "Vinland Saga S3", ep: "Ep 15", score: "9.0", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg" },
      { title: "My Hero Academia S7", ep: "Ep 20", score: "8.1", sub: true, type: "TV", img: "https://cdn.myanimelist.net/images/anime/10/78745.jpg" },
    ];

    const movieData = [
      { title: "Suzume", ep: "Movie", score: "8.3", sub: true, type: "Movie", img: "https://cdn.myanimelist.net/images/anime/1695/123100.jpg" },
      { title: "One Piece Film: Red", ep: "Movie", score: "7.8", sub: true, type: "Movie", img: "https://cdn.myanimelist.net/images/anime/1244/122440.jpg" },
      { title: "Dragon Ball Super: Broly", ep: "Movie", score: "8.0", sub: true, type: "Movie", img: "https://cdn.myanimelist.net/images/anime/1303/90593.jpg" },
      { title: "Jujutsu Kaisen 0", ep: "Movie", score: "8.5", sub: true, type: "Movie", img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg" },
      { title: "Spirited Away", ep: "Movie", score: "9.0", sub: true, type: "Movie", img: "https://cdn.myanimelist.net/images/anime/6/79597.jpg" },
      { title: "Your Name", ep: "Movie", score: "9.0", sub: true, type: "Movie", img: "https://cdn.myanimelist.net/images/anime/5/87048.jpg" },
    ];

    const topData = [
      { title: "Frieren: Beyond Journey's End", score: "9.37", eps: "28 eps", genre: "Fantasy" },
      { title: "Fullmetal Alchemist: Brotherhood", score: "9.10", eps: "64 eps", genre: "Action" },
      { title: "Demon Slayer: Kimetsu no Yaiba", score: "9.08", eps: "26 eps", genre: "Action" },
      { title: "Gintama°", score: "9.06", eps: "51 eps", genre: "Comedy" },
      { title: "Steins;Gate", score: "9.04", eps: "24 eps", genre: "Sci-Fi" },
      { title: "Attack on Titan: Final Season", score: "8.99", eps: "16 eps", genre: "Action" },
      { title: "Hunter x Hunter (2011)", score: "8.97", eps: "148 eps", genre: "Adventure" },
      { title: "Vinland Saga Season 2", score: "8.96", eps: "24 eps", genre: "Historical" },
    ];

    const scheduleData = [
      { time: "08:30", name: "One Piece", ep: "Ep 1090", img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg" },
      { time: "11:00", name: "Jujutsu Kaisen", ep: "Ep 48", img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" },
      { time: "14:30", name: "Blue Lock", ep: "Ep 38", img: "https://cdn.myanimelist.net/images/anime/1258/126929.jpg" },
      { time: "17:00", name: "Demon Slayer", ep: "Ep 12", img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { time: "20:00", name: "Solo Leveling", ep: "Ep 10", img: "https://cdn.myanimelist.net/images/anime/1049/141165.jpg" },
      { time: "22:30", name: "Frieren", ep: "Ep 28", img: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg" },
    ];

    /* ─── RENDER FUNCTIONS ─── */
    function createAnimeCard(anime) {
      return `
        <div class="anime-card">
          <div class="card-thumb">
            <img src="${anime.img}" alt="${anime.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300/13151a/555a6b?text=No+Image'" />
            <div class="card-overlay">
              <div class="play-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
              </div>
            </div>
            <span class="card-ep-badge">${anime.ep}</span>
            ${anime.sub ? '<span class="card-sub-badge">SUB</span>' : ''}
            <span class="card-score">★ ${anime.score}</span>
          </div>
          <div class="card-info">
            <div class="card-title">${anime.title}</div>
            <div class="card-sub-info">
              <span>${anime.type}</span>
              <span style="color:var(--text-dim);">·</span>
              <span>HD</span>
            </div>
          </div>
        </div>
      `;
    }

    function renderGrid(id, data) {
      document.getElementById(id).innerHTML = data.map(createAnimeCard).join('');
    }

    function renderTopList() {
      document.getElementById('top-list').innerHTML = topData.map((a, i) => `
        <div class="top-item">
          <span class="top-rank">${String(i + 1).padStart(2, '0')}</span>
          <img class="top-thumb" src="${animeData[i]?.img || ''}" alt="${a.title}" onerror="this.src='https://via.placeholder.com/52x70/13151a/555a6b?text=?'" />
          <div class="top-info">
            <div class="top-title">${a.title}</div>
            <div class="top-meta">
              <span style="color:var(--accent2);">★ ${a.score}</span>
              <span style="color:var(--text-dim);">·</span>
              <span>${a.eps}</span>
              <span style="color:var(--text-dim);">·</span>
              <span>${a.genre}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    function renderSchedule() {
      document.getElementById('schedule-list').innerHTML = scheduleData.map(s => `
        <div class="schedule-item">
          <span class="sched-time">${s.time}</span>
          <img class="sched-thumb" src="${s.img}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/38x52/13151a/555a6b?text=?'" />
          <div class="sched-info">
            <div class="sched-name">${s.name}</div>
            <div class="sched-ep">${s.ep}</div>
          </div>
        </div>
      `).join('');
    }

    renderGrid('trending-grid', animeData.slice(0, 8));
    renderGrid('new-grid', animeData.slice(2, 8));
    renderGrid('movie-grid', movieData);
    renderTopList();
    renderSchedule();

    /* ─── HERO SLIDER ─── */
    let current = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => goTo(+dot.dataset.dot));
    });

    setInterval(() => goTo((current + 1) % slides.length), 5000);

    /* ─── GENRE TAGS ─── */
    document.querySelectorAll('.genre-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      });
    });
 