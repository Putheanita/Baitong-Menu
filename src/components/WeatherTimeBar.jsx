import { useState, useEffect } from "react";
import { formatKhmerFullDate, formatKhmerTime, toKhmerDigits } from "../utils/khmerDate";
import "./WeatherTimeBar.css";

// Helper to map Open-Meteo weather codes to emoji and Khmer description
function getWeatherDescription(code) {
  if (code === 0) return { icon: "☀️", text: "មេឃស្រឡះ" };
  if (code === 1 || code === 2) return { icon: "🌤️", text: "មេឃស្រឡះល្អ" };
  if (code === 3) return { icon: "⛅", text: "មានពពកខ្លះ" };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "មានអ័ព្ទ" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", text: "មានភ្លៀងរលឹម" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", text: "មានភ្លៀងធ្លាក់" };
  if (code >= 71 && code <= 77) return { icon: "🌨️", text: "ត្រជាក់ខ្លាំង" };
  if (code >= 80 && code <= 82) return { icon: "🌦️", text: "មានភ្លៀងកក់ខែ" };
  if (code >= 95 && code <= 99) return { icon: "⛈️", text: "មានផ្គររន្ទះ" };
  return { icon: "🌤️", text: "ក្ដៅស្រឡះ" };
}

export default function WeatherTimeBar() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [locationLabel] = useState("រាជធានីភ្នំពេញ កម្ពុជា");
  const [tzLabel] = useState("🇰🇭 ម៉ោងនៅភ្នំពេញ (GMT+7)");

  const [weather, setWeather] = useState({
    locationName: "រាជធានីភ្នំពេញ កម្ពុជា",
    temp: 31,
    condition: "មេឃស្រឡះ",
    icon: "⛅",
    humidity: 72,
    loading: true
  });

  // Live ticking clock in authentic Khmer date & time format
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(formatKhmerTime(now, true));
      setCurrentDate(formatKhmerFullDate(now));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real-time weather for Phnom Penh
  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=11.5564&longitude=104.9282&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FPhnom_Penh`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather network error");
        const data = await res.json();

        if (isMounted && data.current) {
          const current = data.current;
          const { icon, text } = getWeatherDescription(current.weather_code);
          setWeather({
            locationName: "រាជធានីភ្នំពេញ កម្ពុជា",
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
            locationName: "រាជធានីភ្នំពេញ កម្ពុជា",
            temp: 31,
            humidity: 74,
            condition: "ក្ដៅស្រឡះល្អ",
            icon: "⛅",
            loading: false
          });
        }
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 600000);

    return () => {
      isMounted = false;
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div className="weather-time-strip" style={{ fontFamily: "'Dangrek', 'Battambang', cursive" }}>
      <div className="weather-time-content">
        
        {/* Left: Location & Live Weather */}
        <div className="weather-item">
          <span className="wt-location wt-hide-mobile">📍 {locationLabel}</span>
          <span className="wt-location wt-show-mobile">📍 ភ្នំពេញ</span>
          <span className="wt-icon">{weather.icon}</span>
          <span className="wt-temp">{toKhmerDigits(weather.temp)}°C</span>
          <span className="wt-desc wt-hide-mobile">{weather.condition}</span>
          <span className="wt-humidity wt-hide-mobile">💧 {toKhmerDigits(weather.humidity)}%</span>
        </div>

        {/* Right: Local Phnom Penh Time & Live Clock */}
        <div className="time-item">
          <span className="wt-tz-badge wt-hide-mobile">{tzLabel}</span>
          <span className="wt-date wt-hide-mobile">📅 {currentDate}</span>
          <span className="wt-clock">🕒 <strong>{currentTime}</strong></span>
        </div>

      </div>
    </div>
  );
}
