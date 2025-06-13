document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherInfo = document.getElementById('weather-info');

    // Replace this with your real API key from OpenWeatherMap
    const API_KEY = 'b374527c751bfbb7c0bfef797982c680';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}';

    searchBtn.addEventListener('click', getWeather);
    cityInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') getWeather();
    });

    async function getWeather() {
        const city = cityInput.value.trim();

        if (!city) {
            showError('Please enter a city name');
            return;
        }

        try {
            weatherInfo.innerHTML = '<p>Loading...</p>';

            const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch weather');
            }

            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            showError(error.message);
            console.error('Error:', error);
        }
    }

    function displayWeather(data) {
        const { name, sys, main, weather, wind } = data;
        const condition = weather[0];

        weatherInfo.innerHTML = `
            <div class="weather-data">
                <h2>${name}, ${sys.country}</h2>
                <p><strong>Temperature:</strong> ${main.temp}°C (Feels like ${main.feels_like}°C)</p>
                <p><strong>Condition:</strong> ${condition.main} - ${condition.description}</p>
                <p><strong>Humidity:</strong> ${main.humidity}%</p>
                <p><strong>Wind:</strong> ${wind.speed} m/s</p>
                <img src="https://openweathermap.org/img/wn/${condition.icon}@2x.png" alt="${condition.description}">
            </div>
        `;
    }

    function showError(message) {
        weatherInfo.innerHTML = `<p class="error">${message}</p>`;
    }
});
