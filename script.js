// Get HTML elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// Search weather by city
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    getCoordinates(city);
});

// Get coordinates of the city
async function getCoordinates(city) {

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        if (!data.results) {
            alert("City not found!");
            return;
        }

        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        const name = data.results[0].name;

        getWeather(latitude, longitude, name);

    } catch (error) {
        alert("Something went wrong!");
    }

}

// Get weather using latitude & longitude
async function getWeather(lat, lon, name) {

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        cityName.innerHTML = name;
        temperature.innerHTML = data.current.temperature_2m + "°C";
        humidity.innerHTML = data.current.relative_humidity_2m + "%";
        wind.innerHTML = data.current.wind_speed_10m + " km/h";

        description.innerHTML = getWeatherDescription(data.current.weather_code);

    } catch (error) {
        alert("Unable to fetch weather data.");
    }

}

// Weather code to text
function getWeatherDescription(code) {

    if (code === 0)
        return "Clear Sky";

    else if (code >= 1 && code <= 3)
        return "Partly Cloudy";

    else if (code >= 45 && code <= 48)
        return "Fog";

    else if (code >= 51 && code <= 67)
        return "Rain";

    else if (code >= 71 && code <= 77)
        return "Snow";

    else if (code >= 80 && code <= 82)
        return "Rain Showers";

    else if (code >= 95)
        return "Thunderstorm";

    else
        return "Cloudy";
}

// Current Location Button
locationBtn.addEventListener("click", () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            async function(position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const geoURL = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`;

                const response = await fetch(geoURL);
                const geoData = await response.json();

                const name = geoData.features
                    ? geoData.features[0].properties.city
                    : "Current Location";

                getWeather(latitude, longitude, name);

            },

            function() {
                alert("Location access denied.");
            }

        );

    } else {
        alert("Geolocation is not supported.");
    }

});