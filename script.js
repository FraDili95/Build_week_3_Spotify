//////////////////COSTANTI E VARIABILI GLOBALI///////////////////////////////////
const rightSidebarOpener = document.getElementById("rightSidebarOpener");//PUNTINI CHE APRONO LA SIDEBAR DI DESTRA
const rightSidebarCloser = document.getElementById("rightSidebarCloser");//BOTTONE CHE CHIUDE LA SIDEBAR DI DESTRA
const rightSidebar = document.getElementById("rightSidebar");//COSTANTE PER LA SIDEBAR DI DESTRA
const RIGHT = -2000; const LEFT = -1000;
const BUTTON_LEFT = document.getElementById("left");//BOTTONE INDIETRO
const BUTTON_RIGHT =document.getElementById("right");//BOTTONE AVANTI
const PAGES = document.querySelectorAll(".page")//ARRAY CONTENENTE I PUNTATORI A TUTTE LE PAGINE
const albumsContainer = document.getElementById("albumsContainer")//
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

        console.log(risultati);

        return risultati
    } catch (error) {
        //NAL CASO DI ERRORE LO SEGNALO
        console.error("Errore:", error)
    }
}

// fetchAlbum("queen").then(risultati => {
//     risultati.data.forEach(risultato => {
//         console.log(risultato);
//         const col = document.createElement("div");
//         col.classList.add("col-3");

//         col.innerHTML =
//         `
//         <div class="card" style="width: 18rem;">
//         <img src="${risultato.album.cover}" class="card-img-top" alt="...">
//         <div class="card-body">
//             <h5 class="card-title">${risultato.album.title}</h5>
//             <p class="card-text">${risultato.artist.name}</p>
//             <a href="#" class="btn btn-primary">Go somewhere</a>
//         </div>
//         </div>
//         `
//         albumsContainer.appendChild(col);


//     });
// })

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