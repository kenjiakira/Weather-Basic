const API_KEY = '1230a8fdc6457603234c68ead5f3f967'; //APIKEY
const RANDOM_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Moscow'];

async function getRandomWeather() {
    const randomCity = RANDOM_CITIES[Math.floor(Math.random() * RANDOM_CITIES.length)];
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        document.getElementById('randomWeather').innerHTML = `
            ${randomCity}: ${Math.round(data.main.temp)}°C, ${data.weather[0].main}
        `;
    } catch (error) {
        console.error('Error fetching random weather:', error);
    }
}
// Kiểm tra xem Web có hỗ trợ vị trí hay không
function getCurrentLocation() {
    if (navigator.geolocation) {
        document.getElementById('loading').style.display = 'block';
        navigator.geolocation.getCurrentPosition(
            position => {
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
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
//phần API
async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayWeather(data);
        getForecast(lat, lon);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data');
    }
    document.getElementById('loading').style.display = 'none';
}
// Phần Tìm Kiếm
async function searchWeather() {
    const city = document.getElementById('searchInput').value;
    if (!city) return;

    document.getElementById('loading').style.display = 'block';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod === '404') {
            alert('City not found');
            return;
        }
        displayWeather(data);
        getForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data');
    }
    document.getElementById('loading').style.display = 'none';
}

async function getForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayForecast(data.daily);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.classList.add('show');  

    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`; // Không thêm emoji vào nhiệt độ
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const humidityText = translations[currentLang].humidity;
    const windText = translations[currentLang].wind;
    const cloudCoverText = translations[currentLang].cloudCover;

    document.getElementById('details').textContent = 
    `${humidityText}: ${data.main.humidity}% ${getHumidityEmoji(data.main.humidity)} | ${windText}: ${Math.round(data.wind.speed * 3.6)} km/h ${getWindEmoji(data.wind.speed)} | ${cloudCoverText}: ${data.clouds.all}% ${getCloudCoverEmoji(data.clouds.all)}`;
}

function getTemperatureEmoji(temp) {

    return ''; 
}

function getHumidityEmoji(humidity) {
    if (humidity >= 80) {
        return '💦'; 
    } else if (humidity >= 50) {
        return '💧';
    } else {
        return '🌬️'; 
    }
}

function getWindEmoji(windSpeed) {
    if (windSpeed >= 15) {
        return '🌬️'; 
    } else if (windSpeed >= 5) {
        return '🍃'; 
    } else {
        return '🍃';
    }
}

function getCloudCoverEmoji(cloudCover) {
    if (cloudCover >= 75) {
        return '☁️☁️'; 
    } else if (cloudCover >= 50) {
        return '☁️'; 
    } else {
        return '🌤️'; 
    }
}

document.getElementById('searchInput').addEventListener('input', function(event) {
    const query = event.target.value;
    
    if (query.length < 3) {
        document.getElementById('suggestions').innerHTML = '';  
        return;
    }

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            
            const suggestions = data.results.map(result => result.formatted);

            const suggestionsDiv = document.getElementById('suggestions');
            suggestionsDiv.innerHTML = '';
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.innerText = suggestion;
                suggestionItem.onclick = function() {
                    document.getElementById('searchInput').value = suggestion;
                    suggestionsDiv.innerHTML = '';
                    searchWeather();  
                };
                suggestionsDiv.appendChild(suggestionItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data from OpenCage:', error);
        });
});

function searchWeather() {
    const cityName = document.getElementById('searchInput').value;
    
    console.log('Searching weather for:', cityName);
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

function selectSuggestion(place) {
    document.getElementById('searchInput').value = place;
    document.getElementById('suggestions').innerHTML = '';
    searchWeather();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    suggestLocations(e.target.value);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const menu = document.querySelector('.menu-options');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input-group')) {
        document.getElementById('suggestions').innerHTML = '';
    }
});

getRandomWeather();
setInterval(getRandomWeather, 60000);

let currentLang = 'en'; 

function changeLanguage() {
currentLang = document.getElementById('language').value;

if (document.getElementById('searchInput').value) {
searchWeather();
} else {
getRandomWeather();
}
}
async function getRandomWeather() {
    const randomCity = RANDOM_CITIES[Math.floor(Math.random() * RANDOM_CITIES.length)];
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${randomCity}&appid=${API_KEY}&units=metric&lang=${currentLang}`);
        const data = await response.json();
        document.getElementById('randomWeather').innerHTML = `
            ${randomCity}: ${Math.round(data.main.temp)}°C, ${data.weather[0].description}
        `;
    } catch (error) {
        console.error('Error fetching random weather:', error);
    }
}


async function searchWeather() {
const city = document.getElementById('searchInput').value;
if (!city) return;

document.getElementById('loading').style.display = 'block';
try {
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${currentLang}`);
const data = await response.json();
if (data.cod === '404') {
    alert('City not found');
    return;
}
displayWeather(data);
getForecast(data.coord.lat, data.coord.lon);
} catch (error) {
console.error('Error fetching weather:', error);
alert('Error fetching weather data');
}
document.getElementById('loading').style.display = 'none';
}

async function getWeatherByCoords(lat, lon) {
try {
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${currentLang}`);
const data = await response.json();
displayWeather(data);
getForecast(lat, lon);
} catch (error) {
console.error('Error fetching weather:', error);
alert('Error fetching weather data');
}
document.getElementById('loading').style.display = 'none';
}
const translations = {
en: {
slogan: 'The Only Weather Forecast You Need',
humidity: 'Humidity',
wind: 'Wind',
cloudCover: 'Cloud cover',
searchPlaceholder: 'Enter city name...',
weatherNotFound: 'City not found',
error: 'Error fetching weather data',
useCurrentLocation: 'Use current location',
},
vi: {
slogan: 'Dự báo thời tiết duy nhất bạn cần',
humidity: 'Độ ẩm',
wind: 'Gió',
cloudCover: 'Tỉ lệ mây',
searchPlaceholder: 'Nhập tên thành phố...',
weatherNotFound: 'Không tìm thấy thành phố',
error: 'Lỗi khi lấy dữ liệu thời tiết',
useCurrentLocation: 'Sử dụng vị trí hiện tại',
},
fr: {
slogan: 'La seule prévision météo dont vous avez besoin',
humidity: 'Humidité',
wind: 'Vent',
cloudCover: 'Couverture nuageuse',
searchPlaceholder: 'Entrez le nom de la ville...',
weatherNotFound: 'Ville non trouvée',
error: 'Erreur lors de la récupération des données météo',
useCurrentLocation: 'Utiliser la localisation actuelle',
},
zh: {
slogan: '您需要的唯一天气预报',
humidity: '湿度',
wind: '风速',
cloudCover: '云覆盖',
searchPlaceholder: '请输入城市名称...',
weatherNotFound: '未找到城市',
error: '获取天气数据时出错',
useCurrentLocation: '使用当前定位',
},
};


function updateText(language) {
    document.querySelector('.slogan').textContent = translations[language].slogan;
    document.querySelector('input[type="text"]').placeholder = translations[language].searchPlaceholder;
    document.querySelector('.gps-button').title = translations[language].useCurrentLocation;
}


function changeLanguage(language) {
    currentLang = language; 
    updateText(language);
    updateWeatherInfoLabels(language);

    if (document.getElementById('searchInput').value) {
        searchWeather();
    } else {
        getRandomWeather();
    }
}

function updateWeatherInfoLabels(language) {
    const humidityText = translations[language].humidity;
    const windText = translations[language].wind;
    const cloudCoverText = translations[language].cloudCover;

    const weatherDetails = document.getElementById('details');
    weatherDetails.textContent = `${humidityText}: --% | ${windText}: -- km/h | ${cloudCoverText}: --%`;
}

