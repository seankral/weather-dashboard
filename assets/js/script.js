var cityFormEl = document.querySelector("#city-form")
var cityInputEl = document.querySelector("#form-input")

var formSubmitHandler = function (e) {
    e.preventDefault();

    // get value from form input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityCurrent(cityName);
    }

    cityFormEl.reset();
}

var getCityCurrent = function (city) {

    // format dynamic api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=c4d612ec642b20bf888ccab96f3082e7"

    // make url request
    fetch(apiUrl).then(function (response) {
        // if successful
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data, city);
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

var displayWeather = function (weather, city) {

    console.log(weather)
}

cityFormEl.addEventListener("submit", formSubmitHandler)