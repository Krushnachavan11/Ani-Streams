 console.log("Video Plays window Script is running......");
 /* ════ DATA ════ */
    const episodes = [
      { num: 1,  title: "Someone's Dream",             dur: "24:03", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 2,  title: "Water Breathing",              dur: "23:40", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 3,  title: "Sabito and Makomo",            dur: "23:55", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 4,  title: "Final Selection",              dur: "24:10", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 5,  title: "My Own Steel",                 dur: "23:48", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 6,  title: "Swordsman Accompanying a Demon", dur: "24:02", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 7,  title: "Muzan Kibutsuji",              dur: "23:58", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 8,  title: "The Smell of Enchanting Blood", dur: "24:05", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 9,  title: "Temari Demon and Arrow Demon", dur: "23:52", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 10, title: "Together Forever",              dur: "24:01", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 11, title: "Tsuzumi Mansion",               dur: "23:59", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { num: 12, title: "A Connected Bond: Daybreak and First Light", dur: "24:03", thumb: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
    ];

    const related = [
      { title: "Jujutsu Kaisen", eps: "Ep 48", score: "8.6", genre: "Action", img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg", sub: true, dub: true },
      { title: "Attack on Titan: Final Season", eps: "Ep 16", score: "8.9", genre: "Action", img: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg", sub: true, dub: false },
      { title: "Frieren: Beyond Journey's End", eps: "Ep 28", score: "9.3", genre: "Fantasy", img: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg", sub: true, dub: false },
      { title: "Chainsaw Man", eps: "Ep 12", score: "8.7", genre: "Action", img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg", sub: true, dub: true },
      { title: "Vinland Saga", eps: "Ep 48", score: "9.0", genre: "Historical", img: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg", sub: true, dub: false },
      { title: "One Punch Man", eps: "Ep 24", score: "8.8", genre: "Action", img: "https://cdn.myanimelist.net/images/anime/12/76049.jpg", sub: true, dub: true },
    ];

    const comments = [
      { user: "SakuraFan99", time: "2h ago", text: "The animation in this episode was INSANE. ufotable never misses fr 🔥", likes: 847, color: "#e85d2f" },
      { user: "AnimeWeekly", time: "3h ago", text: "This finale hit different. Tanjiro's final form was everything I hoped for. Couldn't stop crying at the end.", likes: 623, color: "#5b9fff", spoiler: true },
      { user: "OtakuKing_", time: "4h ago", text: "Best episode of the season for sure. The sword fight choreography alone deserves an award.", likes: 412, color: "#4dcc99" },
      { user: "MizukoHana", time: "5h ago", text: "I've watched this episode 3 times already and I'm still getting chills from that final sequence.", likes: 289, color: "#f5a623" },
      { user: "DemonSlayerLover", time: "6h ago", text: "The background music choice was perfect. Yuki Kajiura + ufotable = masterpiece every single time.", likes: 198, color: "#c084fc" },
    ];

    const youLike = [
      { title: "Fullmetal Alchemist: Brotherhood", score: "9.1", ep: "64 eps", img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" },
      { title: "Steins;Gate", score: "9.0", ep: "24 eps", img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
      { title: "Hunter x Hunter", score: "9.0", ep: "148 eps", img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg" },
      { title: "Mob Psycho 100", score: "8.8", ep: "37 eps", img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg" },
      { title: "Blue Lock", score: "8.2", ep: "24 eps", img: "https://cdn.myanimelist.net/images/anime/1258/126929.jpg" },
      { title: "Solo Leveling", score: "8.4", ep: "12 eps", img: "https://cdn.myanimelist.net/images/anime/1049/141165.jpg" },
      { title: "Spy x Family", score: "8.5", ep: "37 eps", img: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg" },
    ];

    /* ════ RENDER EP GRID ════ */
    const epGrid = document.getElementById('ep-grid');
    const epList = document.getElementById('ep-list');
    const CURRENT_EP = 12;

    epGrid.innerHTML = episodes.map(ep => `
      <div class="ep-num ${ep.num === CURRENT_EP ? 'active' : ep.num < CURRENT_EP ? 'watched' : ''}"
           title="Ep ${ep.num}: ${ep.title}" onclick="selectEp(${ep.num},this)">
        ${ep.num}
      </div>
    `).join('');

    epList.innerHTML = episodes.map(ep => `
      <div class="ep-list-item ${ep.num === CURRENT_EP ? 'active' : ''}" onclick="selectEp(${ep.num},this)">
        <img class="ep-list-thumb" src="${ep.thumb}" alt="Ep ${ep.num}" />
        <div class="ep-list-info">
          <div class="ep-list-num">Episode ${ep.num}</div>
          <div class="ep-list-title">${ep.title}</div>
          <div class="ep-list-meta">${ep.dur} &nbsp;·&nbsp; ${ep.num < CURRENT_EP ? '✓ Watched' : ep.num === CURRENT_EP ? '▶ Now Playing' : 'Not watched'}</div>
        </div>
      </div>
    `).join('');

    /* ════ RENDER RELATED ════ */
    document.getElementById('rec-list').innerHTML = related.map(r => `
      <div class="rec-item">
        <img class="rec-thumb" src="${r.img}" alt="${r.title}" onerror="this.src='https://via.placeholder.com/88x124/13151a/555?text=?'" />
        <div class="rec-info">
          <div class="rec-title">${r.title}</div>
          <div class="rec-meta">
            <span class="rec-score">★ ${r.score}</span>
            <span>${r.genre} · ${r.eps}</span>
            <span>
              ${r.sub ? '<span class="rec-badge rb-sub">SUB</span>' : ''}
              ${r.dub ? '<span class="rec-badge rb-dub">DUB</span>' : ''}
            </span>
          </div>
        </div>
      </div>
    `).join('');

    /* ════ RENDER COMMENTS ════ */
    document.getElementById('comment-list').innerHTML = comments.map(c => `
      <div class="comment-item">
        <div class="avatar" style="background:${c.color}22;color:${c.color};border-color:${c.color}44;">${c.user[0]}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-user">${c.user}</span>
            <span class="comment-time">${c.time}</span>
            ${c.spoiler ? '<span class="spoiler-badge">SPOILER</span>' : ''}
          </div>
          <div class="comment-text">${c.text}</div>
          <div class="comment-footer">
            <button class="comment-like">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              ${c.likes.toLocaleString()}
            </button>
            <button class="comment-reply">Reply</button>
          </div>
        </div>
      </div>
    `).join('');

    /* ════ RENDER YOU MAY LIKE ════ */
    document.getElementById('you-like-grid').innerHTML = youLike.map(a => `
      <div class="arc">
        <div class="arc-thumb">
          <img src="${a.img}" alt="${a.title}" onerror="this.src='https://via.placeholder.com/140x210/13151a/555?text=?'" />
          <span class="arc-score">★ ${a.score}</span>
          <span class="arc-ep">${a.ep}</span>
        </div>
        <div class="arc-title">${a.title}</div>
        <div class="arc-meta">TV · HD</div>
      </div>
    `).join('');

    /* ════ INTERACTIONS ════ */
    let playing = false;

    document.getElementById('playBtn').addEventListener('click', () => {
      playing = !playing;
      document.getElementById('playBtn').innerHTML = playing
        ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
        : `<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>`;
      if (playing) simulateProgress();
    });

    document.getElementById('ctrlPlay').addEventListener('click', () => {
      playing = !playing;
      document.getElementById('ctrlPlay').innerHTML = playing
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
    });

    let prog = 42;
    function simulateProgress() {
      if (!playing) return;
      prog = Math.min(prog + 0.05, 100);
      document.getElementById('progressFill').style.width = prog + '%';
      const total = 24 * 60 + 3;
      const cur = Math.round(total * prog / 100);
      const m = String(Math.floor(cur / 60)).padStart(2, '0');
      const s = String(cur % 60).padStart(2, '0');
      document.getElementById('ctrlTime').textContent = `${m}:${s} / 24:03`;
      if (prog > 85) document.getElementById('skipOutro').style.display = 'flex';
      if (prog < 100) requestAnimationFrame(simulateProgress);
    }

    document.getElementById('progress').addEventListener('click', e => {
      const rect = e.currentTarget.getBoundingClientRect();
      prog = ((e.clientX - rect.left) / rect.width) * 100;
      document.getElementById('progressFill').style.width = prog + '%';
    });

    document.getElementById('skipIntro').addEventListener('click', () => {
      prog = 15;
      document.getElementById('progressFill').style.width = '15%';
      document.getElementById('skipIntro').style.display = 'none';
    });

    document.getElementById('skipOutro').addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('fsBtn').addEventListener('click', () => {
      const p = document.getElementById('player');
      if (document.fullscreenElement) document.exitFullscreen();
      else p.requestFullscreen?.();
    });

    /* Server select */
    document.querySelectorAll('.server-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const row = this.closest('.server-row');
        row.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });

    /* Ep select */
    function selectEp(num, el) {
      document.querySelectorAll('.ep-num').forEach(e => e.classList.remove('active'));
      document.querySelectorAll('.ep-list-item').forEach(e => e.classList.remove('active'));
      const allEl = document.querySelectorAll('.ep-num')[num - 1];
      const listEl = document.querySelectorAll('.ep-list-item')[num - 1];
      if (allEl) allEl.classList.add('active');
      if (listEl) listEl.classList.add('active');
      prog = 0;
      playing = false;
      document.getElementById('progressFill').style.width = '0%';
      document.getElementById('ctrlTime').textContent = `00:00 / 24:03`;
    }

    /* View toggle */
    function setView(view, btn) {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (view === 'grid') {
        epGrid.style.display = 'grid';
        epList.style.display = 'none';
      } else {
        epGrid.style.display = 'none';
        epList.style.display = 'flex';
      }
    }

    /* Sidebar tabs */
    function switchTab(btn, id) {
      document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.stab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + id).classList.add('active');
    }

    /* Sub/Dub toggle */
    function setSubDub(btn, type) {
      btn.closest('.player-sub-toggle').querySelectorAll('.sub-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    /* Like toggle */
    function toggleLike(btn) {
      btn.classList.toggle('liked');
      btn.innerHTML = btn.classList.contains('liked')
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> In My List`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Add to List`;
    }