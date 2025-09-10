const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((btn) => {
  btn.addEventListener("click", function () {
    const answer = btn.nextElementSibling;
    const isOpen = answer.style.display === "block";

    document.querySelectorAll(".faq-answer").forEach((el) => el.style.display = "none");
    document.querySelectorAll(".faq-question").forEach((el) => el.classList.remove("active"));

    if (!isOpen) {
      answer.style.display = "block";
      btn.classList.add("active");
    }
  });
});

var API_KEY = '36beadb815a87ce85848209fb63eef89';
var BASE_URL = 'https://api.openweathermap.org/data/2.5';

var searchInput = document.getElementById('search-input');
var searchBtn = document.getElementById('search-btn');
var weatherDetails = document.getElementById('weather-details');
var forecastContainer = document.getElementById('forecast-container');
var contactForm = document.getElementById('contact-form');

searchBtn.addEventListener('click', function () {
    var city = searchInput.value.trim();
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        updateMeteoblueWidget(city);
    }
});

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var city = searchInput.value.trim();
        if (city) {
            getCurrentWeather(city);
            getForecast(city);
            updateMeteoblueWidget(city);
        }
    }
});

// Get weather by coordinates
function getWeatherByCoords(lat, lon) {
    fetch(BASE_URL + '/weather?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                getForecastByCoords(lat, lon);
                updateMeteoblueWidget(data.name);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(function (error) {
            showError('Error fetching current weather: ' + error.message);
        });
}

// Get forecast by coordinates
function getForecastByCoords(lat, lon) {
    fetch(BASE_URL + '/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.cod === "200") {
                displayForecast(data);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(function (error) {
            showError('Error fetching forecast: ' + error.message);
        });
}

// Get current weather data
function getCurrentWeather(city) {
    fetch(BASE_URL + '/weather?q=' + city + '&appid=' + API_KEY + '&units=metric')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.cod === 200) {
                displayCurrentWeather(data);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(function (error) {
            showError('Error fetching current weather: ' + error.message);
        });
}

// Get 5-day forecast data
function getForecast(city) {
    fetch(BASE_URL + '/forecast?q=' + city + '&appid=' + API_KEY + '&units=metric')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.cod === "200") {
                displayForecast(data);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(function (error) {
            showError('Error fetching forecast: ' + error.message);
        });
}

// Display current weather
function displayCurrentWeather(data) {
    var weatherHTML = '<div class="weather-card">' +
        '<h3 class="city">' + data.name + ', ' + data.sys.country + '</h3>' +
        '<div class="weather-data">' +
        '<img src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png" alt="' + data.weather[0].description + '">' +
        '<p class="temperature">' + Math.round(data.main.temp) + '°C</p>' +
        '<p class="description">' + data.weather[0].description + '</p>' +
        '<div class="details">' +
        '<p>Humidity: ' + data.main.humidity + '%</p>' +
        '<p>Wind: ' + data.wind.speed + ' m/s</p>' +
        '</div>' +
        '</div>' +
        '</div>';
    weatherDetails.innerHTML = weatherHTML;
}

// Display 5-day forecast
function displayForecast(data) {
    var dailyForecasts = data.list.filter(function (item) { return item.dt_txt.includes('12:00:00'); });
    var forecastHTML = dailyForecasts.map(function (day) {
        return '<div class="col">' +
            '<div class="forecast-card">' +
            '<h4 class="mb-2">' + new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }) + '</h4>' +
            '<img src="https://openweathermap.org/img/wn/' + day.weather[0].icon + '.png" alt="' + day.weather[0].description + '">' +
            '<p class="temp">' + Math.round(day.main.temp) + '°C</p>' +
            '</div>' +
            '</div>';
    }).join('');
    forecastContainer.innerHTML = forecastHTML;
}

// Error handling
function showError(message) {
    weatherDetails.innerHTML = '<div class="error-message"><p>' + message + '</p></div>';
    forecastContainer.innerHTML = '';
}

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section"); // Ambil semua section
    const navLinks = document.querySelectorAll(".nav-link"); // Ambil semua link navbar

    function activateNavLink() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 200; // Menghitung posisi section (70px untuk navbar)
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id"); // Dapatkan ID section yang aktif
            }
        });

        // Update class "active" pada navbar
        navLinks.forEach((link) => {
            link.classList.remove("active-scroll"); // Hapus semua class aktif
            if (link.getAttribute("href").substring(1) === currentSection) {
                link.classList.add("active-scroll"); // Tambahkan class aktif ke link yang sesuai
            }
        });
    }

    window.addEventListener("scroll", activateNavLink); // Jalankan fungsi saat scrolling
});
