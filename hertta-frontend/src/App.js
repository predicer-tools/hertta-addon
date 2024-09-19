import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './global.css';
import './App.css';
import DeviceDataForm from './DeviceDataForm';
import DataTable from './DataTable';
import DeviceCards from './DeviceCards';
import InputDataSender from './InputDataSender';
import Layout from './Layout';
import HomeEnergyFlowVisualization from './HomeEnergyFlowVisualization';
import { fetchSensorsFromHomeAssistant } from './services/HomeAssistantInterface';
import generateJsonContent from './generateJsonContent'; // Import the JSON generation function

function App() {
  const [jsonContent, setJsonContent] = useState({});
  const [electricHeaters, setElectricHeaters] = useState([]);
  const [interiorAirSensors, setInteriorAirSensors] = useState([]);
  const [activeDevices, setActiveDevices] = useState({});
  const [apiKey, setApiKey] = useState(localStorage.getItem('homeAssistantApiKey') || ''); // Load API key from localStorage
  const [homeAssistantSensors, setHomeAssistantSensors] = useState([]); // Store Home Assistant sensors

  useEffect(() => {
    const defaultSensors = [
      {
        sensorId: 'sensor1',
        roomId: 'room1',
        roomWidth: 5,
        roomLength: 4,
        maxTemp: 298.15,
        minTemp: 288.15,
        t_e_conversion_int: 1,
        t_e_conversion_env: 1,
      },
      {
        sensorId: 'sensor2',
        roomId: 'room2',
        roomWidth: 6,
        roomLength: 5,
        maxTemp: 299.15,
        minTemp: 289.15,
        t_e_conversion_int: 1,
        t_e_conversion_env: 1,
      },
    ];

    const defaultHeaters = [
      {
        id: 'heater1',
        capacity: 2,
        roomId: 'room1',
      },
      {
        id: 'heater2',
        capacity: 3,
        roomId: 'room2',
      },
    ];

    setElectricHeaters(defaultHeaters);
    setInteriorAirSensors(defaultSensors);

    // Initialize active devices status
    const initialActiveDevices = {};
    defaultHeaters.forEach((heater) => (initialActiveDevices[heater.id] = true));
    defaultSensors.forEach((sensor) => (initialActiveDevices[sensor.sensorId] = true));
    setActiveDevices(initialActiveDevices);
  }, []);

  useEffect(() => {
    setJsonContent(generateJsonContent(electricHeaters, interiorAirSensors, activeDevices));
  }, [electricHeaters, interiorAirSensors, activeDevices]);

  // Save API key to localStorage and state
  const handleSaveApiKey = () => {
    localStorage.setItem('homeAssistantApiKey', apiKey); // Store API key in localStorage
    alert('API Key saved!');
  };

  // Fetch sensors from Home Assistant
  const fetchSensors = async () => {
    try {
      if (!apiKey) {
        alert('Please enter an API key');
        return;
      }
      console.log('Fetching sensors with API key:', apiKey);  // Debug print
  
      const sensors = await fetchSensorsFromHomeAssistant(apiKey); // Fetch sensors using the API key
      
      console.log('Fetched Sensors:', sensors);  // Debug print
      setHomeAssistantSensors(sensors); // Store sensors in state
  
      if (sensors.length === 0) {
        console.warn('No sensors were fetched from Home Assistant.');
      }
    } catch (error) {
      console.error('Failed to fetch sensors:', error);
    }
  };  

  const deleteHeater = (id) => {
    const updatedHeaters = electricHeaters.filter((heater) => heater.id !== id);
    setElectricHeaters(updatedHeaters);
  };

  const deleteSensor = (id) => {
    const updatedSensors = interiorAirSensors.filter((sensor) => sensor.sensorId !== id);
    setInteriorAirSensors(updatedSensors);
  };

  const toggleDeviceStatus = (id) => {
    setActiveDevices((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  return (
    <Router>
      <Layout>
        <div className="api-key-input">
          <h3>Enter Home Assistant API Key</h3>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)} // Update the API key state
            placeholder="Enter your Home Assistant API Key"
            style={{ padding: '10px', width: '80%', margin: '20px 0' }}
          />
          <button onClick={handleSaveApiKey} style={{ padding: '10px 20px' }}>Save API Key</button>

          {/* Add button to fetch sensors after API key is saved */}
          <button onClick={fetchSensors} style={{ padding: '10px 20px', marginLeft: '10px' }}>
            Fetch Sensors
          </button>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="app-container">
                <div className="left-side">
                  <h1>Device Data Entry</h1>
                  <DeviceDataForm
                    electricHeaters={electricHeaters}
                    setElectricHeaters={setElectricHeaters}
                    interiorAirSensors={interiorAirSensors}
                    setInteriorAirSensors={setInteriorAirSensors}
                    homeAssistantSensors={homeAssistantSensors}  // Pass fetched Home Assistant sensors
                  />
                </div>
                <div className="middle-section">
                  <div>
                    <h2>Generated JSON:</h2>
                    <pre>{JSON.stringify(jsonContent, null, 2)}</pre>
                  </div>
                </div>
                <div className="right-side">
                  <InputDataSender jsonContent={jsonContent} />
                </div>
              </div>
            }
          />
          <Route
            path="/data-table"
            element={
              <DataTable
                electricHeaters={electricHeaters}
                interiorAirSensors={interiorAirSensors}
                homeAssistantSensors={homeAssistantSensors}  // Pass Home Assistant sensors here
                deleteHeater={deleteHeater}
                deleteSensor={deleteSensor}
              />
            }
          />
          <Route
            path="/device-cards"
            element={
              <DeviceCards
                electricHeaters={electricHeaters}
                interiorAirSensors={interiorAirSensors}
                activeDevices={activeDevices}
                toggleDeviceStatus={toggleDeviceStatus}
              />
            }
          />
          {/* New Route for the Graph */}
          <Route
            path="/processes-graph"
            element={
              <div className="graph-container">
                <h1>Processes Graph</h1>
                <HomeEnergyFlowVisualization processes={jsonContent.processes || {}} />
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
