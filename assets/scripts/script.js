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

