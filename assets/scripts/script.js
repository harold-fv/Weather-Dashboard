
const apiKey = '90ace26e027188c843006052e3d2de35';

function fetchWeatherForecast(cityName) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching weather data');
            }
            return response.json();
        })
        .then(data => {
            const dailyForecast = getDailyForecast(data.list);
            displayWeatherForecast(dailyForecast);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = document.getElementById('city-name').value;
    fetchWeatherForecast(cityName);
});

function displayWeatherForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecastData.length; i++) {
        const data = forecastData[i];

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        const dateElement = document.createElement('p');
        dateElement.textContent = data.date;
        forecastCard.appendChild(dateElement);

        const iconElement = document.createElement('img');
        iconElement.src = `https://openweathermap.org/img/w/${data.icon}.png`;
        forecastCard.appendChild(iconElement);

        const tempElement = document.createElement('p');
        tempElement.textContent = `Temperature: ${data.temp}°F`;
        forecastCard.appendChild(tempElement);

        const windElement = document.createElement('p');
        windElement.textContent = `Wind Speed: ${data.wind} MPH`;
        forecastCard.appendChild(windElement);

        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${data.humidity}%`;
        forecastCard.appendChild(humidityElement);

        forecastContainer.appendChild(forecastCard);
    }
}

function getDailyForecast(dataList) {
    const dailyData = [];

    for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        const date = data.dt_txt.split(' ')[0];
        const time = data.dt_txt.split(' ')[1];

        if (time === '12:00:00') {
            dailyData.push({
                date: new Date(date).toLocaleDateString(),
                icon: data.weather[0].icon,
                temp: data.main.temp,
                wind: data.wind.speed,
                humidity: data.main.humidity
            });
        }
    }

    return dailyData;
}
