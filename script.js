//////////////////COSTANTI E VARIABILI GLOBALI///////////////////////////////////
const RIGHT = -2000; const LEFT = -1000;
const BUTTON_LEFT = document.getElementById("TEST").firstElementChild;//BOTTONE INDIETRO
const BUTTON_RIGHT = document.getElementById("TEST").lastElementChild;//BOTTONE AVANTI
const PAGES = document.querySelectorAll(".page")//ARRAY CONTENENTE I PUNTATORI A TUTTE LE PAGINE
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

////////////////////////////////EVENT LISTENERS///////////////////////////////////
BUTTON_LEFT.addEventListener("click",function(){  changePage(PAGES, LEFT); } );//bottone sx
BUTTON_RIGHT.addEventListener("click",function(){ changePage(PAGES, RIGHT); } );//bottone destro