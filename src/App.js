import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faSun, faCloudRain, faSnowflake, faSmog } from '@fortawesome/free-solid-svg-icons';


function App() {
  // State to store the entered city name
  const [city, setCity] = useState('');
  
  // State to store the fetched weather data
  const [weather, setWeather] = useState(null);
  
  // Reference to the input field to set focus
  const inputRef = useRef(null);

  // Function to fetch weather data from the WeatherAPI
  const fetchWeather = async () => {
    if (!city) return; // Return if city is empty
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // Get API key from environment variable
      console.log("API Key:", apiKey); // Debugging: Check if API key is loaded
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
      const data = await response.json();
      if (response.ok) {
        setWeather(data); // Set weather data if fetch is successful
      } else {
        setWeather(null); // Clear weather data if city is not found
      }
    } catch (error) {
      console.error('Error fetching weather:', error); // Log any errors
      setWeather(null); // Clear weather data on error
    }
  };

  // Return Weather Icons
  const getWeatherIcon = (description) => {
    if (description.includes("rain")) return faCloudRain;
    if (description.includes("cloud")) return faCloud;
    if (description.includes("clear") || description.includes("sunny")) return faSun;
    if (description.includes("snow")) return faSnowflake;
    if (description.includes("mist") || description.includes("fog")) return faSmog;
    return faCloud; // default icon
  };
  

  // Update city state on input field change
  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  // Call fetchWeather when button is clicked
  const handleButtonClick = () => {
    fetchWeather();
  };

  // Set focus to the input field on component mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={handleInputChange}
        ref={inputRef}
        placeholder="Enter a city"
        style={{ padding: '10px', width: '200px' }}
      />
      <button onClick={handleButtonClick} style={{ padding: '10px 20px', marginLeft: '10px' }}>
        Get Weather
      </button>
      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h2>Weather in {weather.location.name}</h2>
              <div className="weather-icon">
                <FontAwesomeIcon icon={getWeatherIcon(weather.current.condition.text.toLowerCase())} size="4x" />
              </div>
          <p>Temperature: {weather.current.temp_c}°C</p>
          <p>Weather: {weather.current.condition.text}</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind Speed: {weather.current.wind_kph} kph</p>
        </div>
      )}
    </div>
  );
}

export default App;
