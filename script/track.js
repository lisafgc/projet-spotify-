const tracks = [
    // ... ton tableau de morceaux ici (les objets track)
  ];
  
  // Sélectionne le container dans la page
  const container = document.getElementById("tracks-container");
  
  // Fonction pour créer la carte d'un morceau
  function createTrackCard(track) {
    return `
      <div class="track-card" style="border:1px solid #ccc; margin:10px; padding:10px;">
        <img src="${track.album.images[0]?.url || ''}" alt="Cover" style="width:100px; height:100px; object-fit:cover;">
        <h3>${track.name}</h3>
        <p><strong>Artiste :</strong> ${track.artistName}</p>
        <p><strong>Durée :</strong> ${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}</p>
        <p><strong>Popularité :</strong> ${track.popularity}</p>
        <p><strong>Explicite :</strong> ${track.explicit ? "Oui" : "Non"}</p>
        <p><strong>Genres :</strong> ${track.genres.join(', ')}</p>
        <p><strong>Date de sortie :</strong> ${track.album.release_date}</p>
        <p><a href="${track.external_urls.spotify}" target="_blank">Écouter sur Spotify</a></p>
      </div>
    `;
  }
  
  container.innerHTML = tracks.map(createTrackCard).join('');
  