
document.addEventListener('DOMContentLoaded', () => {

    initializeSearchHandlers();
  
    getRandomWeather();
    setInterval(getRandomWeather, 60000);
});

async function getRandomWeather() {
    const randomCity = RANDOM_CITIES[Math.floor(Math.random() * RANDOM_CITIES.length)];
    try {
        const data = await getWeatherByCity(randomCity);
        document.getElementById('randomWeather').innerHTML = `
            ${randomCity}: ${formatTemperature(data.main.temp)}, ${data.weather[0].main}
        `;
    } catch (error) {
        console.error('Error fetching random weather:', error);
        document.getElementById('randomWeather').innerHTML = 'Weather update unavailable';
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        document.getElementById('loading').style.display = 'block';
        navigator.geolocation.getCurrentPosition(
            async position => {
                try {
                    const data = await getWeatherByCoords(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                    displayWeather(data);
                    const forecast = await getForecastData(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                    displayForecast(forecast.daily);
                } catch (error) {
                    alert('Error fetching weather data');
                } finally {
                    document.getElementById('loading').style.display = 'none';
                }
            },
            error => {
                alert('Error getting location. Please try searching by city name.');
                document.getElementById('loading').style.display = 'none';
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

async function searchWeather() {
    const city = document.getElementById('searchInput').value;
    if (!city) return;

    document.getElementById('loading').style.display = 'block';
    try {
        const data = await getWeatherByCity(city);
        if (data.cod === '404') {
            alert('City not found');
            return;
        }
        displayWeather(data);
        const forecast = await getForecastData(data.coord.lat, data.coord.lon);
        displayForecast(forecast.daily);
    } catch (error) {
        alert('Error fetching weather data');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function initializeSearchHandlers() {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');

    searchInput.addEventListener('input', (e) => {
        suggestLocations(e.target.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input-group')) {
            suggestions.innerHTML = '';
        }
    });
}

function suggestLocations(input) {
    const suggestions = document.getElementById('suggestions');
    if (input.length < 3) {
        suggestions.innerHTML = '';
        return;
    }

    const mockSuggestions = [
        `${input} City`,
        `${input} Town`,
        `${input} Village`,
        `${input} Metropolitan`
    ];

    suggestions.innerHTML = mockSuggestions
        .map(place => `
            <div class="suggestion-item" onclick="selectSuggestion('${place}')">
                ${place}
            </div>
        `)
        .join('');
}

function selectSuggestion(place) {
    document.getElementById('searchInput').value = place;
    document.getElementById('suggestions').innerHTML = '';
    searchWeather();
}

function handleError(error, message = 'An error occurred') {
    console.error(error);
    alert(message);
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentLocation,
        searchWeather,
        getRandomWeather
    };
}