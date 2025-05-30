async function fetchPlaylist() {
    const response = await fetch("data/data.json");
    const data = await response.json();
  
    const allowedTracks = [
      "love you more than me", "hero", "daylight", "end of beginning", "my blue heaven",
      "say yes to heaven", "here with me", "my kind of women", "je te laisserais des mots",
      "video games", "glimpse of us", "reste en vie", "monde", "daddy issues", "forgotten",
      "bloodsport’15", "circles", "pink + white", "white ferrari", "lose control",
      "so my darling acoustic", "her eyes", "see you again", "missing pieces",
      "toutes les femmes de ta vie", "beanie", "and i love her", "jacob and the stone",
      "love hate thing feat meek mill", "salir song", "let’s go back", "back on 74",
      "margaret", "chichiro", "i found", "too sweet"
    ].map(t => t.toLowerCase());
  
    const tbody = document.getElementById("playlist-table");
    const artistCount = {};
    const genreMap = {
      "Djo": "Rock",
      "Dorado Schmitt": "Jazz",
      "Montell Fish": "R&B",
      "David Kushner": "Pop",
      "Luidji": "Rap",
      "Gehen": "Hardcore Punk",
      "Post Malone": "Hip-Hop",
      "Teddy Swims": "Soul",
      "DJ Gummy Bear": "Techno",
      "Julien Doré": "Chanson Française",
      "Emile Mosseri": "Film Score",
      "Jungle": "Funk",
      "Billie Eilish": "Electropop",
      "Hozier": "Folk"
    };
    const genreCount = {};
    let index = 1;
  
    const foundTracks = new Set();
  
    data.forEach(entry => {
      const tracks = entry.album?.tracks || [];
      const artistName = entry.album?.artists?.[0]?.name || "Inconnu";
  
      tracks.forEach(track => {
        const trackName = track.name.toLowerCase();
  
        if (!allowedTracks.includes(trackName)) return;
  
        foundTracks.add(trackName);
  
        // Comptage artistes
        artistCount[artistName] = (artistCount[artistName] || 0) + 1;
  
        // Comptage genres
        const genre = genreMap[artistName];
        if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;
  
        // Affichage ligne tableau
        const durationMs = track.duration_ms || 0;
        const durationMin = Math.floor(durationMs / 60000);
        const durationSec = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, '0');
        const duration = `${durationMin}:${durationSec}`;
  
        // URL Spotify (exemple générique, adapte si tu as des liens spécifiques)
        const spotifyUrl = track.external_urls?.spotify || "#";
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index++}</td>
          <td>${track.name}</td>
          <td>${artistName}</td>
          <td>${duration}</td>
          <td>
            <a href="${spotifyUrl}" target="_blank" class="btn btn-success btn-sm">
              Écouter
            </a>
          </td>
        `;
        tbody.appendChild(row);
      });
    });
  
    // Graphique genres
    new Chart(document.getElementById("genresChart").getContext("2d"), {
      type: "pie",
      data: {
        labels: Object.keys(genreCount),
        datasets: [{
          label: "Genres musicaux",
          data: Object.values(genreCount),
          backgroundColor: [
            "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40",
            "#ffb3e6", "#66b3ff", "#b3e6b3", "#ff6666", "#c2c2f0", "#ffb366"
          ],
          // Affiche les pourcentages sur chaque tranche
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              const dataArr = ctx.chart.data.datasets[0].data;
              dataArr.forEach(data => sum += data);
              const percentage = (value * 100 / sum).toFixed(1) + "%";
              return percentage;
            },
            color: "#fff",
            font: { weight: "bold", size: 14 }
          }
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Répartition des genres musicaux"
          },
          datalabels: {
            display: true
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  
    // Graphique top artistes
    const sortedArtists = Object.entries(artistCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  
    new Chart(document.getElementById("topArtistsChart").getContext("2d"), {
      type: "bar",
      data: {
        labels: sortedArtists.map(e => e[0]),
        datasets: [{
          label: "Nombre de morceaux",
          data: sortedArtists.map(e => e[1]),
          backgroundColor: "#36a2eb"
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: {
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  
    // Liste des morceaux non trouvés (pour debug)
    const notFound = allowedTracks.filter(title => !foundTracks.has(title));
    if (notFound.length) {
      console.warn("Morceaux non trouvés dans le JSON :", notFound);
    } else {
      console.log("✅ Tous les morceaux ont été trouvés !");
    }
  }
  
  fetchPlaylist();
  
  // --- Recherche live dans la barre de recherche ---
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#playlist-table tr');
  
    rows.forEach(row => {
      const titleCell = row.querySelector('td:nth-child(2)');
      if (titleCell) {
        const text = titleCell.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
      }
    });
  });
  