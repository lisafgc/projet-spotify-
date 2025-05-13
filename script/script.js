async function fetchPlaylist() {
    const response = await fetch("data/data.json");
    const data = await response.json();
  
    const tbody = document.getElementById("playlist-table");
    const artistCount = {};
    let index = 1;
  
  
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
        "Hozier": "Folk",
    };
    
  
  const artists = [
    "Måneskin", "Bad Bunny", "Tom Morello", "Ed Sheeran", "The Weeknd",
    "Omar Courtz", "Imagine Dragons", "Shakira", "Beethoven", "Drake",
    "Eminem", "Nirvana", "Dua Lipa", "Inconnu 1", "Inconnu 2"
  ];
  
  const genreCount = {};
  artists.forEach(name => {
    const genre = genreMap[name] || "Inconnu";
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });
  
  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  const topGenres = sortedGenres.slice(0, 5);
  const autresTotal = sortedGenres.slice(5).reduce((acc, [_, val]) => acc + val, 0);
  if (autresTotal > 0) {
    topGenres.push(["Autre", autresTotal]);
  }
  
  const labels = topGenres.map(e => e[0]);
  const dataValues = topGenres.map(e => e[1]);
  const backgroundColors = [
    "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"
  ];
  
  new Chart(document.getElementById("genresChart").getContext("2d"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "Genres musicaux",
        data: dataValues,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Répartition des genres musicaux"
        }
      }
    }
  });  
  
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