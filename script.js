const API = {
  geocoding: "https://geocoding-api.open-meteo.com/v1/search",
  forecast: "https://api.open-meteo.com/v1/forecast"
};

const state = {
  unit: "C",
  location: { name: "Chennai", admin1: "Tamil Nadu", country: "India", latitude: 13.0827, longitude: 80.2707, timezone: "Asia/Kolkata" },
  forecast: null
};

const $ = (id) => document.getElementById(id);

const weatherDescriptions = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Moderate drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
  56: ["Light freezing drizzle", "🌧️"], 57: ["Dense freezing drizzle", "🌧️"],
  61: ["Slight rain", "🌦️"], 63: ["Moderate rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  66: ["Light freezing rain", "🌧️"], 67: ["Heavy freezing rain", "🌧️"],
  71: ["Slight snowfall", "🌨️"], 73: ["Moderate snowfall", "🌨️"], 75: ["Heavy snowfall", "❄️"], 77: ["Snow grains", "🌨️"],
  80: ["Slight rain showers", "🌦️"], 81: ["Moderate rain showers", "🌧️"], 82: ["Violent rain showers", "⛈️"],
  85: ["Slight snow showers", "🌨️"], 86: ["Heavy snow showers", "❄️"],
   /* WMO thunderstorm codes */
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with heavy hail", "⛈️"]
};

function weatherInfo(code) {
  return weatherDescriptions[code] || ["Weather conditions", "🌤️"];
}

function temp(value) {
  if (!Number.isFinite(value)) return "--";
  const converted = state.unit === "F" ? (value * 9 / 5) + 32 : value;
  return Math.round(converted);
}

function formatTemp(value) {
  return `${temp(value)}°`;
}

function setStatus(message = "", isError = false) {
  const el = $("statusMessage");
  el.textContent = message;
  el.classList.toggle("error", isError);
}

function formatDate(dateString, options) {
  return new Intl.DateTimeFormat(undefined, options).format(new Date(dateString));
}

function uvLabel(value) {
  if (value < 3) return "Low · Minimal protection";
  if (value < 6) return "Moderate · Seek shade";
  if (value < 8) return "High · Protection advised";
  if (value < 11) return "Very high · Extra care";
  return "Extreme · Avoid midday sun";
}

async function searchCity(city) {
  const url = new URL(API.geocoding);
  url.search = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not search for this city. Please try again.");
  const data = await response.json();
  if (!data.results || !data.results.length) throw new Error(`No city found for "${city}". Try another spelling.`);
  const place = data.results[0];
  return {
    name: place.name,
    admin1: place.admin1 || "",
    country: place.country || "",
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone || "auto"
  };
}

async function getForecast(location) {
  const url = new URL(API.forecast);
  url.search = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset",
    timezone: location.timezone || "auto",
    forecast_days: "5",
    wind_speed_unit: "kmh"
  });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather data is temporarily unavailable. Please try again.");
  const data = await response.json();
  if (!data.current || !data.daily) throw new Error("The weather service returned incomplete data.");
  return data;
}

function renderWeather() {
  const data = state.forecast;
  if (!data) return;
  const current = data.current;
  const daily = data.daily;
  const location = state.location;
  const locationParts = [location.name, location.admin1, location.country].filter(Boolean);
  $("cityName").textContent = locationParts.join(", ");
  $("currentDate").textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: location.timezone === "auto" ? undefined : location.timezone
  }).format(new Date());

  const [description, icon] = weatherInfo(current.weather_code);
  $("currentTemp").textContent = temp(current.temperature_2m);
  $("tempUnit").textContent = `°${state.unit}`;
  $("conditionText").textContent = description;
  $("weatherIllustration").textContent = icon;
  $("feelsLike").textContent = formatTemp(current.apparent_temperature);
  $("todayHigh").textContent = formatTemp(daily.temperature_2m_max[0]);
  $("todayLow").textContent = formatTemp(daily.temperature_2m_min[0]);
  $("humidity").textContent = Math.round(current.relative_humidity_2m ?? 0);
  $("windSpeed").textContent = Math.round(current.wind_speed_10m ?? 0);
  $("rainChance").textContent = Math.round(daily.precipitation_probability_max?.[0] ?? 0);
  const uv = daily.uv_index_max?.[0];
  $("uvIndex").textContent = Number.isFinite(uv) ? Math.round(uv * 10) / 10 : "--";
  $("uvNote").textContent = Number.isFinite(uv) ? uvLabel(uv) : "Today's maximum";
  $("sunshineText").textContent = current.is_day ? "☀ Daytime conditions" : "☾ Night-time conditions";
  $("year").textContent = new Date().getFullYear();

  const forecastList = $("forecastList");
  forecastList.innerHTML = "";
  daily.time.slice(0, 5).forEach((date, index) => {
    const [dayDescription, dayIcon] = weatherInfo(daily.weather_code[index]);
    const dayName = index === 0 ? "Today" : formatDate(date, { weekday: "short" });
    const card = document.createElement("article");
    card.className = `forecast-day${index === 0 ? " today" : ""}`;
    card.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="day-icon" aria-hidden="true">${dayIcon}</div>
      <div class="day-condition">${dayDescription}</div>
      <div class="day-temps"><strong>${formatTemp(daily.temperature_2m_max[index])}</strong><span>${formatTemp(daily.temperature_2m_min[index])}</span></div>
    `;
    forecastList.appendChild(card);
  });
}

async function loadLocation(location) {
  setStatus("Fetching live weather data…");
  $("cityName").textContent = location.name;
  try {
    const forecast = await getForecast(location);
    state.location = location;
    state.forecast = forecast;
    renderWeather();
    setStatus(`Updated for ${location.name}. Forecast data can change as weather models refresh.`);
  } catch (error) {
    setStatus(error.message || "Something went wrong while loading weather.", true);
  }
}

$("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = $("cityInput").value.trim();
  if (!city) {
    setStatus("Enter a city name to search.", true);
    $("cityInput").focus();
    return;
  }
  setStatus("Searching for city…");
  try {
    const location = await searchCity(city);
    await loadLocation(location);
    $("cityInput").value = "";
  } catch (error) {
    setStatus(error.message || "Could not find that city.", true);
  }
});

document.querySelectorAll("[data-city]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      const location = await searchCity(button.dataset.city);
      await loadLocation(location);
    } catch (error) {
      setStatus(error.message || "Could not load that city.", true);
    }
  });
});

$("unitToggle").addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  $("unitToggle").innerHTML = state.unit === "C" ? "°C <span>/</span> °F" : "°F <span>/</span> °C";
  renderWeather();
});

$("homeNav").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  loadLocation(state.location);
});

$("locationButton").addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    setStatus("Your browser does not support location services. Search for a city instead.", true);
    return;
  }
  setStatus("Requesting location permission…");
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const location = { name: "Your location", admin1: "", country: "", latitude, longitude, timezone: "auto" };
    // Reverse geocoding is optional: weather works directly from coordinates.
    await loadLocation(location);
  }, () => {
    setStatus("Location permission was not granted. You can search for a city instead.", true);
  }, { enableHighAccuracy: false, timeout: 10000 });
});

$("year").textContent = new Date().getFullYear();
loadLocation(state.location);
