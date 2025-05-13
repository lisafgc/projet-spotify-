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
        "Hozier": "Folk"
    };

    const artists = Object.keys(genreMap); 
    const genreCount = {};

    // Comptabilisation des genres
    artists.forEach(name => {
        const genre = genreMap[name];
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Création du graphique pour les genres musicaux
    const labels = Object.keys(genreCount); 
    const dataValues = Object.values(genreCount); 
    const backgroundColors = [
        "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40",
        "#ffb3e6", "#66b3ff", "#b3e6b3", "#ff6666", "#c2c2f0", "#ffb366"
    ]; 

    new Chart(document.getElementById("genresChart").getContext("2d"), {
        type: "pie", 
        data: {
            labels: labels,
            datasets: [{
                label: "Genres musicaux",
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, labels.length) // Limite les couleurs disponibles en fonction du nombre de genres
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

    // Traitement des morceaux et ajout à la table
    data.forEach(entry => {
        const tracks = entry.album?.tracks || [];
        const artistName = entry.album?.artists?.[0]?.name || "Inconnu";
        const genre = genreMap[artistName]; 

        if (genre) { // On ne comptabilise que les genres définis
            artistCount[artistName] = (artistCount[artistName] || 0) + tracks.length;
        }

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

    // Création du graphique des top artistes
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
}

fetchPlaylist();
