
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function formatTemperature(celsius) {
    if (settingsManager.getUnit() === 'F') {
        return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
    }
    return `${Math.round(celsius)}°C`;
}

function updateTemperatureDisplay() {
    
    const tempElement = document.getElementById('temperature');
    const currentTemp = parseFloat(tempElement.textContent);
    if (!isNaN(currentTemp)) {
        const celsius = settingsManager.getUnit() === 'F' ? 
            (currentTemp - 32) * 5/9 : currentTemp;
        tempElement.textContent = formatTemperature(celsius);
    }

    const forecastDays = document.querySelectorAll('.forecast-day');
    forecastDays.forEach(day => {
        const tempText = day.querySelector('div:nth-child(3)').textContent;
        const [maxTemp, minTemp] = tempText.split(' / ').map(t => parseFloat(t));
        if (!isNaN(maxTemp) && !isNaN(minTemp)) {
            const maxC = settingsManager.getUnit() === 'F' ? (maxTemp - 32) * 5/9 : maxTemp;
            const minC = settingsManager.getUnit() === 'F' ? (minTemp - 32) * 5/9 : minTemp;
            day.querySelector('div:nth-child(3)').textContent = 
                `${formatTemperature(maxC)} / ${formatTemperature(minC)}`;
        }
    });
}

function displayWeather(data) {
    document.getElementById('weatherInfo').style.display = 'block';
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = formatTemperature(data.main.temp);
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('details').textContent = 
        `Humidity: ${data.main.humidity}% | Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
}


function displayWeather(data) {
    document.getElementById('weatherInfo').style.display = 'block';
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('details').textContent = 
        `Humidity: ${data.main.humidity}% | Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
}

function displayForecast(dailyData) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';
    
    dailyData.slice(1, 8).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'forecast-day';
        dayDiv.innerHTML = `
            <div>${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather icon">
            <div>${Math.round(day.temp.max)}°C / ${Math.round(day.temp.min)}°C</div>
            <div>${day.weather[0].main}</div>
        `;
        forecastDiv.appendChild(dayDiv);
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
        `${input} Village`
    ];

    suggestions.innerHTML = mockSuggestions
        .map(place => `<div class="suggestion-item" onclick="selectSuggestion('${place}')">${place}</div>`)
        .join('');
}
