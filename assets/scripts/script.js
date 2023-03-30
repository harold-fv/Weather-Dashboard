let APIKey = "90ace26e027188c843006052e3d2de35";
let cities = [];

//This function will retrieve the the cityname
function retrieveCity(cityName2) {
  
    document.getElementById("city-details").style.display = "block";
    document.getElementById("city-forecast").style.display = "block";
    let cityName = document.getElementById("city-name").value;
    
    if (cityName !== cityName2) {
        cityName = cityName2;
    }
    
    fetch(
        'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + APIKey
    )
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let cityLat = data[0].lat;
        let cityLon = data[0].lon;

        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=imperial";
        let currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey + "&units=imperial";

        presentWeather(currentUrl);
        projectedWeather(forecastURL);
    });
}
// This function will retrieve the currentweather
function presentWeather(currentUrl) {
    fetch(currentUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let now = dayjs().format('MMMM D, YYYY');
            let cityDetailsHeader = document.getElementById("city-details-header");
            cityDetailsHeader.textContent = data.name + ' (' + now + ')';
            
            document.getElementById("current-city-temp").textContent = "Temperature: " + data.main.temp + "\u00B0F";
            document.getElementById("current-city-wind").textContent = "Wind Speed: " + data.wind.speed + " MPH";
            document.getElementById("current-city-humid").textContent = "Humidity: " + data.main.humidity + "%";
            
            let iconURL = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';

            let iconImage = document.createElement("img");
            iconImage.setAttribute("src", iconURL);
            cityDetailsHeader.appendChild(iconImage);
        });
}

//This will get the projected 5 day weather forecast
let forecastContainerEl = $("#forecast-box");
function projectedWeather(forecastUrl) {
    let forecastContainer = document.getElementById("forecast-box");
    forecastContainer.innerHTML = "";
    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var dataList = data.list;

            for (let i = 0; i < dataList.length; i++) {
                let date = dataList[i].dt_txt.split(" ")[0];
                let time = dataList[i].dt_txt.split(" ")[1];

                let dateFormatted = dayjs(date).format('MMMM D, YYYY');
                let today = dayjs().format('MMMM D, YYYY');

                if (time === '12:00:00' && dateFormatted !== today) {
                    let dayForecastEl = document.createElement('section');
                    dayForecastEl.setAttribute('id', 'day-' + dateFormatted);
                    dayForecastEl.setAttribute('class', 'col-sm bg-primary text-white m-1');

                    let dateForecastEl = document.createElement('h1');
                    dateForecastEl.setAttribute('id', 'day-date-' + dateFormatted);
                    dateForecastEl.setAttribute('style', 'color: white;');
                    dateForecastEl.textContent = dateFormatted;

                    let iconForecastEl = document.createElement('h1');
                    let iconURL = 'https://openweathermap.org/img/w/' + dataList[i].weather[0].icon + '.png';
                    let iconImage = document.createElement("img");
                    iconImage.setAttribute("src", iconURL);
                    iconForecastEl.setAttribute('id', 'day-icon-' + dateFormatted);
                    iconForecastEl.appendChild(iconImage);

                    let tempForecastEl = document.createElement('p');
                    tempForecastEl.setAttribute('id', 'day-temp-' + dateFormatted);
                    tempForecastEl.textContent = "Temperature: " + dataList[i].main.temp + "\u00B0F";
                    tempForecastEl.setAttribute('style', 'color: white;');

                    let windForecastEl = document.createElement('p');
                    windForecastEl.setAttribute('id', 'day-wind-' + dateFormatted);
                    windForecastEl.textContent = "Wind Speed: " + dataList[i].wind.speed + " MPH";
                    windForecastEl.setAttribute('style', 'color: white;');

                   let humForecastEl = document.createElement('p');
                    humForecastEl.setAttribute('id', 'day-hum-' + dateFormatted);
                    humForecastEl.textContent = "Humidity: " + dataList[i].main.humidity + "%";
                    humForecastEl.setAttribute('style', 'color: white;');

                    dayForecastEl.appendChild(dateForecastEl);
                    dayForecastEl.appendChild(iconForecastEl);
                    dayForecastEl.appendChild(tempForecastEl);
                    dayForecastEl.appendChild(windForecastEl);
                    dayForecastEl.appendChild(humForecastEl);

                    forecastContainer.appendChild(dayForecastEl);
                }
            }
        });
}

// This function will push the city that was most recently searched for at the top 
// of the recent search list
function appendCity(newCity) {
    const previousCities = [...cities];
    cities.length = 0; 
    cities.push(newCity); 

    for (let i = 0; i < previousCities.length; i++) {
        cities.push(previousCities[i]);
    }
    modifyCitylist();
    storeCity();
}


//This function updates the list of city
let recentSearchResultsEl = document.getElementById("recent-search-container");
function modifyCitylist() {
    let citiesHtml = "";
    for (let i = 0; i < cities.length; i++) {
        citiesHtml += '<button class="btn">' + cities[i].name + '</button>';
    }
    recentSearchResultsEl.innerHTML = citiesHtml;
    console.log(cities[0]);
}

// get the text from searched city buttons 
const recentSearchResults = document.getElementById("recent-search-container");
recentSearchResults.addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON") {
        let recentCityName = event.target.textContent;
        retrieveCity(recentCityName);
    }
});

// This function is to search the City
function citySearch() {
    let citySearchForm = document.getElementById("city-search-form");
    citySearchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let newCityName = document.getElementById("city-name").value;
        let newCity = {
            name: newCityName
        };
        appendCity(newCity);
        retrieveCity(newCityName);
    });
}
window.addEventListener('load', function() {
    console.log("init");
    citySearch();
    loadCities();
    let cities = JSON.parse(localStorage.getItem("cities"));
    if (cities) {
        let lastCity = cities[0].name;  
        console.log("testing: " + lastCity)
        retrieveCity(lastCity); 
        modifyCitylist();

    } else {
        document.getElementById("city-details").style.display = "none"; 
        document.getElementById("city-forecast").style.display = "none";
    }
});

// to store the city data in LocalStorage
var storeCity = function() {
    localStorage.setItem( "cities", JSON.stringify(cities) );
 }
 
 //gets the city data from Local Storage
 var loadCities = function() {
     cities = JSON.parse(localStorage.getItem("cities"));
     if (!cities){
         cities = [];   
     }
     console.log("load cities", cities);
     modifyCitylist();
 }
 


