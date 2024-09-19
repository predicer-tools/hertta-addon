import React, { useEffect, useState } from 'react';
import './DeviceCards.css';
import { fetchSensorsFromHomeAssistant } from './services/HomeAssistantInterface'; // Import the service function

function DeviceCards({ electricHeaters, interiorAirSensors, activeDevices, toggleDeviceStatus, apiKey }) {
  const [homeAssistantSensors, setHomeAssistantSensors] = useState([]);

  useEffect(() => {
    if (apiKey) {
      // Fetch sensors data when the API key is provided
      const fetchData = async () => {
        const sensors = await fetchSensorsFromHomeAssistant(apiKey); // Pass the API key
        setHomeAssistantSensors(sensors);
      };
      fetchData();
    }
  }, [apiKey]); // Re-fetch when the API key changes

  // Helper function to get the current temperature of a sensor from Home Assistant
  const getSensorStatus = (sensorId) => {
    const hassSensor = homeAssistantSensors.find((sensor) => sensor.entity_id === `sensor.${sensorId}`);
    return hassSensor ? `${hassSensor.state} ${hassSensor.attributes.unit_of_measurement || ''}` : 'N/A';
  };

  return (
    <div className="device-cards">
      <h2>Device Cards</h2>
      <div className="cards-container">
        {electricHeaters.map((heater) => (
          <div key={heater.id} className="device-card">
            <h3>Heater ID: {heater.id}</h3>
            <p>Capacity: {heater.capacity}</p>
            <p>Room ID: {heater.roomId}</p>
            <label>
              <input 
                type="checkbox" 
                checked={activeDevices[heater.id]} 
                onChange={() => toggleDeviceStatus(heater.id)} 
              />
              On/Off
            </label>
            <p>Status: {activeDevices[heater.id] ? 'On' : 'Off'}</p>
          </div>
        ))}
        {interiorAirSensors.map((sensor) => (
          <div key={sensor.sensorId} className="device-card">
            <h3>Sensor ID: {sensor.sensorId}</h3>
            <p>Room ID: {sensor.roomId}</p>
            <p>Room Width: {sensor.roomWidth}m</p>
            <p>Room Length: {sensor.roomLength}m</p>
            <p>Max Temp: {(sensor.maxTemp - 273.15).toFixed(2)}°C</p>
            <p>Min Temp: {(sensor.minTemp - 273.15).toFixed(2)}°C</p>
            <label>
              <input 
                type="checkbox" 
                checked={activeDevices[sensor.sensorId]} 
                onChange={() => toggleDeviceStatus(sensor.sensorId)} 
              />
              On/Off
            </label>
            <p>Status: {activeDevices[sensor.sensorId] ? 'On' : 'Off'}</p>
            {/* Show current status from Home Assistant */}
            <p>Current Temperature: {getSensorStatus(sensor.sensorId)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceCards;
