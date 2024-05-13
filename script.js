/*Esegui anche i seguenti esercizi:
• Aggiungi un pulsante "crea lista". Al click, mostra tutti i TITOLI degli album sulla pagina
(EXTRA facoltativo: falli apparire in un modale di bootstrap).
SUGGERIMENTO: aiutati con la network tab e console.log per capire la struttura della risposta http */


/* API DA CHIAMARE:
https://striveschool-api.herokuapp.com/api/deezer/search?q-
-INSERISCIQUIUNAQUERY
Esempi:
https://striveschool-api.herokuapp.com/api/deezer/search?q=
https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica
https://striveschool-api.herokuapp.com/api/deezer/search?q=queen */


// Funzione per chiamare l'API di Deezer e aggiornare la pagina con i risultati della ricerca

async function search() {

    const query = document.getElementById('searchField').value;
    const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`;

    hideAllArtistSections();  // Nasconde tutte le sezioni prima di effettuare la ricerca

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (query.toLowerCase() === 'eminem') {
            displayArtistResults(data.data, 'eminemSection');
        } else if (query.toLowerCase() === 'metallica') {
            displayArtistResults(data.data, 'metallicaSection');
        } else if (query.toLowerCase() === 'queen') {
            displayArtistResults(data.data, 'queenSection');
        } else if (query.toLowerCase() === 'nirvana') {
            displayArtistResults(data.data, 'nirvanaSection');
        } else {
            displayResults(data.data);
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
        alert('Failed to retrieve data. Please try again.');
    }
}



// Mostra il contenitore dei risultati all'inizio della funzione displayResults
function displayArtistResults(albums, sectionId) {
    const section = document.getElementById(sectionId);
    const parentDiv = section.parentNode; // Riferimento al div che contiene l'intero ID dell'artista, ad esempio `id="eminem"`
    parentDiv.classList.remove('d-none'); // Mostra la sezione
    section.innerHTML = ''; // Pulizia dei contenuti precedenti

    albums.forEach(album => {
        const albumDiv = document.createElement('div');
        albumDiv.className = 'col';
        albumDiv.innerHTML = `
            <div class="card">
                <img src="${album.album.cover}" class="card-img-top" alt="${album.album.title}">
                <div class="card-body">
                    <h5 class="card-title">${album.album.title}</h5>
                    <p class="card-text">${album.artist.name}</p>
                </div>
            </div>
        `;
        section.appendChild(albumDiv);
    });
}

function hideAllArtistSections() {
    const artistSections = ['eminemSection', 'metallicaSection', 'queenSection','nirvanaSection'];
    artistSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const parentDiv = section.parentNode;
        parentDiv.classList.add('d-none'); // Nasconde la sezione
    });
}
