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
    "Post Malone": "Hip-Hop",
    "Teddy Swims": "Soul",
    "Jungle": "Funk",
    "Autre": "Autre",
  };

  // === 🔽 Albums populaires ===
const albumMap = new Map();

data.forEach(entry => {
  const album = entry.album;
  if (!album || !album.name || !album.images?.[0]?.url) return;

  const artistName = album.artists?.[0]?.name || "Inconnu";
  const albumName = album.name;
  const imageUrl = album.images[0].url;
  const spotifyUrl = album.external_urls?.spotify || "#";
  const popularity = album.popularity || 0;

  const key = albumName + artistName;
  if (!albumMap.has(key)) {
    albumMap.set(key, { albumName, artistName, imageUrl, spotifyUrl, popularity });
  }
});

// Trie les albums par popularité
const topAlbums = Array.from(albumMap.values())
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 12); // Top 12 albums

const albumContainer = document.getElementById("popular-albums");
topAlbums.forEach(album => {
  const col = document.createElement("div");
  col.className = "col";
  col.innerHTML = `
    <div class="card album-card h-100 shadow-sm">
      <img src="${album.imageUrl}" class="card-img-top" alt="${album.albumName}">
      <div class="card-body">
        <h5 class="card-title">${album.albumName}</h5>
        <p class="card-text text-muted">${album.artistName}</p>
      </div>
      <div class="card-footer bg-transparent border-top-0 text-end">
        <a href="${album.spotifyUrl}" target="_blank" class="btn btn-sm btn-success">Voir sur Spotify</a>
      </div>
    </div>
  `;
  albumContainer.appendChild(col);
});


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
      artistCount[artistName] = (artistCount[artistName] || 0) + 1;

      const genre = genreMap[artistName];
      if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;

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
        <td>
          <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#detailsModal"
            data-track='${JSON.stringify({
              name: track.name,
              artist: artistName,
              duration: duration,
              popularity: track.popularity || 0,
              explicit: track.explicit ? "Oui" : "Non",
              preview_url: track.preview_url || "",
              spotify_url: track.external_urls?.spotify || "#",
              genres: entry.genres || [],
              artists: entry.album?.artists?.map(a => ({
                name: a.name,
                popularity: a.popularity || 0,
                followers: a.followers?.total || 0
              })) || []
            }).replace(/'/g, "&apos;")}'>
            Détails
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  });

  // === 🔽 Graphique genres ===
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

  // === 🔽 Graphique top artistes ===
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

  // Debug : morceaux manquants
  const notFound = allowedTracks.filter(title => !foundTracks.has(title));
  if (notFound.length) {
    console.warn("Morceaux non trouvés dans le JSON :", notFound);
  } else {
    console.log("✅ Tous les morceaux ont été trouvés !");
  }
}

fetchPlaylist();

// 🔍 Recherche live
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

// Gère l'ouverture de la modale de détails
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("detailsModal");

  modal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const trackData = JSON.parse(button.getAttribute("data-track").replace(/&apos;/g, "'"));

    document.getElementById("modal-cover").src = trackData.album_image || "https://via.placeholder.com/200";
    document.getElementById("modal-title").textContent = `${trackData.name} — ${trackData.artist}`;
    document.getElementById("modal-audio").src = trackData.preview_url || "";
    document.getElementById("modal-duration").textContent = trackData.duration;
    document.getElementById("modal-popularity").style.width = `${trackData.popularity}%`;
    document.getElementById("modal-popularity").textContent = `${trackData.popularity}%`;
    document.getElementById("modal-release").textContent = trackData.release_date || "N/A";
    document.getElementById("modal-track-number").textContent = trackData.track_number || "N/A";
    document.getElementById("modal-explicit").textContent = trackData.explicit;

    const artists = (trackData.artists || []).map(a => `${a.name} (${a.followers} abonnés)`).join(", ");
    document.getElementById("modal-artists").textContent = artists || "N/A";

    const genres = (trackData.genres || []).join(", ");
    document.getElementById("modal-genres").textContent = genres || "N/A";

    document.getElementById("modal-spotify").href = trackData.spotify_url;
  });
});

const dataTrackValue = JSON.stringify({
  name: track.name,
  artist: artistName,
  duration: duration,
  popularity: track.popularity || 0,
  explicit: track.explicit ? "Oui" : "Non",
  preview_url: track.preview_url || "",
  spotify_url: track.external_urls?.spotify || "#",
  genres: entry.genres || [],
  album_image: entry.album?.images?.[0]?.url || "",
  release_date: entry.album?.release_date || "",
  track_number: track.track_number || "",
  artists: entry.album?.artists?.map(a => ({
    name: a.name,
    popularity: a.popularity || 0,
    followers: a.followers?.total || 0
  })) || []
}).replace(/'/g, "&apos;");

// Puis tu l’utilises dans ton HTML comme ça (par exemple avec React ou template literal) :
const html = `<div data-track='${dataTrackValue}'></div>`;

