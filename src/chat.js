import people from "./people";
import './chat.scss';

let chatObj = {
	"oily/dull": "How many times do you wash your hair?",
	"good": [
		"That is great",
		"I recommend you to use dove oxygen moisture for better results",
	],
	"less": "Washing your hair {NO} of times per week when it is oily is not healthy",
	"more": "Washing your hair {NO} of times per week when it is dull is not healthy",
	"common": "I recommend you to use dove (oil control/daily shine based on the hair problem) shampoo"
}

let cityWeatherData;
let initialCount = 0;

export function initializeChat() {
	const root = document.createElement("div");
	root.innerHTML = displaySplashScreen();
	document.body.appendChild(root);

	//Find the latitude & longitude
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(successFunction, errorFunction, {timeout:3000, enableHighAccuray: false, maximumAge: Infinity});
	} 
}


function displayChatComponent(cityWeatherData=false) {
	return `
		<section class="chat-sec">
			${displayInChat(cityWeatherData)}
			${displayUserInputComponent()}
		</section>
	`;
}

function displayInChat(cityWeatherData) {
	return `
		<div class="in-chat" id="chat-box-content">
			${displayChatContent(cityWeatherData)}
		</div>
	`;
}

function displayChatContent(cityWeatherData) {
	if (cityWeatherData) {
		let temperatureData = JSON.parse(cityWeatherData[1]);
		return `
			<div class="chat-bot-text">
				Hi, it is ${temperatureData.main.temp} degrees outside in ${cityWeatherData[0].short_name}. How is your hair feeling?
			</div>
		`;
	} else {
		return `
			<div class="chat-bot-text">
				Hi, How is your hair feeling?
			</div>
		`;
	}
}

function displayChatBotContent(val, opt=false) {
	let botText;
	if (cityWeatherData) {
		let temperatureData = JSON.parse(cityWeatherData[1]);
		botText = `Hi, it is ${temperatureData.main.temp} degrees outside in ${cityWeatherData[0].short_name}. How is your hair feeling?`;
	} else {
		botText = `Hi, How is your hair feeling?`;
	}
	if (initialCount == 1) {
		botText = `How many times do you wash your hair?`;
	}
	if (val) {
		botText = val;
	}
	let botChatHtml = '';
	if (val == undefined) {
		botChatHtml += `
			<div class="chat-bot-text">
				I'm sorry. I didn't get that.
			</div>
		`;
	} else if (opt === "video") {
		botText = `
			<iframe class="video" src="https://www.youtube.com/embed/wsoN2C0JzWk?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
		`;
	} else if (opt === "carousel") {
		botText = `
			${carousel()}
		`;
	}
	botChatHtml += `
		<div class="chat-bot-text">
			${botText}
		</div>
	`;
	document.getElementById('chat-box-content').insertAdjacentHTML('beforeend',botChatHtml);
}

function displayUserChatContent(val) {
	let userChatHtml = `
		<div class="chat-user-text">
			${val}
		</div>
	`;
	document.getElementById('chat-box-content').insertAdjacentHTML('beforeend',userChatHtml);

}

//Process user input & return chat output
function processUserInput() {
	let inputVal = document.getElementById("user-input-text").value;
	document.getElementById("user-input-text").value = '';
	displayUserChatContent(inputVal);
	if (initialCount === 0) {
		switch(inputVal.toLowerCase()) {
			case "oily": 
				displayChatBotContent(chatObj["oily/dull"]);
				initialCount = 1;
				break;
			case "dull": 
				displayChatBotContent(chatObj["oily/dull"]);
				initialCount = 1;
				break;
			case "good":
				displayChatBotContent(chatObj.good[0]);
				displayChatBotContent(chatObj.good[1]);
				displayChatBotContent("https://www.youtube.com/watch?v=wsoN2C0JzWk", "video");
				document.getElementById("user-inp-comp").style.display = "none";
				break;
			default:
				displayChatBotContent();
				break;
		}
	} else if (initialCount === 1) {
		if (isNaN(inputVal)) {
			displayChatBotContent();
		} else {
			if (inputVal <= 7) {
				displayChatBotContent(chatObj.less.replace("{NO}", inputVal));	
			} else {
				displayChatBotContent(chatObj.more.replace("{NO}", inputVal));
			}
			displayChatBotContent(chatObj.common);
			displayChatBotContent("", "carousel");
			document.getElementById("user-inp-comp").style.display = "none";

		}
	}
}

function displayUserInputComponent() {
	return `
		<div class="user-input-sec" id="user-inp-comp">
			<input type="text" id="user-input-text" class="user-input-box" placeholder="Type your message here..." />
			<button type="button" id="user-input-submit" class="user-send-button">SEND</button>
		</div>
	`;
}

function carousel() {
	let carouselImages = ['dandruff', 'hairfall', 'nourish-black', 'nourishoil', 'oilcare'];
	let carouselArr = '';
	carouselImages.forEach(function(elem) {
	    carouselArr += `
	    	<div>
				<img src="./src/carousel-images/${elem}.jpg" alt="${elem}" />
			</div>
	    `;
	});

	return `
		<div class="carousel-container">
			${carouselArr}
		</div>
	`;
}

function displaySplashScreen() {
	return `
		<section class="splash-screen">
			<img src="./src/splash.jpg" alt="dove-test" />
		</section>
	`;
}

function successFunction(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    //find the current city
    const cityRequest = findCity(lat, lng)
    //find the current temperature
    const weatherRequest = findTemperature(lat, lng)
	Promise.all([cityRequest, weatherRequest]).then(data => {
		cityWeatherData = data;
		const root = document.createElement("div");
	  	root.innerHTML = displayChatComponent(cityWeatherData);
	  	document.body.appendChild(root);
	  	let submitBtn = document.getElementById("user-input-submit");
  		submitBtn.addEventListener('click', processUserInput, false);
	}).catch(function(e){
		console.log(e);
	});
}

function errorFunction(error){
	console.log("errorFunction", error);
	// add default city and temperature if geolocation not found (optional)
	const root = document.createElement("div");
  	root.innerHTML = displayChatComponent();
  	document.body.appendChild(root);
  	let submitBtn = document.getElementById("user-input-submit");
  	submitBtn.addEventListener('click', processUserInput, false); 
}

function findTemperature(lat, lng) {
	return new Promise(function (resolve, reject) {
	    let xhr = new XMLHttpRequest();
	    xhr.withCredentials = false;
	    const url = `https://cors-anywhere.herokuapp.com/https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&lat=${lat}&lon=${lng}&units=metric`;
	    xhr.open("GET", url, true);
	    xhr.onload = function () {
	      if (this.status >= 200 && this.status < 300) {
	        resolve(xhr.response);
	      } else {
	        reject({
	          status: this.status,
	          statusText: xhr.statusText
	        });
	      }
	    };
	    xhr.onerror = function () {
	      reject({
	        status: this.status,
	        statusText: xhr.statusText
	      });
	    };
	    xhr.send();
	});
}

function findCity(lat, lng) {
	return new Promise(function (resolve, reject) {
		let geocoder = new google.maps.Geocoder();
		let city;
		let latlng = new google.maps.LatLng(lat, lng);
		  geocoder.geocode({
		    'latLng': latlng
		  }, function(results, status) {
		   if (status == google.maps.GeocoderStatus.OK) {
		     if (results[1]) {
		    //find country name
		     for (let i = 0; i < results[0].address_components.length; i++) {
		       for (let b = 0; b < results[0].address_components[i].types.length; b++) {
		        if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
		          city = results[0].address_components[i];
		          resolve(city);
		          break;
		        }
		      }
		    }
		   } else {
		     reject("City name not available");
		    }
		   } else {
		     reject("Geocoder failed due to: ", status);
		   }
		  });
	});
}