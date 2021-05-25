// JavaScript

// Globala variabler
// Ord och bilder
	var allPics;			// Array med alla ord
	var allDescription;		// Array med kort beskrivning av alla ord/bilder
	var picsIx4;			// Array med nummer (index till allPics) för de fyra bilder som ska visas
	var words8;				// Array med de åtta ord som ska finnas i listan (sorteras i bokstavsordning)
// Element i gränssnittet
	var startGameBtn;		// Referenser till start-knappen (button)
	var checkAnswersBtn;	// Referens till knappen för att kontrollera svar (button)
	var wordListElem;		// Referens till listan med de ord som kan dras (ul-elemntet)
	var	wordElems;			// Array med referenser till elementen för de åtta orden (li-elemnten)
	var picsElems;			// Array med referenser till elementen med de fyra bilderna (img)
	var userAnswerElems;	// Array med referenser till elementen för orden intill bilderna (span)
	var correctAnswerElems;	// Array med referenser till element för rätta svar (span)
	var largePictElem;		// Referens till elementet med den stora bilden (img)
	var msgElem; 			// Referens till div-element för utskrift av meddelanden (div)
// Element vid drag and drop
	var dragWordElem;		// Det ord som dras (kan vara både li och span)

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt händelsehanterare.
function init() {
	var i;	// Loopvariabel
	// Ord och bilder
		picsIx4 =[];
		words8 =[];
		allPics = ["Borgholm","Gränna","Gävle","Göteborg","Halmstad","Jönköping","Kalmar","Karlskrona","Kiruna","Ljungby","Malmö","Norrköping","Skara","Stockholm","Sundsvall","Umeå","Visby","Västervik","Växjö","Örebro"];
		allDescription = [" - Kyrkan"," - Storgatan"," - Julbock"," - Operan"," - Picassoparken"," - Sofiakyrkan"," - Domkyrkan"," - Rosenbom"," - Stadshus"," - Garvaren"," - Stortorget"," - Spårvagn"," - Domkyrka"," - Rosenbad"," - Hotell Knaust"," - Storgatan"," - Stadsmur"," - Hamnen"," - Teater"," - Svampen"];
	// Referenser till element i gränssnittet
	startGameBtn = document.getElementById("startGameBtn");
	checkAnswersBtn	= document.getElementById("checkAnswersBtn");
	wordListElem = document.getElementById("words").getElementsByTagName("ul")[0];
	wordElems = document.getElementById("words").getElementsByTagName("li");
	picsElems =  document.getElementById("pics").getElementsByTagName("img");
	userAnswerElems = document.getElementsByClassName("userAnswer");
	correctAnswerElems = document.getElementsByClassName("correctAnswer");
	largePictElem = document.getElementById("largePict");
	msgElem = document.getElementById("message");
	// Lägg på händelsehanterare
	addListener(startGameBtn, "click", startGame);
	addListener(checkAnswersBtn, "click", checkAnswers);
	for (i=0; i< picsElems.length; i++){
		addListener(picsElems[i], "mouseover", showLargePict);
		addListener(picsElems[i], "mouseout", hideLargePict);
	}
	// Aktivera/inaktivera knappar
	startGameBtn.disabled = false;
	checkAnswersBtn.disabled = true;
} // End init
addListener(window,"load",init); // Se till att init aktiveras då sidan är inladdad

// Initiera spelet. Välj ord slumpmässigt. Visa ord och bilder.
function startGame() {
	var i; // loopvariabel
	var r; // slumptal
	var tempList; // kopia av allPics

	tempList = allPics.slice(0); //kopierar arrayen allPics till tempList (från och med position 0)

	for (i=0; i<4; i++){  // tar fram 4 första orden, som också blir bilderna
		r = Math.floor(Math.random() * tempList.length); 
		words8[i] = tempList[r];
		picsIx4[i] = allPics.indexOf(tempList[r]);
		tempList.splice(r,1); // tar bort valda ordet ur tempList
	}
	for(i=4; i<8; i++){ // tar fram 4 yttligare ord
		r = Math.floor(Math.random() * tempList.length); 
		words8[i] = tempList[r];
		tempList.splice(r,1);
	}
	words8.sort(); // Ord sorteras i bokstavsordningen

	for(i=0; i<words8.length; i++){ // lägger in de 8 orden i li-elementen
		wordElems[i].innerHTML = words8[i];
	}

	for(i=0; i<picsIx4.length; i++){ //lägger in de 4 bilderna i img-taggarna
		picsElems[i].src = "pics/" + picsIx4[i]+ ".jpg";
		userAnswerElems[i].innerHTML = ""; //rensar för nytt spel
		correctAnswerElems[i].innerHTML = ""; //-ii-
	}
	eventsForDrag(true);
	startGameBtn.disabled = true;
	checkAnswersBtn.disabled = false;
} // End startGame

// Lägg på eller ta bort händelsehanterare på de element som ska kunna dras
// samt händelsehanterare för element där man kan släppa orden (drop).
function eventsForDrag(drag) {
	var i; //loopvariabel
	if(drag){ // lägger till händelsehanterare
		for(i=0; i<wordElems.length; i++){ // lägger till ordets händelsehanterare för dragstart
			wordElems[i].draggable = true;
			addListener(wordElems[i], "dragstart", dragStarted);
		}
		for(i=0;i<picsElems.length; i++){ // lägger till bildens händelsehanterare för dragover och drop
			addListener(picsElems[i], "dragover", wordOverPict);
			addListener(picsElems[i], "drop", wordOverPict);
		}
		for(i=0; i<userAnswerElems.length; i++){// lägger till användarsvarens händelsehanterare för dragstart
			userAnswerElems[i].draggable = true;
			addListener(userAnswerElems[i], "dragstart", dragStarted);
		}
		addListener(wordListElem, "dragover", wordOverList);
		addListener(wordListElem, "drop", wordOverList);
	}
	else{ // tar bort händelsehanterare
		for(i=0; i<wordElems.length; i++){ // tar bort ordets händelsehanterare för dragstart
			wordElems[i].draggable = false;
			removeListener(wordElems[i], "dragstart", dragStarted);
		}
		for(i=0;i<picsElems.length; i++){ // tar bort bildens händelsehanterare för dragover och drop
			removeListener(picsElems[i], "dragover", wordOverPict);
			removeListener(picsElems[i], "drop", wordOverPict);
		}
		for(i=0; i<userAnswerElems.length; i++){ // tar bort användarsvarens händelsehanterare för dragstart
			userAnswerElems.draggable = false;
			removeListener(userAnswerElems[i], "dragstart", dragStarted);
		}
		removeListener(wordListElem, "dragover", wordOverList);
		removeListener(wordListElem, "drop", wordOverList);
	}
} // End eventsForDrag

// Visa förstorad bild
function showLargePict() {
	largePictElem.src = this.src;

} // End showLargePict

// Dölj förstorad bild
function hideLargePict() {
	largePictElem.src = "pics/empty.png";
} // End hideLargePict

// Ett ord börjar dras.
function dragStarted(e) {
	e.dataTransfer.setData("text", this.innerHTML); //sparar referensen till elementet som ska dras
	dragWordElem = this;
} // End dragStarted

// Hantera händelserna dragover och drop, då ett ord släpps över en bild
// Endast drop används i detta exempel
function wordOverPict(e) {
	var i; //id
	e.preventDefault(); //förhindrar webbläsarens default-händelser
	if(e.type == "drop"){
		dragWordElem.innerHTML = "";// tar bort ordet ur listan
		i = this.id; //referens till den img-tagg där ordet släppts
		if(userAnswerElems[i].innerHTML != ""){ 
			moveBackToList(userAnswerElems[i].innerHTML);
		}
		userAnswerElems[i].innerHTML = e.dataTransfer.getData("text"); //Ordet som sparades skrivs nu ut
	}
} // End wordOverPict

// Hantera händelserna dragover och drop, då ett ord släpps över listan med ord
// Endast drop används i detta exempel
function wordOverList(e) {
	e.preventDefault();
	if(e.type == "drop"){
		dragWordElem.innerHTML = "";
		moveBackToList(e.dataTransfer.getData("text"));
	}
} // End wordOverList

// Flytta tillbaks ordet i "word" till listan
function moveBackToList(word) { 
	var i; //index
	i = words8.indexOf(word);
	wordElems[i].innerHTML = words8[i];
} // End moveBackToList

// Kontrollera användarens svar och visa de korrekta svaren
function checkAnswers() {
	var i; // loopvariabel
	var points; // poäng till antal rätt
	for(i=0; i<userAnswerElems.length; i++){ // Kontrollerar användarens svar
		if(userAnswerElems[i].innerHTML == ""){
			alert("Dra först ord till alla bilder!");	
			return;
		}	
	}
	eventsForDrag(false);
	points = 0;
	for(i=0; i<userAnswerElems.length; i++){// Visar de korrekta svaren
		if(userAnswerElems[i].innerHTML == allPics[picsIx4[i]]) points ++;
		correctAnswerElems[i].innerHTML = allPics[picsIx4[i]] + "<br>" + allDescription[picsIx4[i]];
	}
	msgElem.innerHTML = points;
	startGameBtn.disabled = false;
	checkAnswersBtn.disabled = true;
} // End checkAnswers