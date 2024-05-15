//////////////////COSTANTI E VARIABILI GLOBALI///////////////////////////////////
const rightSidebarOpener = document.getElementById("rightSidebarOpener");//PUNTINI CHE APRONO LA SIDEBAR DI DESTRA
const rightSidebarCloser = document.getElementById("rightSidebarCloser");//BOTTONE CHE CHIUDE LA SIDEBAR DI DESTRA
const rightSidebar = document.getElementById("rightSidebar");//COSTANTE PER LA SIDEBAR DI DESTRA
const RIGHT = -2000; const LEFT = -1000;
const BUTTON_LEFT = document.getElementById("left");//BOTTONE INDIETRO
const BUTTON_RIGHT =document.getElementById("right");//BOTTONE AVANTI
const PAGES = document.querySelectorAll(".page")//ARRAY CONTENENTE I PUNTATORI A TUTTE LE PAGINE
const queenContainer = document.getElementById("queenContainer")//
const sum41Container = document.getElementById("sum41Container")//
const createPlaylist = document.getElementById("createPlaylist")//BOTTONE PER CREARE LA PLAYLIST
const sidebarPlaylistList = document.getElementById("sidebarPlaylistList")//CONTENITORE DELLE PLAYLIST
const createPlaylistForm = document.getElementById("createPlaylistForm")//FORM PER CREARE LE PLAYLIST
const nameCreatePlaylist = document.getElementById("nameCreatePlaylist")//input in cui si inserisce il nome della playlist che si vuole aggingere
const url = "http://striveschool-api.herokuapp.com/api/deezer/search?q=";
var currentpage = 0;//PAGINA CORRENTE(la imposto a 0 all'inizio che corrisponde alla prima pagina)
///////////////////////////////////////////////////////////////////////////////////

function changePage ( arrayPages, direction ){//PER FARLA FUNZIONARE SERVE SOLO AGGIUNGERE LA CLASSE page AD OGNI PAGINA(e gli eventi ai bottoni)

    // 1)nasconde pagina corrente 
    // 2)definisce il comportamento della funzione in base al valore di direction(impostato durante la chiamata)
    if( direction == LEFT && currentpage > 0 ){// se LEFT e non sono a pag 0, scorre indietro
        arrayPages[currentpage].classList.add("d-none");
        currentpage--;
    }else if( direction == RIGHT && currentpage < arrayPages.length-1 ){// se RIGHT e non sono a num max pag, scorre avanti
        arrayPages[currentpage].classList.add("d-none");
        currentpage++;
    }else{
        return false;
    }
    //---------------------------
    //3)riabilisco pagina successiva o precedente
    arrayPages[currentpage].classList.remove("d-none");
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
function createCards(risultati, container) {
    risultati.data.forEach(risultato => {
        console.log(risultato);
        console.log(risultato.album.tracklist);
        console.log(risultato.artist.tracklist);
        const col = document.createElement("div");
        col.classList.add("col-3");

        col.innerHTML =
        `
        <div class="card border-0" style="width: 18rem;">
        <img src="${risultato.album.cover}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title fw-bold text-white">${risultato.album.title}</h5>
            <p class="text-white fs-5">${risultato.title}</p>
            <a class="card-text fw-bold">${risultato.artist.name}</a>
        </div>
        </div>
        `
        container.appendChild(col)

    });
}

////////////////////////////////EVENT LISTENERS///////////////////////////////////
BUTTON_LEFT.addEventListener("click",function(){  changePage(PAGES, LEFT); } );//bottone sx
BUTTON_RIGHT.addEventListener("click",function(){ changePage(PAGES, RIGHT); } );//bottone destro

//EVENTI PER FAR APPARIRE E SCOMPARIRE LA SIDEBAR DI DESTRA
rightSidebarOpener.addEventListener("click", function openRightSidebar() {
    rightSidebar.classList.remove("d-none")
    rightSidebarOpener.classList.add("d-none")
})
  
rightSidebarCloser.addEventListener("click", function openRightSidebar() {
    rightSidebar.classList.add("d-none")
    rightSidebarOpener.classList.remove("d-none")
})

//AGGIUNGO UN EVENTO AL CARICAMENTO DELLA PAGINA
document.addEventListener("DOMContentLoaded", function caricamento() {
    fetchAlbum("queen").then(risultati => {
        createCards(risultati, queenContainer)
    })
    fetchAlbum("sum41").then(risultati => {
        createCards(risultati, sum41Container)
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

    //SALVO LA PLAYLIST ALLA LOCALSTORAGE PER SIMULARE CHE L'HO SALVATO
    localStorage.setItem("sidebarPlaylistList", `${sidebarPlaylistList.innerHTML}`)
    
    nameCreatePlaylist.value = '';
})