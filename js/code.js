//TODO:
//Registration information fields submission
//Finish Update/Delete (Determine if update is needed, complete delete function)
//Connect to API

var urlBase = 'http://contactmaster.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login:login,password:password};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "user.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}


function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


// Add - new Contacts
function addContact(event)
{
	event.preventDefault();
	document.getElementById("contactAddResult").innerHTML = "";

	var data = new FormData(event.target);
	var value = Object.fromEntries(data.entries());

	var jsonPayload = JSON.stringify( value );

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added, you may close the form.";
				addForm.style.display = "none";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}


//Search values
function searchContact()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i = 0; i < jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				document.getElementsByTagName("p").style.display = "inline-block"
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Update values... is update needed or does add color work for updating DB data
/*function updateValue(){
	var update = document.getElementById("updateText").value;
	var cat = document.getElementById("valueCat").value;
	//update with updateText values
}*/

// Delete values -- incomplete
function deleteValue(){
	var del = document.getElementById("updateText").value;
	var cat = document.getElementById("valueCat").value;
	//delete the value from data
}

//----------Registration and Add Contact Form Overlay & Validation----------
function openFormReg(){
	document.getElementById("regOverlay").style.display = "block";
}
function openFormAdd(){
	document.getElementById("addOverlay").style.display = "block";
}
function closeFormReg(){
	document.getElementById("regOverlay").style.display = "none";

	// If form display is none, then reg was successful, reload the page index.html
	if(newForm.style.display == "none"){
		location.reload();
		return false;

	} else {	//IF we reach here then user did not complete registration, clear the result and input fields
		var num = document.getElementsByClassName("loginResult");
		var inputs = newForm.elements;

		//clears all input fields, except for the button
		for (i = 0; i < inputs.length; i++) {
		  if (inputs[i].nodeName === "INPUT" && inputs[i].type === "text" || inputs[i].nodeName === "INPUT" && inputs[i].type === "password" || inputs[i].nodeName === "INPUT" && inputs[i].type === "email") {
		    // Update text input
		    inputs[i].value = "";
		  }
		}

		//iterate between each span and make innerHTML of result response "" (blank) to avoid buildup
		for(var i = 0; i < num.length; i++){
			document.getElementsByClassName("loginResult")[i].innerHTML = "";
		}
	}
}

//Closes Add Contact Form
function closeFormAdd(){
	document.getElementById("addOverlay").style.display = "none";

	//makes the form reappear if opened again
	if(addForm.style.display == "none"){
		location.reload();
		return false;

	} else {

		var num = document.getElementsByClassName("loginResult");
		var inputs = addForm.elements;

		//clears all input fields, except for the button
		for (i = 0; i < inputs.length; i++) {
		  if(inputs[i].nodeName === "INPUT" && inputs[i].type === "text" || inputs[i].nodeName === "INPUT" && inputs[i].type === "email") {
		    // Update text input
		    inputs[i].value = "";
		  }
		}

		//iterate between each span and make innerHTML "" (blank) to avoid buildup
		for(var i = 0; i < num.length; i++){
			document.getElementsByClassName("loginResult")[i].innerHTML = "";
		}
	}
}




//Validating registration Form entries
function validateReg(event){

	if( newForm.FirstName.value.length <= 1 ){
		document.getElementById("firstResult").innerHTML = "Your first name must be at least 2 characters";
    		return false;

	} else if( newForm.LastName.value.length <= 1 ){
		document.getElementById("lastResult").innerHTML = "Your last name must be at least 2 characters";
    		return false;

	} else if( newForm.Login.value.length < 4 || newForm.Login.value.length > 50){
		document.getElementById("usernameResult").innerHTML = "Your username must be at least 4 characters";
    		return false;

	} else if(newForm.Password.value.length < 7){
		document.getElementById("passResult").innerHTML = "Your Password must be at least 7 characters";
		return false;

	} else if(newForm.passCon.value != newForm.Password.value){
		document.getElementById("passConResult").innerHTML = "Your passwords do not match";
		return false;

  	}else{
    		return true;
  	}
}

function validateAdd(event){  // Validating Added Contact Entries

	if( addForm.FirstName.value.length <= 1 ){
		document.getElementById("addFirst").innerHTML = "First names must be at least 2 characters";
		return false;

	} else if( addForm.LastName.value.length <= 1 ){
		document.getElementById("addLast").innerHTML = "Last names must be at least 2 characters";
		return false;

	} else if( addForm.Phonenumber.value.length <= 1 ){
		console.log(addForm.Phonenumber.value.length);
		document.getElementById("addPhone").innerHTML = "Phone numbers must be 10 digits";
		return false;

	} else if( addForm.Phonenumber.value.length >= 1 ){
		if( isNaN(addForm.Phonenumber.value) || addForm.Phonenumber.value.length != 10 ){
			console.log(addForm.Phonenumber.value.length);
			document.getElementById("addPhone").innerHTML = "Phone numbers must be 10 digits";
			return false;
		}
		console.log(addForm.Email.value.length);
	} else if( addForm.Email.value.length <= 1 ){
		console.log(addForm.Email.value.length);
		document.getElementById("addEmail").innerHTML = "Please provide an email";
		return false;

	}else{
		return true;
	}
}

//Checking for a valid email input
function validEmail(event){
	var email = addForm.Email.value;
	at = email.indexOf("@");
	dot = email.lastIndexOf(".");

	if( at < 1 || (dot - at < 2) || dot == email.length ){
		document.getElementById("addEmail").innerHTML = "Provided email is incorrect";
		return false;
	}

	return true;
}

//Registration Form
newForm = document.getElementById("regForm");
addForm = document.getElementById("addForm");

if(addForm){
	//Event listener for the submit button
	addForm.addEventListener("submit", function(event){
		var num = document.getElementsByClassName("loginResult");
		for(var i = 0; i < num.length; i++){
			//iterate between each span and make innerHTML "" (blank) to avoid buildup
			document.getElementsByClassName("loginResult")[i].innerHTML = "";
		}
		if( validateAdd(event) ){
			if( !validEmail(event) ){
				return;
			} else{
				addContact(event);
			}
		}
	});
}

//Make sure this is only being called on valid pages i.e. index registration
if(newForm){
	//Event listener for the submit button
	newForm.addEventListener("submit", function(event){
		//If form has been "submitted" without correct info before, returns html result spans to blank
		var num = document.getElementsByClassName("loginResult");
		for(var i = 0; i < num.length; i++){
			//iterate between each span and make innerHTML "" (blank) to avoid buildup
			document.getElementsByClassName("loginResult")[i].innerHTML = "";
		}
		if( validateReg(event) ){
			userRegistration(event);
		}
	});
}

function userRegistration(event){  //Sends Registration Data
	event.preventDefault();
	document.getElementById("regResult").innerHTML = "";

	var data = new FormData(event.target);
	var value = Object.fromEntries(data.entries());

  var xhr = new XMLHttpRequest();
	var url = urlBase + '/Registration.' + extension; //NEED proper .php filename
	var jsonPayload = JSON.stringify( value );
  // Set up our request
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				newForm.style.display = "none";  //Makes the form go away and let's the user know they've been registered
				document.getElementById("regResult").innerHTML = "You've been registered! You can close the form and login.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("regResult").innerHTML = err.message;
	}
}


// Dynamic Background---------------------------------------------


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 240, // Frames per second
    x = 200, // Number of stars
    mouse = {
      x: 0,
      y: 0
    };  // mouse location

// Push stars to array

for (var i = 0; i < x; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1 + 1,
    vx: Math.floor(Math.random() * 50) - 25,
    vy: Math.floor(Math.random() * 50) - 25
  });
}

// Draw the scene

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.globalCompositeOperation = "lighter";

  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];

    ctx.fillStyle = "#399AC0";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.stroke();
  }

  ctx.beginPath();
  for (var i = 0, x = stars.length; i < x; i++) {
    var starI = stars[i];
    ctx.moveTo(starI.x,starI.y);
    if(distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
    for (var j = 0, x = stars.length; j < x; j++) {
      var starII = stars[j];
      if(distance(starI, starII) < 150) {
        //ctx.globalAlpha = (1 / 150 * distance(starI, starII).toFixed(1));
        ctx.lineTo(starII.x,starII.y);
      }
    }
  }
  ctx.lineWidth = 0.05;
  ctx.strokeStyle = '#399AC0';
  ctx.stroke();
}

function distance( point1, point2 ){
  var xs = 0;
  var ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;

  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt( xs + ys );
}

// Update star locations

function update() {
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];

    s.x += s.vx / FPS;
    s.y += s.vy / FPS;

    if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
    if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
  }
}

canvas.addEventListener('mousemove', function(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Update and draw

function tick() {
  draw();
  update();
  requestAnimationFrame(tick);
}

tick();
