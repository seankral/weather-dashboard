var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#form-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastWeatherEl = document.querySelector("#five-day");
var savedSearches = document.querySelector("#saved-searches")

var weatherArrText = ["", "Temp: ", "Wind: ", "Humidity: ", "UV Index: "]
var currentWeatherArr = [];
var forecastWeatherArr = [];

var searches = [];

var forecastDates = []

var currentDay = moment().format('M/D/YYYY')
var dates = moment().format('M/D/YYYY')

for (var i = 1; i < 6; i++) {
    dates = moment().add(i, 'd').format('M/D/YYYY')
    forecastDates.push(dates)
}

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
                saveCities(data.name);
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
                // set array to empty
                currentWeatherArr = [];
                // push current weather data to array
                currentWeatherArr.push(data.current.weather[0].icon, data.current.temp + " ℉", data.current.wind_speed + " MPH", data.current.humidity + " %", data.current.uvi)
                // set array to empty
                forecastWeatherArr = [];
                // store forecast data inside an object
                for (var i = 0; i < 5; i++) {
                    var forecastData = {
                        icon: data.daily[i].weather[0].icon,
                        temp: data.daily[i].temp.day + " ℉",
                        wind: data.daily[i].wind_speed + " MPH",
                        humidity: data.daily[i].humidity + " %"
                    }
                    // push object to array
                    forecastWeatherArr.push(forecastData)
                }
                displayWeatherCurrent();
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

    currentWeatherEl.innerHTML = "";
    // display name of city returned from api call
    var cityNameEl = document.createElement("h2");
    cityNameEl.className = "city-header";
    cityNameEl.textContent = city + " " + currentDay
    currentWeatherEl.appendChild(cityNameEl);
};

var displayWeatherCurrent = function () {

    // create ul list element
    var currentUl = document.createElement("ul");
    currentUl.className = "currentUl"
    // append ul to static container
    currentWeatherEl.appendChild(currentUl);

    // create url to display icon
    var currentIcon = document.createElement("img")
    currentIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + currentWeatherArr[0] + ".png")
    currentUl.appendChild(currentIcon)

    for (var i = 1; i < currentWeatherArr.length; i++) {

        // create list elements
        var currentLi = document.createElement("li")
        currentLi.className = "currentLi"
        currentLi.textContent = weatherArrText[i] + currentWeatherArr[i]
        currentUl.appendChild(currentLi);
    };

    displayWeatherForecast();
}

var displayWeatherForecast = function () {

    forecastWeatherEl.innerHTML = "";

    for (var i = 0; i < forecastWeatherArr.length; i++) {

        var forecastUl = document.createElement("ul");
        forecastUl.className = "ulEl";
        forecastWeatherEl.appendChild(forecastUl);

        var date = document.createElement("li");
        date.className = "liEl";
        date.textContent = forecastDates[i];
        forecastUl.appendChild(date);

        var forecastImg = document.createElement("img");
        forecastImg.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastWeatherArr[i].icon + ".png");
        forecastUl.appendChild(forecastImg);

        var temp = document.createElement("li");
        temp.className = "liEl";
        temp.textContent = weatherArrText[1] + forecastWeatherArr[i].temp;
        forecastUl.appendChild(temp);

        var wind = document.createElement("li");
        wind.className = "liEl";
        wind.textContent = weatherArrText[2] + forecastWeatherArr[i].wind;
        forecastUl.appendChild(wind);

        var humidity = document.createElement("li")
        humidity.className = "liEl"
        humidity.textContent = weatherArrText[3] + forecastWeatherArr[i].humidity
        forecastUl.appendChild(humidity)

    }
};

var saveCities = function (city) {
    

    if (localStorage.getItem('searches') === null) {
        var searchesObj = {
            city: city
        };
        searches.push(searchesObj)
        localStorage.setItem("searches", JSON.stringify(searches))
    }
    else {
        searches = localStorage.getItem('searches')

        searches = JSON.parse(searches)

        var searchesObj = {
            city: city
        };
        searches.push(searchesObj)
        localStorage.setItem("searches", JSON.stringify(searches))
    };
    displaySearches();
};

var displaySearches = function () {
    savedSearches.innerHTML = "";

    searches = localStorage.getItem("searches");

    searches = JSON.parse(searches);

    if (searches !== null) {
        for (var i = 0; i < searches.length; i++) {

            // create li elements 
            var searchedCity = document.createElement("button")
            searchedCity.setAttribute("type", "button")
            searchedCity.className = "searched-city-btn"
            searchedCity.textContent = searches[i].city
            savedSearches.appendChild(searchedCity)
        }
    }
    else {
        cityFormEl.addEventListener("submit", formSubmitHandler)
    }
}

var responding = function (event) {

    getCityCords(event.target.textContent)

}

displaySearches();

savedSearches.addEventListener("click", responding)

cityFormEl.addEventListener("submit", formSubmitHandler)