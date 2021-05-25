// JavaScript Document

// Globala variabler
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
var re;				// Reguljära uttryck för post och telefonnummer
var errMsg;			// Felmeddelanden
// Initiera globala variabler och koppla funktion till knapp
function init() {	
	var i;		// Loopvariabel
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost");
	
	for(i=0; i<formElem.roomType.length; i++){
		addListener(formElem.roomType[i], "click", checkIfFamilyRoom);
		addListener(formElem.roomType[i], "click", calculateCost);
	}
	for(i=0; i<formElem.addition.length; i++){
		addListener(formElem.addition[i], "click", calculateCost);
	}
	addListener(formElem.nights, "change", calculateCost);
	addListener(formElem.city, "blur", checkCity);

	addListener(formElem.zipcode, "blur", checkZipcode);
	addListener(formElem.telephone, "blur", checkTelephone);

	addListener(formElem.campaigncode, "focus", startCheckCampaign);
	addListener(formElem.campaigncode, "keyup", checkCampaign);
	addListener(formElem.campaigncode, "blur", endCheckCampaign);

	re = [
		/^\d{3} ?\d{2}$/,						// Postnummer
		/^0\d{1,3}[-/ ]?\d{5,8}$/				// Telefonnummer
	];
	errMsg = [
		"Postnumret måste bestå av fem siffror.",
		"Telnr måste börja med en 0:a och sedan 6-11 siffror."
	];

	checkIfFamilyRoom();
	calculateCost();

} // End of init
addListener(window,"load",init);


//Om familjrum är vald inaktiveras sjöutsikt och aktiveras antal personer. Om familjerum är inte vald inaktiveras antal personer och aktivera sjöutsikt.
function checkIfFamilyRoom(){
	if(formElem.roomType[2].checked == true){
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000";
		formElem.addition[2].disabled = true; //
		formElem.addition[2].parentNode.style.color = "#999"; //
	}
	else{
		formElem.persons.disabled = true;
		formElem.persons.parentNode.style.color = "#999";
		formElem.addition[2].disabled = false; //
		formElem.addition[2].parentNode.style.color = "#000"; //
	}
} // End of checkIfFamilyRoom

//Beräknar totala kostnader
function calculateCost(){
	var i; //loopvariabel
	var elemValue; //hämta value attributet
	var roomPrice; //pris för rummet
	var nightsIndex; //index till valda alternativet
	var nrOfNights; //antal nätter

	for(i=0; i<formElem.roomType.length; i++){ //hämtar rummets kostnad
		if(formElem.roomType[i].checked == true){
			elemValue = formElem.roomType[i].value;
			roomPrice = Number(elemValue.split(",")[1]);
			break;
		}
	}
	for(i=0; i<formElem.addition.length; i++){ //räknar ut tillägg
		if(formElem.addition[i].checked == true && !formElem.addition[i].disabled == true){
			elemValue = formElem.addition[i].value;
			roomPrice += Number (elemValue.split(",")[1]);
		}
	}
	nightsIndex = formElem.nights.selectedIndex; //räknar ut det totala priset (rumpris och tilllägg gånger antal nätter)
	nrOfNights = Number(formElem.nights.options[nightsIndex].value);
	totalCostElem.innerHTML = nrOfNights * roomPrice;
} // End of calculateCost

//Bokstäverna konverteras till versaler efter man lämnar fältet
function checkCity(){
	var city;//hämtar ort och konverterar till versaler
	city = formElem.city.value;
	city = city.toUpperCase();
	formElem.city.value = city; 
} //End of checkCity

// Kontrollera innehållet i theField. index används till reguljärt uttryck och felmeddelande.
function checkField(theField,index) {
	var errMsgElem; // Referens till andra span-elementet
	errMsgElem = theField.parentNode.parentNode.getElementsByTagName("span")[1];
	errMsgElem.innerHTML = "";
	if (!re[index].test(theField.value)) {
		errMsgElem.innerHTML = errMsg[index];
		return false;
	}
	else return true;
} // End of checkField

//Kontrollerar postnummer
function checkZipcode(){
	checkField(formElem.zipcode, 0);
} //End of checkZipCode

//Kontrollerar telefonnummer
function checkTelephone(){
	checkField(formElem.telephone, 1);
} //End of checkTelephone

//När man trycker på textrutan...
function startCheckCampaign(){
	this.style.backgroundColor = "#F99"; //bakgrundsfärgen blir röd
	this.select(); // hela innehållet markeras då man klickar i fältet
} //End of startCheckCampaign

//När man kommer ut från rutan..
function endCheckCampaign(){
	var code; // kampanjkoden
	this.style.backgroundColor = ""; //tidigare bakgrundsfärgen tas bort
	code = formElem.campaigncode.value;
	code = code.toUpperCase(); // kampanjkoden konverteras till versaler
	formElem.campaigncode.value = code; 
} //End of endCheckCampaign

// Anropas vid varje ny tecken i textrutan och kontrollerar den inmatade texten mot det reguljära uttrycket
function checkCampaign(){
	var re; // ett reguljärt uttryck för kampanjkoden
	re =/^\w{3}-\d{2}-\w\d$/i;

	if(re.test(this.value)){
		this.style.backgroundColor = "#6F9";
	}
	else{
		this.style.backgroundColor = "#F99";
	}
} // End of checkCampaign