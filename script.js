//////////////////COSTANTI E VARIABILI GLOBALI///////////////////////////////////
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
const url = "http://striveschool-api.herokuapp.com/api/deezer/search?q=";
var currentpage = 0;//PAGINA CORRENTE(la imposto a 0 all'inizio che corrisponde alla prima pagina)
var currentFavourites = [];//array globale contenente i PREFERITI
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
            currentpage = 0;
            arrayPages[currentpage].classList.remove("d-none");
            document.getElementById("home").removeEventListener("click", changePage(arrayPages, TO_FAVOURITE))
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
        console.log(risultato.album.tracklist);
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
            <a class="card-text fw-bold">${risultato.artist.name}</a>
        </div>
        </div>
        `
        // Aggiungo gli event listener subito dopo aver creato la carta(SOLO SE SPECIFICATO DURANTE LA CHIAMATA)
        if( addButton ){
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
 

////////////////////////////////EVENT LISTENERS///////////////////////////////////
BUTTON_LEFT.addEventListener("click",function(){  changePage(PAGES, LEFT); } );//bottone sx
BUTTON_RIGHT.addEventListener("click",function(){ changePage(PAGES, RIGHT); } );//bottone destro
Array.from(toFavourite).forEach(puntatore => {
    puntatore.addEventListener("click",function(){  changePage(PAGES, TO_FAVOURITE); } )//bottoni "alla pag preferiti"
});
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

    //SALVO LA PLAYLIST ALLA LOCALSTORAGE PER SIMULARE CHE L'HO SALVATO
    localStorage.setItem("sidebarPlaylistList", `${sidebarPlaylistList.innerHTML}`)
    
    nameCreatePlaylist.value = '';
})

 //CREAIAMO LA VARIABILE DEL JUMBOTRON ARTISTA
 const customJumbotron=document.querySelector(".custom-jumbotron")
