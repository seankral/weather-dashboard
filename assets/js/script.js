var cityFormEl = document.querySelector("#city-form")
var cityInputEl = document.querySelector("#form-input")
var currentWeatherEl = document.querySelector("#current-weather")

var formSubmitHandler = function (e) {
    e.preventDefault();

    // get value from form input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityCords(cityName);
    }

    cityFormEl.reset();
}

var getCityCords = function (city) {

    // format dynamic api url for lat and long
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=c4d612ec642b20bf888ccab96f3082e7"

    // make api request
    fetch(apiUrl).then(function (response) {
        // if successful
        if (response.ok) {
            response.json().then(function (data) {
                // pass lat and long to new api call
                getCurrentWeather(data.coord.lat, data.coord.lon);
                console.log(data)
            });
        }
        else {
            alert("Error: City Not Found.")
        };
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap")
        });
};

var getCurrentWeather = function (lat, lon) {
    
    // create dynamic url using lat and lon
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=c4d612ec642b20bf888ccab96f3082e7"

    // make api request
    fetch(apiUrl).then(function (response) {
        // if successful
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
            });
        }
        else {
            alert("Error: City Not Found.")
        };
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap")
        });
};

var displayWeather = function () {
    
    
}

cityFormEl.addEventListener("submit", formSubmitHandler)