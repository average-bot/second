// JavaScript
// Globala variabler
var newGameBtn; //Referens till knappen "nytt spel"
var newBricksBtn; // Referens till knappen "nya brickor"
var picNr; // Array med alla bildernummer
var newBricks; //Referens till tomma rutorna i control
var dropBoxes; // Referens till alla tomma dropfälten i board
var dragPicElem; // Används till att sedan ta bort bilden som drogs
var msgElem; // Referens till meddelandefältet
var countDrops; // Räknare för antal drop
var points; // En räknare för antal poäng användaren fick
var cmark = [];// Array med referenser till alla markeringar för kolumner
var rmark = [];// Array med referenser till alla markeringar för rader
var totPointsElem; // Till att räkna ut totalpoängen
var countGamesElem; // Till att räkna ur hur många gånger användaren har spelat

// Initiera globala variabler och koppla funktion till knapp
// Knappen "Nytt spel" aktiveras. Knappen "Nya brickor" inaktiveras.
// Total poäng och antal spel hämtas och skrivas ut från cookien.
function init(){
    var i;	// Loopvariabel
    var cookieArray; // Till att dela upp cookien
    var cookieValue; // Till att hämta cookien
    
    // Referens till element i HTML-kod
    // Knapparna
    newGameBtn = document.getElementById("newGameBtn");
    newBricksBtn = document.getElementById("newBricksBtn");

    board = document.getElementById("board");
    newBricks = document.getElementById("newBricks").getElementsByTagName("img");
    dropBoxes = board.getElementsByTagName("img");
    
    // Message element
    msgElem = document.getElementById("message");

    // Markeringar
    for(i=0; i<4; i++){ 
        rmark[i] = document.getElementById("r"+(i+1)+"mark");
        cmark[i] = document.getElementById("c"+(i+1)+"mark");
    }

    // UserInfo
    totPointsElem = document.getElementById("totPoints");
    countGamesElem = document.getElementById("countGames");

    // Uppdaterar userinfo med uppgifter från cookien
    cookieValue = getCookie("sk223quUserInfo"); //Hämtar cookien 
    
    if(cookieValue != null){
        cookieArray = cookieValue.split("#"); //Delar upp cookien mha STAKETTECKEN
        totPointsElem.innerHTML = cookieArray[0];
        countGamesElem.innerHTML = cookieArray[1];
    }

    // Lägger på händelsehanterare
    addListener(newGameBtn, "click", startGame);
    addListener(newBricksBtn, "click", showNewBricks);
    
    // Aktiverar/inaktiverar knappar
    newGameBtn.disabled = false;
    newBricksBtn.disabled = true;
}
addListener(window,"load",init);

// Körs när användaren vill starta ett nytt spel och trycker på knappen "Nytt spel"
// Knappen "Nya brickor" aktiveras. Knappen "Nytt spel" inaktiveras.
// Gammal data om förra spelet tas bort
function startGame(){
    var i; // Loopvariabel
    // Nollställer variabler, tar bort meddelanden och markeringar...
    countDrops = 0;
    points = 0;
    // Array med alla bildnummer
    picNr = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"];
    msgElem.innerHTML = "";
    for(i=0;i<4; i++){
            rmark[i].innerHTML = "";
            cmark[i].innerHTML = "";
    }
    for(i=0; i<dropBoxes.length; i++){
        dropBoxes[i].src= "pics/empty.png";
        dropBoxes[i].id =""; 
        dropBoxes[i].style.backgroundColor = "";
        dropBoxes[i].classList.add("brickEmpty");
        dropBoxes[i].classList.remove("brickFront"); 
    } 

    //Aktiverar/inaktiverar knappar
    newGameBtn.disabled = true;
    newBricksBtn.disabled = false;
}

// Körs då användaren trycker på knappen "newBricksBtn" och då det INTE finns några brickor kvar i boxarna. 
// Lägger till 4 nya slumpmässiga brickor som inte har används tidigare i samma spel och tar bort dem från arrayn.
// Brickorna ska kunna dras och placeras. Knappen "nya brickor" inaktiveras.
function showNewBricks(){
    var i; // Loopvariabel
    var r; // Slumptal
    // Lägger till slumpmässiga tal till rutorna och tar sedan bort bildnumret med splice
    for(i=0; i<newBricks.length; i++){
        r = Math.floor(Math.random() * picNr.length);
        newBricks[i].src = "pics/" + picNr[r] + ".png";
        newBricks[i].id = picNr[r];
        picNr.splice(r,1);
    }

    // Byter classen brickEmpty till brickFront
    for(i=0; i<newBricks.length; i++){
        newBricks[i].classList.add("brickFront");
        newBricks[i].classList.remove("brickEmpty"); 
    }
    eventsForDrag(true);
    // Aktiverar/inaktiverar knappar
    newBricksBtn.disabled = true;
}

// Lägger till eller tar bort händelsehanterare på de element som ska kunna dras. (beror på parametern drag)
// samt händelsehanterare för element där man kan släppa orden.
// dragstart, dragover, drop
function eventsForDrag(drag){
    var i; // Loopvariabel
    if(drag == true){ // Om drag är true läggs det till händelsehanterare
        for(i=0; i<newBricks.length; i++){
            newBricks[i].draggable = true;
            addListener(newBricks[i], "dragstart", dragStarted);
        }

        for(i=0; i<dropBoxes.length; i++){ // lägger till händelsehanterare för dragover och drop för tom ruta
			addListener(dropBoxes[i], "dragover", dropZoneHandler);
            addListener(dropBoxes[i], "drop", dropZoneHandler);
            addListener(dropBoxes[i], "dragleave", dropZoneHandler);
		}
    }

    else{ //Annars tars de händelsehanterare bort
        for(i=0; i<newBricks.length; i++){
            newBricks[i].draggable = false;
            removeListener(newBricks[i], "dragstart", dragStarted); // Tar bort händelsehanterare för dragstart för bricka
        }

        for(i=0; i<dropBoxes.length; i++){ // Tar bort händelsehanterare för dragover och drop för tom ruta
			removeListener(dropBoxes[i], "dragover", dropZoneHandler);
            removeListener(dropBoxes[i], "drop", dropZoneHandler);
            removeListener(dropBoxes[i], "dragleave", dropZoneHandler);
        }
    }
}

// dragstart - När dragningen börjar så sparas bilden med (e.datatransfer) 
function dragStarted(e) { 
    var url; // Url för bilden som transporteras
    var number; // Id transporteras mha den
    if(this.classList.contains("brickFront")){
        // Sparar adressen till bilden, redo att transporteras
        url = this.src;
        e.dataTransfer.setData("text", url);
        // Sparar id till bilden, redo att transporteras
        number = this.id;
        e.dataTransfer.setData("number", number);
        // Sparar den gamla platsen för brickan i control
        dragPicElem = this;
    }
}

// Hanterar händelser för dragover, dragleave och drop
// Händelsen för dragover - När brickan är över en tom box ska bakgrundsfärgen för boxen ändras.
// Händelsen för dragleave - bakgrundsfärgen tas bort
// Händelsen för drop - brickan läggs i den tomma rutan, händelsehanterare för dropboxen tas bort
function dropZoneHandler(e){
    var url; // Url för bilden som transporteras
    var number; // Id transporteras mha den
    if(dragPicElem.classList.contains("brickFront")){ // Bara om elementet har klassen brickFront
        e.preventDefault();
        
        if(e.type =="dragover"){        // Dragover
            if(this.classList.contains("brickEmpty")){
                this.style.backgroundColor = "lightgreen"; 
            }
        }

        else if(e.type == "dragleave"){     // Dragleave
            if(this.classList.contains("brickEmpty")){
                this.style.backgroundColor = "";
            }
        }

        else if(e.type == "drop"){      // Drop
            if(this.classList.contains("brickEmpty")){ // Om brickan droppas på en tom ruta
                // Byter bilden till bilden med numret
                url = e.dataTransfer.getData("text");
                this.src = url;
                // Byter bildens id till id som innehåller nummret
                number = e.dataTransfer.getData("number");
                this.id = number;
                // Byter bakgrundsfärgen
                this.style.backgroundColor = "#FFF";
                // Byter ut klassen
                this.classList.remove("brickEmpty"); 
                this.classList.add("brickFront");
                // Tar bort händelsehanterare för fältet där brickan läggdes ned
                removeListener(this, "drop", dropZoneHandler);
                removeListener(this, "dragover", dropZoneHandler);
                removeListener(this, "dragleave", dropZoneHandler);
                // Tar bort händelsehanterare för brickans gamla ruta
                removeListener(dragPicElem, "dragstart", dragStarted);
                // Byter ut klassen för den placerade brickan
                dragPicElem.classList.remove("brickFront");
                dragPicElem.classList.add("brickEmpty");
                dragPicElem.src ="pics/empty.png";
                // Anropar funktionen till att kontrollera om fältet med nya brickor är tom
                checkIfEmpty();
            }
        }
    }
}

// Kontrollerar om boxarna i "control" är tomma
function checkIfEmpty(){
    countDrops++;
    for(i=1; i<newBricks.length; i++){
        if(countDrops/newBricks.length == i){
            // Aktiverar knappen för "nya brickor".
            newBricksBtn.disabled = false;
        }
    }
    if(countDrops==(dropBoxes.length)){
        endGame();
    }
}

// <-------------------------------SLUTET------------------------------------------->
// Körs när alla boxarna är fyllda. Kontrollerar svar. // Knappen "Nytt spel" aktiveras. Knappen "Nya brickor" inaktiveras.
function endGame(){
    eventsForDrag(false);
    checkAnswers();
    updateUserInfo();
    //Aktiverar/inaktiverar knappar
    newGameBtn.disabled = false;
    newBricksBtn.disabled = true;
}

// Kontrollerar svar. Visar vilka rader som blev rätt/fel. Skriver ut hur många rätt andvändaren fick. 
function checkAnswers(){
    var i; // Loopvariabler
    var r = []; // Referenser till alla rader i en array r
    var c = []; // Referenser till alla kolumner i en array c

    for(i=0; i<4; i++){ // Tar fram referenser till rader, kolumner och markeringar i form av arrays
        r[i] = board.getElementsByClassName("r"+ (i+1));
        c[i] = board.getElementsByClassName("c"+ (i+1));
    }

    for(i=0; i<r[0].length; i++){ // Hämtar alla radernas ids i form av arrays 
        r[0] = parseInt(r[0][i].id);
        r[1] = parseInt(r[1][i].id); 
        r[2] = parseInt(r[2][i].id);
        r[3] = parseInt(r[3][i].id); 
    }
    alert(r[0][0]);

    for(i=0; i<c[0].length; i++){ // Hämtar alla kolumnernas ids i form av arrays 
        c[0] = parseInt(c[0][i].id);
        c[1] = parseInt(c[1][i].id); 
        c[2] = parseInt(c[2][i].id);
        c[3] = parseInt(c[3][i].id); 
    }

    for(i=0; i<4; i++){ // Kontrollerar om id'n i alla rader är växande 
        if(r[i][0] < r[i][1] && r[i][1] < r[i][2] && r[i][2] < r[i][3]){   
            rmark[i].innerHTML= "&check;";
            rmark[i].style.color = "green";
            points++;
        }
        else{
            rmark[i].innerHTML= "&cross;";
            rmark[i].style.color = "red";
        }
    }

    for(i=0; i<4; i++){ // Kontrollerar om id'n i alla kolumner är växande 
        if(c[i][0] < c[i][1] && c[i][1] < c[i][2] && c[i][2] < c[i][3]){   
            cmark[i].innerHTML= "&check;";
            cmark[i].style.color = "green";
            points++;
        }
        else{
            cmark[i].innerHTML= "&cross;";
            cmark[i].style.color = "red";
        }
    }
    msgElem.innerHTML= "Du fick "+points+" poäng."; // Skriver ut antal poäng användaren fick
}

// Uppdaterar informationen i UserInfo.
// Varje gång man avslutar ett spel adderas 1 med antalet tidigare spel och totala poängen för alla spel adderas ihop.
// Denna data sparas i Cookies som hämtas nästa gång.
function updateUserInfo(){
    var totalPoints; // Antalet totala poäng för användaren
    var gamesCounter; // Antalet spel för användaren
    var cookieValue; // Hämta cookien, kolla om den är tom eller ej
    var cookieArray; // Array med cookiens värden
    
    cookieValue = getCookie("sk223quUserInfo"); // Hämtar cookien 
    if(cookieValue === null){ // (Om man spelar det första gången)Om det inte finns någon cookie sparad
        cookieValue = "0#0";
    }

    if(cookieValue != null){ // Om det finns något i cookien...
        cookieArray = cookieValue.split("#");

        totalPoints = Number(cookieArray[0]);
        totalPoints = totalPoints + points;
        totPointsElem.innerHTML = totalPoints;
        cookieArray[0] = totalPoints;

        gamesCounter = Number(cookieArray[1]);
        gamesCounter++;
        countGamesElem.innerHTML = gamesCounter;
        cookieArray[1] = gamesCounter;

        cookieValue = cookieArray.join("#");

        saveCookie("sk223quUserInfo",cookieValue); // Nya totalpoängen sparas i cookien
    }
}