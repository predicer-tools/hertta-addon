import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './global.css';
import './App.css';
import DeviceDataForm from './DeviceDataForm';
import DataTable from './DataTable';
import DeviceCards from './DeviceCards';
import InputDataSender from './InputDataSender';
import Layout from './Layout';
import generateJsonContent from './generateJsonContent'; // Import the JSON generation function

function App() {
  const [jsonContent, setJsonContent] = useState({});
  const [electricHeaters, setElectricHeaters] = useState([]);
  const [interiorAirSensors, setInteriorAirSensors] = useState([]);
  const [activeDevices, setActiveDevices] = useState({});

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
        t_e_conversion_env: 1
      },
      {
        sensorId: 'sensor2',
        roomId: 'room2',
        roomWidth: 6,
        roomLength: 5,
        maxTemp: 299.15,
        minTemp: 289.15,
        t_e_conversion_int: 1,
        t_e_conversion_env: 1
      }
    ];

    const defaultHeaters = [
      {
        id: 'heater1',
        capacity: 2,
        roomId: 'room1'
      },
      {
        id: 'heater2',
        capacity: 3,
        roomId: 'room2'
      }
    ];

    setElectricHeaters(defaultHeaters);
    setInteriorAirSensors(defaultSensors);

    // Initialize active devices status
    const initialActiveDevices = {};
    defaultHeaters.forEach(heater => initialActiveDevices[heater.id] = true);
    defaultSensors.forEach(sensor => initialActiveDevices[sensor.sensorId] = true);
    setActiveDevices(initialActiveDevices);
  }, []);

  useEffect(() => {
    setJsonContent(generateJsonContent(electricHeaters, interiorAirSensors, activeDevices));
  }, [electricHeaters, interiorAirSensors, activeDevices]);

  const deleteHeater = (id) => {
    const updatedHeaters = electricHeaters.filter(heater => heater.id !== id);
    setElectricHeaters(updatedHeaters);
  };

  const deleteSensor = (id) => {
    const updatedSensors = interiorAirSensors.filter(sensor => sensor.sensorId !== id);
    setInteriorAirSensors(updatedSensors);
  };

  const toggleDeviceStatus = (id) => {
    setActiveDevices(prevStatus => ({
      ...prevStatus,
      [id]: !prevStatus[id]
    }));
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={
            <div className="app-container">
              <div className="left-side">
                <h1>Device Data Entry</h1>
                <DeviceDataForm 
                  electricHeaters={electricHeaters} 
                  setElectricHeaters={setElectricHeaters} 
                  interiorAirSensors={interiorAirSensors} 
                  setInteriorAirSensors={setInteriorAirSensors} 
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
          } />
          <Route path="/data-table" element={
            <DataTable 
              electricHeaters={electricHeaters} 
              interiorAirSensors={interiorAirSensors} 
              deleteHeater={deleteHeater} 
              deleteSensor={deleteSensor} 
            />
          } />
          <Route path="/device-cards" element={
            <DeviceCards 
              electricHeaters={electricHeaters} 
              interiorAirSensors={interiorAirSensors} 
              activeDevices={activeDevices}
              toggleDeviceStatus={toggleDeviceStatus} 
            />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
