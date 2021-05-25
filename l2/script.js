// JavaScript

// Globala variabler
var inputElem, msgElem; //inmatning, meddelande
var fruitNames, fruitNr; //fruktnamn, fruktnummer
var selFruitsElem; //läggar till bilder med

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt koppling avfunktioner till knapparna.
function init() {
    inputElem = []; // Array med referenser till tre textfälten i html
    inputElem[1] = document.getElementById("input1");
    inputElem[2] = document.getElementById("input2");
    inputElem[3] = document.getElementById("input3");

    msgElem = document.getElementById("message"); //referens till div-elementet message

    document.getElementById("btn1").onclick = showFruit;  // Referens och action till knappen.

    fruitNames = ["ingen frukt", "äpple", "banan", "citron", "apelsin", "päron"]; //Array med alla fruktnamn
    fruitNr = 0;  //Börjar med ingen frukt

    document.getElementById("btn2").onclick = checkName;

    selFruitsElem = document.getElementById("selectedFruits");

    document.getElementById("btn3").onclick = addFruits;
    

} // End init

window.onload = init; // Se till att init aktiveras då sidan är inladdad


//Funktionen hämtar siffran frün textrutan och visar upp en motsvarande bild.
function showFruit(){ 
   // Lokala variabler
    var nr, fruitUrl; //bildnummer, bildens URL
    
    nr = getNr(1,5);

    if(nr !=null ){
       
        fruitUrl = "pics/fruit" + nr + ".jpg"; //referens till bildfil
        document.getElementById("fruitImg").src = fruitUrl; //byter ut bilden
    
        fruitNr = nr; //tar med bildnummer i en global variabel 
    }

}

function checkName(){ //functionen som kontrollerar namnet
    var name; //inmatningen
    if(fruitNr == 0){
        msgElem.innerHTML = "Välj en frukt först!";
        return;
    }
    name = inputElem[2].value; // Hämtar textreferensen i det andra textfältet

    if (name == fruitNames[fruitNr]){ // om den inmatade texten är rätt
        msgElem.innerHTML = "Rätt namn!";
    }
    else { //om texten inte är rätt
        msgElem.innerHTML = "Fel namn!";
    }
   
}

function getNr(elemNr, high){ //Funktion för att läsa in ett tal från ett textfält
    var nr;
    nr = Number(inputElem[elemNr].value); // Hämtar siffran från referensen
    if(isNaN(nr)){  // Kontrollerar att inmatningen består av tal, annars kommer en felmeddelande
        msgElem.innerHTML = "Du måste skriva ett tal med siffror.";
        return null;
    }
    if(nr < 1 || nr > high ){ // Kontrollerar att inmatade siffran är mellan 1 och 5, annars kommer en felmeddelande
        msgElem.innerHTML = "Du måste skriva ett tal med siffror.";
        return null;
    }
    nr = parseInt(nr); // Konverterar eventuella decimaltal till heltal
    inputElem[elemNr].value = nr; // ersätter decimaltalen med heltalet
    return nr;
}

function addFruits (){
    var amount, imgList; //inmatade tal, textsträng med html kod
    if(fruitNr!=0){
        amount = getNr(3,9);


        if( amount != null){
            imgList = "";
            for (i=0; i<amount; i++){
                imgList += "<img src='pics/fruit"+ fruitNr +".jpg' alt='frukt'>";
            }
            selFruitsElem.innerHTML += imgList;
        }
    }
    else{
        return;
    }
}