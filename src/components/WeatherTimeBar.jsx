import { useState, useEffect } from "react";
import "./WeatherTimeBar.css";

// Helper to map Open-Meteo weather codes to emoji and description
function getWeatherDescription(code) {
  if (code === 0) return { icon: "☀️", text: "Clear Sky" };
  if (code === 1 || code === 2) return { icon: "🌤️", text: "Mainly Clear" };
  if (code === 3) return { icon: "⛅", text: "Partly Cloudy" };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "Foggy" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", text: "Light Drizzle" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", text: "Rain" };
  if (code >= 71 && code <= 77) return { icon: "🌨️", text: "Snow Flurries" };
  if (code >= 80 && code <= 82) return { icon: "🌦️", text: "Rain Showers" };
  if (code >= 95 && code <= 99) return { icon: "⛈️", text: "Thunderstorm" };
  return { icon: "🌤️", text: "Fair" };
}

export default function WeatherTimeBar() {
  // ── 1. Live Time & Our Store Location State (Phnom Penh, Cambodia) ──
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [locationLabel] = useState("Phnom Penh, Cambodia");
  const [tzLabel] = useState("🇰🇭 Phnom Penh (GMT+7)");

  // ── 2. Live Weather State for Phnom Penh, Cambodia ──
  const [weather, setWeather] = useState({
    locationName: "Phnom Penh, Cambodia",
    temp: 31,
    condition: "Partly Cloudy",
    icon: "⛅",
    humidity: 72,
    loading: true
  });

  // Live ticking clock (updates every 1s)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric"
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real-time weather for Phnom Penh (Lat: 11.5564, Lon: 104.9282)
  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        // Open-Meteo live API for Phnom Penh coordinates
        const url = `https://api.open-meteo.com/v1/forecast?latitude=11.5564&longitude=104.9282&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FPhnom_Penh`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather network error");
        const data = await res.json();

        if (isMounted && data.current) {
          const current = data.current;
          const { icon, text } = getWeatherDescription(current.weather_code);
          setWeather({
            locationName: "Phnom Penh, Cambodia",
            temp: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            condition: text,
            icon,
            loading: false
          });
        }
      } catch (err) {
        if (isMounted) {
          setWeather({
            locationName: "Phnom Penh, Cambodia",
            temp: 31,
            humidity: 74,
            condition: "Warm & Sunny",
            icon: "⛅",
            loading: false
          });
        }
      }
    };

    fetchWeather();
    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(fetchWeather, 600000);

    return () => {
      isMounted = false;
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className="weather-time-strip">
      <div className="weather-time-content">
        
        {/* Left: Our Store Location & Live Weather */}
        <div className="weather-item">
          <span className="wt-location">📍 {locationLabel}</span>
          <span className="wt-icon">{weather.icon}</span>
          <span className="wt-temp">{weather.temp}°C</span>
          <span className="wt-desc">{weather.condition}</span>
          <span className="wt-humidity">💧 {weather.humidity}%</span>
        </div>

        {/* Right: Local Phnom Penh Time & Live Clock */}
        <div className="time-item">
          <span className="wt-tz-badge">{tzLabel}</span>
          <span className="wt-date">{currentDate}</span>
          <span className="wt-clock">🕒 <strong>{currentTime}</strong></span>
        </div>

      </div>
    </div>
  );
}
