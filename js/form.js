// GLOBAL VARIABLE INITIALIZATION
var http;
var isWorking;
var data;
var form;
var element;
var clearStoredData;

// *****************************************************************************
// Constructor function
// *****************************************************************************
function init() {
	// Assigns global HTTP object
	http = getHTTPObject();

	// Assigns global flag to pause HTTP requests
	isWorking = false;

	// Creates initial form element & sets attributes
	form = document.createElement('form');
	form.setAttribute('action', '#');
	form.setAttribute('method', 'get');
	form.setAttribute('id', 'mainForm');

	// Assigns global data element as device
	element = "device";

	// Assigns global boolean trigger to clear stored data
	clearStoredData = false;

	// Function call to load the data
	loadData();
 }


// *****************************************************************************
// Constructor function
// *****************************************************************************
function handleHttpResponse() {
	// Check HTTP ready state, to verify transfer is complete
	if (http.readyState == 4) {
		// Check status code of HTTP - verify OK
		if (http.status==200) {

			// Detects IE7 for non-native JSON parsing (in this case, function name is the same as native)
			if (ie7) {
				// Parses JSON data - assigns to global data variable
				data = JSON.parse(http.responseText);
			} else {
				// Parses JSON data - assigns to global data variable
				data = JSON.parse(http.responseText);
			}

			// Function call to create the select options
			// input = null; element = temporary prompt; form = primary form
			dataDriver(null, element, form, clearStoredData);

			isWorking = false;
		}
	}
}


// *****************************************************************************
// Function to create a XMLHttpRequest object
// *****************************************************************************
function getHTTPObject() {
	var xmlhttp;

	// branch for native XMLHttpRequest object
	if (window.XMLHttpRequest) {
  		xmlhttp=new XMLHttpRequest()
  	}

	// branch for IE/Windows ActiveX version
	else if (window.ActiveXObject) {
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
  	} else {
 		return false;
  	}

  	return xmlhttp;
}


// *****************************************************************************
// Function to load data
// *****************************************************************************
function loadData() {
	// Detect if HTTP object exists and is not busy
	if (http && !isWorking) {
		//http.open('get','http://people.rit.edu/~met8481/536/project_1/ajax/data/content.js');
		http.open('get','DATA/content.js');
		http.onreadystatechange=handleHttpResponse;
		http.send();
		isWorking = true;
	}
}


// *****************************************************************************
// Function to check data / input before creating select elements
// *****************************************************************************
function dataDriver(input, element, form, clearStoredData) {
	// Clears stored data if already set (to make room for new selections)
	if (clearStoredData == true) {
		deleteStoredData();
	}

	// Checks to see if input contains data (if so, assigns values to element & form variables (from THIS)
	if (input != null) {
		var element = input.value;
		var form = document.getElementById("mainForm");

		// Function call to remove children & results
		removeChildren(input);
	}

	// Checks to see if input is a prompt title
	if (element != "promptTitle") {
		// Calls function to create select elements
		createSelect(element, form);
	} else {
		// Function call to remove children & results
		removeChildren(input);
	}
}


// *****************************************************************************
// Funtion to create select elements
// *****************************************************************************
function createSelect(element, form) {
	// Checks to see if a localStorage or data value exists for the element
	if (data[element]) {
		// Creates div to hold select object
		var div = document.createElement('div');
		div.setAttribute('id', element);
		div.setAttribute('class', 'selectDiv');
		form.appendChild(div);

		// Creates select object
		var select = document.createElement('select');
		select.setAttribute('name', element);

		// Detects if browser is IE7 for onchange method call
		if (ie7) {
			select.setAttribute('onchange', function(){dataDriver(this, null, null, true);});
		} else {
			select.setAttribute('onchange', 'dataDriver(this, null, null, true)');
		}

		div.appendChild(select);

		// Detects if browser is IE7 for cookie or local storage check
		if (ie7) {
			// Checks for a match in cookies
			if (GetCookie(element)) {
				var localStorageElement = GetCookie(element);
			}
		} else {
			// Checks for a match in localStorage
			if (localStorage[element]) {
				var localStorageElement = localStorage[element];
			}
		}

		// Loops through data to populate select options
		for(options in data[element][0]){
			var option = document.createElement('option');
			option.setAttribute('value', options);

			// Checks if current option is set in cookies or local storage (if so, sets to selected)
			if (options == localStorageElement) {
				option.selected = true;

				var selectedOption = option;
			}

			// Sets text for option
			var optionText = document.createTextNode(data[element][0][options]);
			option.appendChild(optionText);

			select.appendChild(option);
		}

		// Appends form & select objects to the content div
		document.getElementById('content').appendChild(form);


		if (ie7) {
			// Assigns variable to cookies
			var storedData = document.cookie.split(';');
		} else {
			// Assigns variable to local storage
			var storedData = localStorage;
		}

		// Checks if cookies / local storage contains content - if so calls function again with stored data
		if (storedData.length > 0) {
				if (selectedOption != undefined) {
					createSelect(selectedOption.value, form);
				}
			}


	} else {
		// Outputs summary of selections
		outputSelections();
	}
}


// *****************************************************************************
// Function to output selections
// *****************************************************************************
function outputSelections() {
	// Grabs select elements on page, and the final result
	var selections = document.getElementsByTagName("select");
	var result = selections[selections.length-1].value;

	// Clears stored data if already set (to make room for new selections)
	deleteStoredData();

	// Writes selections to stored data
	for (selection in selections) {
		if (selections[selection].value != undefined) {
			if (ie7) {
				SetCookie(selections[selection].name, selections[selection].value, expiry);
			} else {
				localStorage.setItem(selections[selection].name, selections[selection].value);
			}
		}
	}

	// Creates div to hold results
	var resultDiv = document.createElement('div');
	resultDiv.setAttribute('id', "result");

	// Creates div to hold result text
	var resultTextDiv = document.createElement('div');
	resultTextDiv.setAttribute('id', "resultTextDiv");
	resultTextDiv.setAttribute('style', "opacity:0;");
	resultDiv.appendChild(resultTextDiv);

	// Creates UL to hold chosen selections
	var resultTextUL = document.createElement('ul');
	resultTextUL.setAttribute('id', "resultTextUL");
	resultTextDiv.appendChild(resultTextUL);

	// Creates LI tags to hold chosen selections
	for (selection in selections) {
		var si = selections[selection].selectedIndex;

		if (si != undefined) {
			var resultTextLI = document.createElement('li');
			resultTextUL.appendChild(resultTextLI);

			var resultTextContent = document.createTextNode(selections[selection].options[si].text);

			resultTextLI.appendChild(resultTextContent);
		}
	}

	// Creates span to hold link
	var resultSpan = document.createElement('span');
	resultSpan.setAttribute('id', "downloadLinkSpan");
	resultTextDiv.appendChild(resultSpan);

	// Creates link to hold result text
	var resultLink = document.createElement('a');
	resultLink.setAttribute('href', result);
	resultLink.setAttribute('id', "downloadLink");
	resultSpan.appendChild(resultLink);

	// Adds final result text to result div
	var resultLinkContent = document.createTextNode("Download!");
	resultLink.appendChild(resultLinkContent);

	// Detects if an image for the selection is available - then displays it
	if (data['image']) {
		// Loops through images in data
		for (deviceImage in data['image'][0]) {
			// Loops through selections to match with images
			for (i = 0; selections[i]; i++) {
				var device = selections[i].name;

				// Looks for an image match to the selected device
				if (deviceImage == device) {
					// Creates image element & applies attributes
					var img = document.createElement('img');
					img.setAttribute('src', "img/data/" + data['image'][0][deviceImage]);
					img.setAttribute('id', "imported_image");
					img.setAttribute('alt', "imported image");
					img.setAttribute('style', "position:relative;float:left;top:320px;");
					resultDiv.appendChild(img);
				}
			}
		}
	}

	// Calls function to create SMS form
	smsForm = createSMSForm();

	// Adds SMS form to result div
	resultTextDiv.appendChild(smsForm);

	// Places results on page
	document.getElementById('content').appendChild(resultDiv);

	// Calls functions to animate the results displaying
	slideUp();
	fadeIn();
}


// *****************************************************************************
// Function to create SMS form
// *****************************************************************************
function createSMSForm() {
	// Creates form to get user's email
	var smsForm = document.createElement('form');
	smsForm.setAttribute('action', '#');

	// Detects if browser is IE7 for onsubmit method call
	if (ie7) {
		smsForm.setAttribute('onsubmit', function(){return sendSMS(phoneInput.value);});
	} else {
		smsForm.setAttribute('onsubmit', 'return sendSMS(phoneInput.value)');
	}

	smsForm.setAttribute('method', 'post');
	smsForm.setAttribute('id', 'smsForm');

	// Creates email input
	var phoneInput = document.createElement('input');
	phoneInput.setAttribute('id', "phoneInput");
	phoneInput.setAttribute('name', "phoneInput");
	phoneInput.setAttribute('type', "text");
	smsForm.appendChild(phoneInput);

	// Creates email input title
	var phoneInputLabel = document.createElement('label');
	phoneInputLabel.setAttribute('id', "phoneInputLabel");
	phoneInputLabel.setAttribute('for', "phoneInput");

	// Adds label text to email input title
	var phoneLabelText = document.createTextNode("Send download link via SMS:");
	phoneInputLabel.appendChild(phoneLabelText);

	smsForm.appendChild(phoneInputLabel);

	// Creates email submit button
	var smsSubmit = document.createElement('input');
	smsSubmit.setAttribute('type', "submit");
	smsSubmit.setAttribute('id', "smsSubmit");
	smsSubmit.setAttribute('name', "smsSubmit");
	smsSubmit.setAttribute('value', "Send SMS");
	smsForm.appendChild(smsSubmit);

	return smsForm;
}


// *****************************************************************************
// Function to validate (client-side) and "send" sms
// *****************************************************************************
function sendSMS(phoneNumber) {
	// Strips all non-numeric characters from inputted phone number
    var formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');

	// Various checks on the inputted phone number to catch invalid cases
	if (phoneNumber.length == 0) {
		alert("No phone number entered!");
		return false;
	} else if (isNaN(parseInt(phoneNumber))) {
		alert("You entered an invalid phone number!");
		return false;
	} else if ((formattedPhoneNumber.length > 10)) {
		alert("You entered an invalid phone number - the length is too long!");
		return false;
	} else if ((formattedPhoneNumber.length < 10)) {
		alert("You entered an invalid phone number - the length is too short!");
		return false;
	} else if (formattedPhoneNumber.length == 10) {
		alert("SMS sent to " + formattedPhoneNumber + "!");
		return true;
	} else {
		return false;
	}
}


// *****************************************************************************
// Function to slide images
// *****************************************************************************
function slideUp(){
	// Gets the imported image ID
	var image = document.getElementById('imported_image');

	// Detects if the element exists
	if (image) {
		// Detects if browser is IE7
		if (ie7) {
			var topPosition = parseInt(image.currentStyle.marginTop);
		} else {
			var topPosition = parseInt(image.style.top);
		}

		// Slides the imported image up (to be visible)
		if (topPosition > 5){
			if (ie7) {
				image.style.marginTop = topPosition - 5 + 'px';
			} else {
				image.style.top = topPosition - 5 + 'px';
			}

			setTimeout(
				function(){
					slideUp();
				}
				,20
			);
		}
	}
}


// *****************************************************************************
// Function to fade in links
// *****************************************************************************
function fadeIn(){
	// Gets the link ID
	var link = document.getElementById('resultTextDiv');

	// Detects if the element exists
	if (link) {
		// Detects if browser is IE7 (does nothing - graceful degradation)
		if (ie7) {

		} else {
			var opacitySetting = parseFloat(link.style.opacity);

			// Fades in the link
			if (opacitySetting < 1.0){
				link.style.opacity = parseFloat(link.style.opacity) + .02;
			}

			setTimeout(
				function(){
					fadeIn();
				}
				,20
			);
		}
	}
}


// *****************************************************************************
// Function to remove children and results
// *****************************************************************************
function removeChildren(input) {
	// Removes child nodes if user changes selections
	while (input.parentNode != input.parentNode.parentNode.lastChild) {
		input.parentNode.parentNode.removeChild(input.parentNode.parentNode.lastChild);
	}

	// If a result div exists - remove it
	if (document.getElementById('result')) {
		var result = document.getElementById('result');

		result.parentNode.removeChild(result);
	}
}


// *****************************************************************************
// Function to delete stored data (via cookies or local storage)
// *****************************************************************************
function deleteStoredData() {
		// Detects if using cookies or local storage
		if (ie7) {
			// Grabs select elements on page to remove cookies
			var selections = document.getElementsByTagName("select");

			// Loops through select elements and deletes cookies named the same
			for (selection in selections) {
				if (selections[selection].value != undefined) {
					DeleteCookie(selections[selection].name);
				}
			}
		} else {
			localStorage.clear();
		}
}
