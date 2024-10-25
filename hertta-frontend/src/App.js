import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './global.css';
import './App.css';
import FormRoom from './FormRoom';
import DataTable from './DataTable';
import Layout from './Layout';
import HomeEnergyFlowVisualization from './HomeEnergyFlowVisualization';
import JsonViewer from './JsonViewer';
import generateJsonContent from './generateJsonContent';
import generateProcessesData from './Input_Processes';
import FormElectricHeater from './FormElectricHeater';
import DeviceCards from './DeviceCards';

function App() {
  const [jsonContent, setJsonContent] = useState({});
  const [electricHeaters, setElectricHeaters] = useState([]);
  const [processes, setProcesses] = useState({});
  const [rooms, setRooms] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('homeAssistantApiKey') || '');
  const [homeAssistantSensors, setHomeAssistantSensors] = useState([]);
  const [fetchedDevices, setFetchedDevices] = useState([]);
  const [activeDevices, setActiveDevices] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // New state for messages

  useEffect(() => {
    setJsonContent(generateJsonContent(electricHeaters, rooms, activeDevices));
  }, [electricHeaters, rooms, activeDevices]);

  useEffect(() => {
    if (electricHeaters.length > 0) {
      const processData = generateProcessesData(electricHeaters);
      setProcesses(processData);
    }
  }, [electricHeaters]);

  const handleSaveApiKey = () => {
    localStorage.setItem('homeAssistantApiKey', apiKey);
    alert('API Key saved!');
  };

  const fetchAllDevicesAndSensors = async () => {
    if (!apiKey) {
      setError('API key is missing. Please enter your API key.');
      return;
    }
    try {
      const response = await fetch('http://192.168.129.96:8123/api/states', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const sensors = data.filter(entity => entity.entity_id.startsWith('sensor.'));
      const nonSensorDevices = data.filter(entity => !entity.entity_id.startsWith('sensor.'));

      setHomeAssistantSensors(sensors);
      setFetchedDevices(nonSensorDevices); // Store all devices
      setError(null);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError(error.message);
    }
  };

  const addRoom = (room) => {
    const selectedSensorData = homeAssistantSensors.find(sensor => sensor.entity_id === room.sensorId);
    const updatedRoom = {
      ...room,
      sensorState: selectedSensorData ? selectedSensorData.state : 'N/A',
      sensorUnit: selectedSensorData ? selectedSensorData.attributes.unit_of_measurement : '',
    };
    setRooms([...rooms, updatedRoom]);

      // Set the new room as active by default
    setActiveDevices((prevStatus) => ({
      ...prevStatus,
      [room.sensorId]: true,
    }));
  };

  const addElectricHeater = (heater) => {
    setElectricHeaters([...electricHeaters, heater]);
  
    // Set the new heater as active by default
    setActiveDevices((prevStatus) => ({
      ...prevStatus,
      [heater.id]: true,
    }));
  };

  const deleteRoom = (sensorId) => {
    const updatedRooms = rooms.filter((room) => room.sensorId !== sensorId);
    setRooms(updatedRooms);
  };

  const deleteHeater = (id) => {
    const updatedHeaters = electricHeaters.filter((heater) => heater.id !== id);
    setElectricHeaters(updatedHeaters);
  };

  const toggleDeviceStatus = (id) => {
    setActiveDevices((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  // New function to handle optimization
  const handleStartOptimize = () => {
    if (electricHeaters.length === 0) {
      setMessage('Devices not defined');
      return;
    }

    setMessage(''); // Clear any previous messages

    // Prepare the OptimizationData
    const optimizationData = {
      fetch_weather_data: true,
      fetch_elec_data: true,
      fetch_time_data: false,
      country: "FI",
      location: "Hervanta",
      timezone: null,
      elec_price_source: "Elering",
      model_data: jsonContent,
      time_data: null,
      weather_data: null,
      elec_price_data: null,
      control_results: null,
      input_data_batch: null,
    };

    // Send the data to the backend
    fetch('http://127.0.0.1:3030/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(optimizationData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok, status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received optimization data:', data);
        setMessage('Optimization successful!'); // You can update this message as needed
        // Handle the response data as needed
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Error occurred: ' + error.toString());
      });
  };

  return (
    <Router>
      <Layout>
        <div className="device-form">
          <h3>Enter Home Assistant API Key</h3>
          <div className="input-group">
            <label htmlFor="api-key">API Key</label>
            <input
              type="text"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Home Assistant API Key"
            />
          </div>
          <button onClick={handleSaveApiKey}>Save API Key</button>
          <button onClick={fetchAllDevicesAndSensors}>Fetch Sensors and Devices</button>
          {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="app-container">
                <div className="left-side">
                  <h1>Device Data Entry</h1>
                  <FormRoom addRoom={addRoom} homeAssistantSensors={homeAssistantSensors} />
                  <FormElectricHeater addElectricHeater={addElectricHeater} rooms={rooms} fetchedDevices={fetchedDevices} />
                </div>
                <div className="right-side">
                  <button onClick={handleStartOptimize}>Start Optimize</button>
                  {message && <p>{message}</p>}
                </div>
              </div>
            }
          />
          <Route
            path="/device-cards"
            element={
              <div>
                <DataTable
                  electricHeaters={electricHeaters}
                  rooms={rooms}
                  homeAssistantSensors={homeAssistantSensors}
                  fetchedDevices={fetchedDevices}
                  deleteHeater={deleteHeater}
                  deleteRoom={deleteRoom}
                />
              </div>
            }
          />
          <Route
            path="/processes-graph"
            element={
              <div className="graph-container">
                <h1>Processes Graph</h1>
                <HomeEnergyFlowVisualization processes={processes} />
              </div>
            }
          />
          <Route
            path="/json-viewer"
            element={<JsonViewer jsonContent={jsonContent} />}
          />
          <Route
            path="/electric-heaters"
            element={
              <DeviceCards
                electricHeaters={electricHeaters}
                rooms={rooms}
                activeDevices={activeDevices}
                toggleDeviceStatus={toggleDeviceStatus}
                apiKey={apiKey}
              />
            }
          />
          <Route
            path="/"
            element={
              <div className="app-container">
                <div className="left-side">
                  <h1>Device Data Entry</h1>
                  <FormRoom addRoom={addRoom} homeAssistantSensors={homeAssistantSensors} />
                  <FormElectricHeater addElectricHeater={addElectricHeater} rooms={rooms} fetchedDevices={fetchedDevices} />
                </div>
                <div className="right-side">
                  <button onClick={handleStartOptimize}>Start Optimize</button>
                  {message && <p>{message}</p>}
                  <JsonViewer jsonContent={jsonContent} />
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
