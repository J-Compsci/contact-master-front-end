//TODO:
//Registration information fields submission
//Finish Update/Delete (Category must be selected and perform the correct action depending on button)
//Update Search and Add to proper attribute changes
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
// Need for actual login event-disabled while updating:
//   var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login:login,password:password};
// Need for actual login event-disabled while updating:
//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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

// Add - Not registration? additional numbers
function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	var tmp = {color:newColor,userId,userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/AddColor.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

//Search values -- update from Prof's Color options
//Search for users, email, or phone number?
function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	var colorList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchColors.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

// Update values -- change existing values
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

//----------Registration Form Overlay & Validation----------
function openForm(){
	document.getElementById("regOverlay").style.display = "block";
}

function closeForm(){
	document.getElementById("regOverlay").style.display = "none";

	//makes the form reappear if opened again
	if(newForm.style.display == "none"){
		//newForm.style.display = "inline";
		location.reload();
		return false;
		
	} else {

		var num = document.getElementsByClassName("loginResult");
		var inputs = newForm.elements;

		//clears all input fields, except for the button
		for (i = 0; i < inputs.length; i++) {
		  if (inputs[i].nodeName === "INPUT" && inputs[i].type === "text" || inputs[i].nodeName === "INPUT" && inputs[i].type === "password" || inputs[i].nodeName === "INPUT" && inputs[i].type === "email") {
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

//Registration Form
newForm = document.getElementById("regForm");

//Validating Form entries
function validate(event){
	//Check all text inputs for data longer than one character (2 min)
	if( newForm.firstN.value.length <= 1 ){
		document.getElementById("firstResult").innerHTML = "Your first name must be at least 2 characters";
    		newForm.firstN.focus();
    		return false;

	//Checking for valid entry on last name
	} else if( newForm.lastN.value.length <= 1 ){
		document.getElementById("lastResult").innerHTML = "Your last name must be at least 2 characters";
    		newForm.lastN.focus();
    		return false;

	//Backup check for input in the email input
	} else if( newForm.email.value == "" ){
		document.getElementById("emailResult").innerHTML = "Please provide your email";
	    	newForm.email.focus();
	    	return false;

	//Checking if there is any input and if there is require it to be a number and 10 digits
	//If there is no input it skips requirements (because its optional)
	} else if(newForm.phoneN.value.length >= 1){
		if(isNaN(newForm.phoneN.value) || newForm.phoneN.value.length != 10 ){
			document.getElementById("phoneResult").innerHTML = "Phone number must be 10 digits";
	    		newForm.phoneN.focus();
	    		return false;
		}

	//Checking for username minimum value
	} else if( newForm.userN.value.length < 4 || newForm.userN.value.length > 50){
		document.getElementById("usernameResult").innerHTML = "Your username must be at least 4 characters";
    		newForm.lastN.focus();
    		return false;

	//Password Field minimum
	//Password Value needs a minimum of 7 digits
	} else if(newForm.pass.value.length < 7){
		document.getElementById("passResult").innerHTML = "Your Password must be at least 7 characters";
		newForm.pass.focus();
		return false;

	//Password Confirmation
	} else if(newForm.passCon.value != newForm.pass.value){
		document.getElementById("passConResult").innerHTML = "Your passwords do not match";
		newForm.pass.focus();
		return false;

  	}else{
    		return true;
  	}
}

//Checking for a valid email input
function validEmail(){
	var email = newForm.email.value;
	at = email.indexOf("@");
	dot = email.lastIndexOf(".");
	if( at < 1 || (dot - at < 2) || dot == email.length ){
		document.getElementById("emailResult").innerHTML = "Provided email is incorrect";
		newForm.email.focus();
		return false;
	}
	return true;
}

/*function handleForm(event){
	event.preventDefault();
}*/

function userRegistration()
{
	//Makes the form go away and let's the user know they've been registered
	newForm.style.display = "none";
	document.getElementById("regResult").innerHTML = "You've been registered! You can close the form and login.";
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
		if( validate(event) ){
	    	//if the forms all have the basic proper input call the email validation
	    		if( !validEmail(event) ){
		    	//returns false if the email is invalid
		    	//handleForm(event);
		    		return;
					}
			userRegistration();
		}
	});
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
