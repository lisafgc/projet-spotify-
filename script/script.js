async function fetchPlaylist() {
    const response = await fetch("data/data.json");
    const data = await response.json();
  
    const tbody = document.getElementById("playlist-table");
    const artistCount = {};
    const genreCount = {};
    let index = 1;
  
  
    const genreMap = {
      "Måneskin": "Rock",
      "Bad Bunny": "Reggaeton",
      "Tom Morello": "Rock",
      "Ed Sheeran": "Pop",
      "The Weeknd": "Pop",
      "Omar Courtz": "Reggaeton"
  
    };
  
    data.forEach(entry => {
      const tracks = entry.album?.tracks || [];
      const artistName = entry.album?.artists?.[0]?.name || "Inconnu";
      const genre = genreMap[artistName] || "Inconnu";
  
  
      artistCount[artistName] = (artistCount[artistName] || 0) + tracks.length;
      genreCount[genre] = (genreCount[genre] || 0) + tracks.length;
  
  
      tracks.forEach(track => {
        const durationMs = track.duration_ms || 0;
        const durationMin = Math.floor(durationMs / 60000);
        const durationSec = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, '0');
        const duration = `${durationMin}:${durationSec}`;
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index++}</td>
          <td>${track.name}</td>
          <td>${artistName}</td>
          <td>${duration}</td>
        `;
        tbody.appendChild(row);
      });
    });
  
  
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
        plugins: {
          legend: { display: false }
        }
      }
    });
  
    
    new Chart(document.getElementById("genresChart").getContext("2d"), {
      type: "doughnut",
      data: {
        labels: Object.keys(genreCount),
        datasets: [{
          label: "Genres",
          data: Object.values(genreCount),
          backgroundColor: [
            "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }
  
  fetchPlaylist();