// JavaScript

// Globala variabler
var wordList; //Array med ett antal ord, där man sedan väljer ett slumpmässigt
var selectedWord; //Det ord som valt slumpmässigt och som användaren ska gissa på
var letterBoxes; //Array med referenser till de span-taggar som utgör rutor för bokstäverna i ordet
var hangmanImg; //Referens till img-elementet med bilden för galgen och gubben
var hangmanImgNr; //Nummer för aktuell bild (0-6), för den bildfil som visas(så man sedan kan veta vilket som blir nästa bild)
var msgElem; //Referens till div-elementet för meddelanden

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
	var i; //loopvariabel
	var startGameBtn; // referens till startknappen
	var letterButtons; // array med referenser till bokstavsknapparna

	wordList = ["BLOMMA","LASTBIL","SOPTUNNA","KÖKSBORD","RADIOAPPARAT","VINTER","SOMMAR","DATORMUS","LEJON","ELEFANTÖRA","JULTOMTE",
				"SKOGSHYDDA","BILNUMMER","BLYERTSPENNA","SUDDGUMMI","KLÄDSKÅP","VEDSPIS","LJUSSTAKE","SKRIVBORD","ELDGAFFEL","STEKPANNA",
				"KASTRULL","KAFFEBRYGGARE","TALLRIK","SOFFBORD","TRASMATTA","FLYGPLAN","FLYGPLATS","TANGENTBORD"];
	startGameBtn = document.getElementById("startGameBtn"); // referens till startknappen
	startGameBtn.onclick = function() {startGame()};

	letterButtons = document.getElementById("letterButtons").getElementsByTagName("button"); // tar fram en array med referenser till alla knappar i div-elementet "letterButtons"
	for (i=0; i<letterButtons.length; i++) letterButtons[i].onclick = guessLetter; //går genom alla bokstavsknapparna när guessLetter anropas

	hangmanImg = document.getElementById("hangman"); // referens till bilden
	msgElem = document.getElementById("message"); // referens till meddelandet
		


} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad



//Initiera ett nytt spel. Välj ord, visa bokstavsrutor,
//visa första vilden (tom bild) och sätt bildnummer till 0.
function startGame(){
randomWord();
showLetterBoxes();
hangmanImg.src = "pics/h0.png";
hangmanImgNr = 0;
} // End of startGame




function randomWord(){
	var wordIndex;
	wordIndex = Math.floor(Math.random()* wordList.length); // Tar fram ett slumptal mellan 0 och antal ord i en lista av ord
	selectedWord = wordList[wordIndex]; //Indexerar listan med sluptalet och spara valt ord i en global variabel
	alert(selectedWord);
} // End of randomWord



//Lägg in koden i elementet med id "letterboxes"
function showLetterBoxes(){
var newCode; //textsträng med html koden för bokstavsrutorna
var i; // loop variabel
newCode = "";
for(i=0; i<selectedWord.length; i++){ // Går igenom valt ord och skapa en kod med ett span-element för varje bokstav
	newCode += "<span> &nbsp; </span>"; // nonbreakable space för att css koden ska funka och en tom ruta visas
}
letterBoxes = document.getElementById("letterBoxes"); //referensern till bokstavsboxarna
letterBoxes.innerHTML = newCode; //lägger in den nya koden aka bokstavsboxarna i html-koden
letterBoxes = document.getElementById("letterBoxes").getElementsByTagName("span"); //en array med alla bokstavsboxarna
//RÄTT????
} // End of showLetterBoxes



// Anropas då man klickar på en bokstavsknapp. Avläser vald bokstav ur button-elements value-attribut.
//Går igenom alla bokstäver i ordet och kontrollerar om vald bokstav finns(kan finnas många gånger: isf skrivs den i motsvarande ruta).
//Om bokstaven ej finns, byts bilden till nästa bild. Om man då visar den sista vilden (h6.png), avslutas spelet med hängd gubbe
//Annars kontrolleras om alla bokstäver är klara.
function guessLetter(){ 
	var letter; // Bokstaven för knappen
	var i; //loopvariabel
	var letterFound; //Används som en flagga (true/false), för att avgöra om man hittar bokstaven i ordet
	var correctLettersCount; //En räknare, för att se hur många korrekta bokstäver som hittats

	letter = this.value; //Läser av knappens bokstav ur button-elementet
	letterFound = false;
	

	for(i=0; i < selectedWord.length; i++){  // Lägger in bokstaven om den finns i dess ruta
		if(letter == selectedWord.charAt(i)){
			letterBoxes[i].innerHTML = letter;
			letterFound = true;
		}
	}
	correctLettersCount = 0; 
	for(i=0; i< selectedWord.length ;i++){  //Räknar ut antalet boxar som inte är tomma
		if( letterBoxes[i].innerHTML != "&nbsp;"){
			correctLettersCount++;
		}
	}
	
	if(letterFound == false){ //om bokstaven hittades ej byts bilden ut
		hangmanImgNr++;
		hangmanImg.src= "pics/h" + hangmanImgNr +".png";
		if(hangmanImgNr == 6){ //När sista bilden visas så anropas funktionen endGame
			endGame(true);
		}
	}
	else if (correctLettersCount == selectedWord.length){ //Om alla boxar är fyllda
			endGame(false);
			
	}
} // End of guessLetter


// Patameter för att veta gys spelet slutade. Om gubben blev hängd, skrivs ett meddelenade med rätta ordet.
// Annars skrivs ett meddelande med en gratulation.
function endGame(manHanged){

	if(manHanged = true){
		msgElem.innerHTML = "Gubben hängdes. Det rätta ordet är " + selectedWord;
	}
	else{
		msgElem.innerHTML = "Grattis! Du klarade av hela ordet!";
	}


} // End of endGame