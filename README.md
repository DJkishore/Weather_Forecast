# SkyCast — Weather Forecast Website

A responsive weather dashboard built with **HTML, CSS and vanilla JavaScript**. It uses the public Open-Meteo Geocoding and Forecast APIs to display current conditions and a 5-day forecast.

## Features

- Live weather for a searched city
- Current temperature, feels-like temperature and weather condition
- Humidity, wind speed, rain probability and UV index
- 5-day high/low forecast
- Celsius/Fahrenheit toggle
- Quick city shortcuts (Chennai, Bengaluru, Mumbai and New Delhi)
- Optional browser geolocation (requires permission and a secure context such as localhost/HTTPS)
- Loading and error messages
- Responsive desktop and mobile layout
- No API key required for non-commercial learning use

## Project files

```text
weather-forecast-website/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

### Option A — VS Code + Live Server (recommended)

1. Download and extract `weather-forecast-website.zip`.
2. Open the extracted folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and select **Open with Live Server**.
5. Your browser should open the dashboard. Search for a city such as Chennai or London.

### Option B — Python local server

If Python is installed, open a terminal in the project folder and run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500` in your browser.

> Opening the HTML file directly may work for basic weather requests, but a local server is recommended, especially for browser geolocation.

## API integration

This project uses:

- **Geocoding:** `https://geocoding-api.open-meteo.com/v1/search` converts a city name into coordinates.
- **Forecast:** `https://api.open-meteo.com/v1/forecast` returns current conditions and daily forecast data.

No API key is required for non-commercial use. Please review the provider's current terms before deploying a commercial service. Credit the data provider as shown in the website footer.

Documentation:
- https://open-meteo.com/en/docs
- https://open-meteo.com/en/docs/geocoding-api

## Upload to GitHub

### Create a new repository

1. Sign in to GitHub and click **New repository**.
2. Name it `weather-forecast-website`.
3. Choose Public or Private as needed.
4. Click **Create repository**. Do not add a README if you already have this project's README locally (or keep it and resolve the merge if you do).

### Push with Git

Open a terminal inside the extracted project folder and run these commands, replacing `YOUR-USERNAME` with your GitHub username:

```bash
git init
git add .
git commit -m "Build SkyCast weather forecast website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/weather-forecast-website.git
git push -u origin main
```

If Git says `remote origin already exists`, run:

```bash
git remote -v
git remote set-url origin https://github.com/YOUR-USERNAME/weather-forecast-website.git
git push -u origin main
```

If the GitHub repository already contains files and the push is rejected, first check that you are using the correct repository. Then integrate its changes before pushing:

```bash
git pull --rebase origin main
git push -u origin main
```

If Git reports unrelated histories or a conflict, stop and resolve the message shown by Git rather than force-pushing and potentially overwriting remote work.

## Publish with GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then click **Save**.
5. Wait for the Pages deployment to finish. The published URL will look like `https://YOUR-USERNAME.github.io/weather-forecast-website/`.

Because this is a static website, it does not need a build step.

## Troubleshooting

- **Weather does not load:** check your internet connection and try again.
- **City not found:** try the city name in English or include a more specific name.
- **Location button fails:** allow location permission and use localhost or an HTTPS site; city search works without location permission.
- **Git push rejected:** read the Git message carefully; do not use `git push --force` unless you intentionally want to overwrite remote history.
- **API unavailable:** the app displays an error message; try again later.

## Technologies

HTML5 · CSS3 · JavaScript Fetch API · JSON · Open-Meteo API · Git · GitHub Pages
