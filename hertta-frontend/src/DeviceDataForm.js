import React, { useState, useEffect } from 'react';
import './DeviceDataForm.css';
import ElectricHeaterForm from './ElectricHeaterForm';
import InputRoom from './InputRoom';

function DeviceDataForm({ electricHeaters, setElectricHeaters, interiorAirSensors, setInteriorAirSensors }) {
  const [localElectricHeaters, setLocalElectricHeaters] = useState(electricHeaters);
  const [localInteriorAirSensors, setLocalInteriorAirSensors] = useState(interiorAirSensors);

  useEffect(() => {
    setLocalElectricHeaters(electricHeaters);
  }, [electricHeaters]);

  useEffect(() => {
    setLocalInteriorAirSensors(interiorAirSensors);
  }, [interiorAirSensors]);

  const addElectricHeater = (heater) => {
    const updatedHeaters = [...localElectricHeaters, heater];
    setLocalElectricHeaters(updatedHeaters);
    setElectricHeaters(updatedHeaters);
  };

  const addInteriorAirSensor = (sensor) => {
    const updatedSensors = [...localInteriorAirSensors, sensor];
    setLocalInteriorAirSensors(updatedSensors);
    setInteriorAirSensors(updatedSensors);
  };

  const rooms = localInteriorAirSensors.map(sensor => ({ roomId: sensor.roomId }));

  return (
    <div>
      <h3>Add Interior Air Sensor and Room</h3>
      <InputRoom addInteriorAirSensor={addInteriorAirSensor} />
      <h3>Added Interior Air Sensors</h3>
      <ul>
        {localInteriorAirSensors.map((sensor, index) => (
          <li key={index}>
            Sensor ID: {sensor.sensorId}, Room ID: {sensor.roomId}, Room Width: {sensor.roomWidth}m, Room Length: {sensor.roomLength}m, Max Temp: {(sensor.maxTemp - 273.15).toFixed(2)}°C, Min Temp: {(sensor.minTemp - 273.15).toFixed(2)}°C
          </li>
        ))}
      </ul>

      <h3>Add Electric Heater</h3>
      <ElectricHeaterForm addElectricHeater={addElectricHeater} rooms={rooms} />
      <h3>Added Electric Heaters</h3>
      <ul>
        {localElectricHeaters.map((heater, index) => (
          <li key={index}>
            ID: {heater.id}, Capacity: {heater.capacity}, Room ID: {heater.roomId}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeviceDataForm;
