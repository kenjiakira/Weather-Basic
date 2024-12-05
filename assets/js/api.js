const API_KEY = '1230a8fdc6457603234c68ead5f3f967';
const RANDOM_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Moscow'];

async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getWeatherByCity(city) {
    return fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
}

async function getWeatherByCoords(lat, lon) {
    return fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
}

async function getForecastData(lat, lon) {
    return fetchWeatherData(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${API_KEY}&units=metric`);
}