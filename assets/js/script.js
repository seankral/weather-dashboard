var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#form-input");
var currentWeatherEl = document.querySelector("#current-weather");

var WeatherArrText = ["Temp: ", "Wind: ", "Humidity: ", "UV Index: "]
var currentWeatherArr = [];

var forecastDates = []

var currentDay = moment().format('M/D/YYYY')

//for (var i = 0; i < 4; i++ ) {
    //var dates = moment().add(1, 'days')
    //forecastDates.push(dates)
//}

//console.log(forecastDates)


var formSubmitHandler = function (e) {
    e.preventDefault();

    // get value from form input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityCords(cityName);
    }

    cityFormEl.reset();

    // clear current content
    currentWeatherEl.innerHTML = "";

}

var getCityCords = function (city) {

    // create dynamic api url for lat and long
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=c4d612ec642b20bf888ccab96f3082e7"

    // make api request
    fetch(apiUrl).then(function (response) {
        // if successful
        if (response.ok) {
            response.json().then(function (data) {
                // pass lat and long to new api call
                getCurrentWeather(data.coord.lat, data.coord.lon, data.name);
                console.log(data)
            });
        }
        else {
            alert("Error: City Not Found.")
            currentWeatherEl.innerHTML = "";
        };
    })
        // if server error
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap")
        });
};

var getCurrentWeather = function (lat, lon, city) {

    // create dynamic url using lat and lon
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=c4d612ec642b20bf888ccab96f3082e7"

    // make api request
    fetch(apiUrl).then(function (response) {
        // if successful
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                // push needed data to empty array
                currentWeatherArr = [];
                currentWeatherArr.push(data.current.temp, data.current.wind_speed + " MPH", data.current.humidity + " %", data.current.uvi)
                displayWeather();
            });
        }
        else {
            alert("Error: City Not Found.")
        };
    })
        // if server error
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap")
        });

        // display name of city returned from api call
        var cityNameEl = document.createElement("h2");
        cityNameEl.className = "city-header";
        cityNameEl.textContent = city
        currentWeatherEl.appendChild(cityNameEl);
};

var displayWeather = function () {
    console.log(currentWeatherArr)

    var currentUl = document.createElement("ul");
    currentUl.className = "currentUl"
    currentWeatherEl.appendChild(currentUl);

    for (var i = 0; i < currentWeatherArr.length; i++) {

        // create list elements
        var currentLi = document.createElement("li")
        currentLi.className = "currentLi"
        currentLi.textContent = WeatherArrText[i] + currentWeatherArr[i]
        currentUl.appendChild(currentLi);
    };
}

cityFormEl.addEventListener("submit", formSubmitHandler)