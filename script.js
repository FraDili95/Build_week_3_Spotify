//////////////////COSTANTI E VARIABILI GLOBALI///////////////////////////////////
const BUTTON_HOME = document.getElementById("home");//puntatore al bottone home
const numOfFavouritePunct = document.getElementsByClassName("num_song");//puntatori alle posizioni che indicano il numero dei preferiti
const toFavourite = document.getElementsByClassName("favourites");//puntatori ai bottoni che portano ai preferiti
const rightSidebarOpener = document.getElementById("rightSidebarOpener");//PUNTINI CHE APRONO LA SIDEBAR DI DESTRA
const rightSidebarCloser = document.getElementById("rightSidebarCloser");//BOTTONE CHE CHIUDE LA SIDEBAR DI DESTRA
const rightSidebar = document.getElementById("rightSidebar");//COSTANTE PER LA SIDEBAR DI DESTRA
const RIGHT = -2000; const LEFT = -1000; const TO_FAVOURITE = -3000;
const BUTTON_LEFT = document.getElementById("left");//BOTTONE INDIETRO
const BUTTON_RIGHT =document.getElementById("right");//BOTTONE AVANTI
const PAGES = document.querySelectorAll(".page")//ARRAY CONTENENTE I PUNTATORI A TUTTE LE PAGINE
const LINK_to_FAVOURETES = document.getElementsByName("favourites");//ARRAY CONTENENTE I PUNTATORI ALLA PAGINA PREFERITI
const queenContainer = document.getElementById("queenContainer")//
const sum41Container = document.getElementById("sum41Container")//
const createPlaylist = document.getElementById("createPlaylist")//BOTTONE PER CREARE LA PLAYLIST
const sidebarPlaylistList = document.getElementById("sidebarPlaylistList")//CONTENITORE DELLE PLAYLIST
const createPlaylistForm = document.getElementById("createPlaylistForm")//FORM PER CREARE LE PLAYLIST
const nameCreatePlaylist = document.getElementById("nameCreatePlaylist")//input in cui si inserisce il nome della playlist che si vuole aggingere
const defaultPage = document.getElementById("defaultPage");//PAGINA DI DEFAULT
const researchPage = document.getElementById("researchPage");//PAGINA DEI RIUSLTATI DI RICERCA
const paginaArtista = document.getElementById("paginaArtista");//PAGINA DEI RIUSLTATI DI RICERCA

const url = "http://striveschool-api.herokuapp.com/api/deezer/search?q=";
var currentpage = 0;//PAGINA CORRENTE(la imposto a 0 all'inizio che corrisponde alla prima pagina)
var currentFavourites = [];//array globale contenente i PREFERITI
var onFavourite = false;
///////////////////////////////////////////////////////////////////////////////////


function changePage ( arrayPages, direction ){//PER FARLA FUNZIONARE SERVE SOLO AGGIUNGERE LA CLASSE page AD OGNI PAGINA(e gli eventi ai bottoni)
    
    const hideClassInCurrent = () => { arrayPages[currentpage].classList.add("d-none"); };
    let onFavourite = false;
    // 1)nasconde pagina corrente 
    // 2)definisce il comportamento della funzione in base al valore di direction(impostato durante la chiamata)
    if( direction == LEFT && currentpage > 0 ){// se LEFT e non sono a pag 0, scorre indietro
        hideClassInCurrent();
        currentpage--;
    }else if( direction == RIGHT && currentpage < arrayPages.length-1 ){// se RIGHT e non sono a num max pag, scorre avanti
        hideClassInCurrent();
        currentpage++;
    }else if( direction == TO_FAVOURITE ){
        if(onFavourite === false){
            onFavourite = true;//pagina preferiti accesa
            hideClassInCurrent();
            document.querySelector(".special_page").classList.remove("d-none");//mostro pagina preferiti
            document.getElementById("left").classList.add("d-none");//nascondo BOTTONE INDIETRO
            document.getElementById("right").classList.add("d-none");//nascondo BOTTONE AVANTI
            document.getElementById("home").addEventListener("click", changePage(arrayPages, TO_FAVOURITE)) 
        }else{
            onFavourite = false;//pagina preferiti spenta
            document.querySelector(".special_page").classList.add("d-none");//nascondo pagina preferiti
            document.getElementById("left").classList.remove("d-none");//nascondo BOTTONE INDIETRO
            document.getElementById("right").classList.remove("d-none");//nascondo BOTTONE AVANTI
            currentpage = 0;
            arrayPages[currentpage].classList.remove("d-none");
        }

    }else{
        return false;
    }
    //---------------------------
    //3)riabilisco pagina successiva o precedente
    if(  direction != TO_FAVOURITE ){
        arrayPages[currentpage].classList.remove("d-none");
    }
    //---------------------------
    //4)se è arrivato qui è andato tutto bene e ritorno true(magari si utilizza o magari no boh)
    return true;

}//fine funz

//CREO LE FUNZIONE FETCH
async function fetchAlbum(nomeArtista) {

    //ESEGUO IL TRY..CATCH
    try {
        //Eseguo il fetch
        const response = await fetch(url+nomeArtista);

        const risultati = await response.json()

        return risultati
    } catch (error) {
        //NAL CASO DI ERRORE LO SEGNALO
        console.error("Errore:", error)
    }
}


//CREO LA FUNZIONE PER GENERARE LE CARDS
function createCards(risultati, container, addButton) {
    risultati.data.forEach(risultato => {
        console.log("RISULTATO",risultato);
        console.log("TRACKLIST",risultato.album.tracklist);
        console.log(risultato.artist.tracklist);
        const col = document.createElement("div");
        col.classList.add("col-3");
        //le 3 righe sotto il primo div sono quelle da aggiungere alla canzone per far apparire il bottone
        col.innerHTML =
        `
        <div class="card border-0 position-relative" style="width: 18rem;">
            <div class=" d-none position-absolute button_casual text-white d-flex justify-content-between align-items-center p-1 ps-3 pe-3" >
            <i class="bi bi-hand-thumbs-up-fill"></i>
            </div>
        <img src="${risultato.album.cover_medium}" class="card-img-top" alt="${risultato.album.title}">
        <div class="card-body">
            <h5 class="card-title fw-bold text-white">${risultato.album.title}</h5>
            <p class="text-white fs-5">${risultato.title}</p>
            <a class="card-text fw-bold" onclick="goPaginaArtista(${risultato.artist.id})">${risultato.artist.name}</a>
        </div>
        <a class="d-none fetch_album ">${risultato.album.id}</a>
        </div>
        `
        // Aggiungo gli event listener subito dopo aver creato la carta(SOLO SE SPECIFICATO DURANTE LA CHIAMATA)
        if( addButton ){
            col.querySelector('img').addEventListener("click", function(){
                const prova = `https://api.deezer.com/album/${col.querySelector('.fetch_album').textContent}/tracks`;
                console.log(prova);
                console.log( fetchAlbumTraks(prova) );
            })
            col.addEventListener('mouseenter', startHover);//evento entra il mouse
            col.addEventListener('mouseleave', endHover);//evento esce il mouseif( !(col.classList.contains("favourite")) ){//se non è già stato inserito nei preferiti
                col.firstElementChild.firstElementChild.addEventListener("click", function(){
                    //mi creo l'oggetto
                    const objFavourite = {
                        nameAlbum: risultato.album.title,
                        imgUrl: risultato.album.cover_medium,
                        artistName: risultato.artist.name,
                        songName: risultato.title_short,
                        durationSong: risultato.duration
                    }
                    if( !(col.classList.contains("already_added")) ){//se non è gia stato aggiunto
                        col.classList.add("already_added");
                        currentFavourites.push(objFavourite);//salvo il preferito(TO DO:CHIEDERE A GIAN o VALERIO COME METTERE NELLA LOCAL MEMORY)
                        for (let i = 0; i < numOfFavouritePunct.length; i++) {
                            numOfFavouritePunct[i].textContent = `${currentFavourites.length}`;
                        }
                    }

                })
        }

        container.appendChild(col);

    });
}
//----gestione dei preferiti----//
function startHover(event) {
    const button = event.currentTarget.firstElementChild.firstElementChild;
    button.classList.remove("d-none");
}

function endHover(event) {
    const button = event.currentTarget.firstElementChild.firstElementChild;
    button.classList.add("d-none");
}

//FUNZIONE DI PROVA
function goPaginaArtista(idArtistaFornitoci) {
    creaPaginaArtista(idArtistaFornitoci);
    changePage(PAGES, RIGHT)
}

//FUNZIONE CHE GENERA LA PAGINA ARTISTA
async function fetchArtista(idArtista) {

    //ESEGUO IL TRY..CATCH
    try {
    //Eseguo il fetch
    const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${idArtista}/top?limit=50`);

    const canzoniArtista = await response.json()

    return canzoniArtista
    } catch (error) {
        //NAL CASO DI ERRORE LO SEGNALO
        console.error("Errore:", error)
    }
}

//FUNZIONE PER CONVERTIRE I SECONDI IN MINUTI E SECONDI
function convertSecondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60); // Otteniamo il numero intero di minuti
    let remainingSeconds = seconds % 60; // Otteniamo i secondi rimanenti

    if (remainingSeconds < 10) {
        remainingSeconds = `0${remainingSeconds}`
    }

    return `${minutes} : ${remainingSeconds}`;
}

//FUNZIONE PER CREARE/MODIFICARE LA PAGINA ARTISTA
function creaPaginaArtista(idArtistaFornitoci) {
    fetchArtista(idArtistaFornitoci).then((canzoniArtista) => {
        console.log(canzoniArtista);
        paginaArtista.innerHTML = '';
        paginaArtista.innerHTML = `
        <!-- JUMBOTRON-->
        <div class="container-fluid py-5 custom-jumbotron mt-2" style="background-image: url('${canzoniArtista.data[0].album.cover_xl}');">
          <div class="d-flex align-items-center ms-3 mt-5">
            <i class="bi bi-patch-check-fill icon-blue"></i>
            <p class="fs-4 mb-0 ms-2">Artista Verificato</p>
          </div>
          <h1 class="display-2 fw-bold ms-2">${canzoniArtista.data[0].artist.name}</h1>
          <p class="fs-6 mb-0 ms-2">3.35342 Ascolti Mensili</p>
        </div>

        <!-- MAIN -->
        <div class="d-flex gap-3 align-items-center ms-3">
          <i class="bi bi-play-circle-fill icon-play"></i>
          <button type="button" class="btn btn-outline-light">FOLLOWING</button>
          <i class="bi bi-three-dots icon-dots"></i>
        </div>
        <h3 class="ms-3 mt-4 ">
            Popolari
        </h3>
        <ul id="listaCanznoniArtista" class="d-flext flex-column flex-md-row align-items-center mt-5 ms-3">
            <li class="container-fluid">
                <div class="row mb-3">
                    <div class="fs-5 col-1">1</div>
                    <div class="col-1">
                        <img src="${canzoniArtista.data[0].album.cover_small}" alt="copertina album">
                    </div>
                    <div class="col-4">
                        ${canzoniArtista.data[0].title}
                    </div>
                    <div class=" col-4 col-lg-5">
                        ${canzoniArtista.data[0].rank}
                    </div>
                    <div class="col-2 col-lg-1">
                        ${convertSecondsToMinutes(canzoniArtista.data[0].duration)}
                    </div>
                </div>
            </li>
            <li class="container-fluid">
                <div class="row mb-3">
                    <div class="fs-5 col-1">2</div>
                    <div class="col-1">
                        <img src="${canzoniArtista.data[1].album.cover_small}" alt="copertina album">
                    </div>
                    <div class="col-4">
                        ${canzoniArtista.data[1].title}
                    </div>
                    <div class=" col-4 col-lg-5">
                        ${canzoniArtista.data[1].rank}
                    </div>
                    <div class="col-2 col-lg-1">
                        ${convertSecondsToMinutes(canzoniArtista.data[1].duration)}
                    </div>
                </div>
            </li>
            <li class="container-fluid">
                <div class="row mb-3">
                    <div class="fs-5 col-1">3</div>
                    <div class="col-1">
                        <img src="${canzoniArtista.data[2].album.cover_small}" alt="copertina album">
                    </div>
                    <div class="col-4">
                        ${canzoniArtista.data[2].title}
                    </div>
                    <div class=" col-4 col-lg-5">
                        ${canzoniArtista.data[2].rank}
                    </div>
                    <div class="col-2 col-lg-1">
                        ${convertSecondsToMinutes(canzoniArtista.data[2].duration)}
                    </div>
                </div>
            </li>
            <li class="container-fluid">
                <div class="row mb-3">
                    <div class="fs-5 col-1">4</div>
                    <div class="col-1">
                        <img src="${canzoniArtista.data[3].album.cover_small}" alt="copertina album">
                    </div>
                    <div class="col-4">
                        ${canzoniArtista.data[3].title}
                    </div>
                    <div class=" col-4 col-lg-5">
                        ${canzoniArtista.data[3].rank}
                    </div>
                    <div class="col-2 col-lg-1">
                        ${convertSecondsToMinutes(canzoniArtista.data[3].duration)}
                    </div>
                </div>
            </li>
            <li class="container-fluid">
                <div class="row mb-3">
                    <div class="fs-5 col-1">5</div>
                    <div class="col-1">
                        <img src="${canzoniArtista.data[4].album.cover_small}" alt="copertina album">
                    </div>
                    <div class="col-4">
                        ${canzoniArtista.data[4].title}
                    </div>
                    <div class=" col-4 col-lg-5">
                        ${canzoniArtista.data[4].rank}
                    </div>
                    <div class="col-2 col-lg-1">
                        ${convertSecondsToMinutes(canzoniArtista.data[4].duration)}
                    </div>
                </div>
            </li>
        </ul>
        <button class="fw-bold fs-5 ms-3 btn text-white " id="visualizzaAltro">
        VISUALIZZA ALTRO
        </button>
        `
        const visualizzaAltro = document.getElementById("visualizzaAltro");//BOTTONE PER VISUALIZZARE ALTRE CANZONI DELL'ARTISTA
        const listaCanznoniArtista = document.getElementById("listaCanznoniArtista");//LISTA CANZONI DELLA PAGINA ARTISTA

        //CREO LA FUNZIONE PER VISUALIZZARE ALTRO AL CLICK DEL BOTTONE
        visualizzaAltro.addEventListener("click", function visualiizzaAltroFunzione() {
            if (visualizzaAltro.classList.contains("visualizzato")) {
                visualizzaAltro.textContent = "VISUALIZZA ALTRO";
                visualizzaAltro.classList.remove("visualizzato")
                for (let i = 5; i < canzoniArtista.data.length; i++) {
                    listaCanznoniArtista.removeChild(listaCanznoniArtista.lastChild)
                }
            } else {
                for (let i = 5; i < canzoniArtista.data.length; i++) {
                    const li = document.createElement("li");
                    li.classList.add("container-fluid" , "mb-3");
                    li.innerHTML =
                    `
                    <div class="row">
                        <div class="fs-5 col-1">${i+1}</div>
                        <div class="col-1">
                            <img src="${canzoniArtista.data[i].album.cover_small}" alt="copertina album">
                        </div>
                        <div class="col-4 prova">
                            ${canzoniArtista.data[i].title}
                        </div>
                        <div class=" col-4 col-lg-5">
                            ${canzoniArtista.data[i].rank}
                        </div>
                        <div class="col-2 col-lg-1">
                            ${convertSecondsToMinutes(canzoniArtista.data[i].duration)}
                        </div>
                    </div>
                    `;
                    listaCanznoniArtista.appendChild(li);
                }
                visualizzaAltro.classList.add("visualizzato")
                visualizzaAltro.textContent = "RIDUCI";
            }
        })
    }) 
}

////////////////////////////////EVENT LISTENERS///////////////////////////////////
BUTTON_LEFT.addEventListener("click",function(){  changePage(PAGES, LEFT); } );//bottone sx
BUTTON_RIGHT.addEventListener("click",function(){ changePage(PAGES, RIGHT); } );//bottone destro
Array.from(toFavourite).forEach(puntatore => {
    puntatore.addEventListener("click",function(){  changePage(PAGES, TO_FAVOURITE); } )//bottoni "alla pag preferiti"
});
BUTTON_HOME.addEventListener("click", function(){
    if(onFavourite){
        changePage(PAGES, TO_FAVOURITE);
    }else{
        currentpage = 1;
        changePage(PAGES, LEFT);
    }
})
//EVENTI PER FAR APPARIRE E SCOMPARIRE LA SIDEBAR DI DESTRA
rightSidebarOpener.addEventListener("click", function openRightSidebar() {
    rightSidebar.classList.remove("d-none")
    rightSidebarOpener.classList.add("d-none")
    customJumbotron.style.width="67vw"
})

rightSidebarCloser.addEventListener("click", function openRightSidebar() {
    rightSidebar.classList.add("d-none")
    rightSidebarOpener.classList.remove("d-none")
    customJumbotron.style.width="80vw"
})

//AGGIUNGO UN EVENTO AL CARICAMENTO DELLA PAGINA
document.addEventListener("DOMContentLoaded", function caricamento() {
    fetchAlbum("queen").then(risultati => {
        createCards(risultati, queenContainer, true)
    })
    fetchAlbum("sum41").then(risultati => {
        createCards(risultati, sum41Container, true)
    })

    //CARICO LE PLAYLIST SALVATE NEL LOCAL STORAGE
    sidebarPlaylistList.innerHTML =
    `
    ${localStorage.getItem("sidebarPlaylistList")}
    `
})

//AGGIUNGO UN EVENTO PER CRARE LE PLAYLIST DA METTERE A SINISTRA
createPlaylistForm.addEventListener("submit", function creaPlaylist(e) {
    //EVITO L'EVENETO DI DEFAULT, QUINDI CHE SI RICARICHI LA PAGINA
    e.preventDefault();

    //CREO LA PLAYLIST COME ELEMENTO E GLI DO IL CONTENUTO E LO AGGIUNGO ALLA LISTA
    const li = document.createElement("li");
    li.innerText = nameCreatePlaylist.value ;
    sidebarPlaylistList.appendChild(li)
    console.log(sidebarPlaylistList.innerHTML);
    //SALVO LA PLAYLIST ALLA LOCALSTORAGE PER SIMULARE CHE L'HO SALVATO
    localStorage.setItem("sidebarPlaylistList", `${sidebarPlaylistList.innerHTML}`)

    nameCreatePlaylist.value = '';
})

 //CREAIAMO LA VARIABILE DEL JUMBOTRON ARTISTA
 const customJumbotron=document.querySelector(".custom-jumbotron")
