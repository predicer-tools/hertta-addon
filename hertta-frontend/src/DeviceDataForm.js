import React, { useState, useEffect } from 'react';
import './DataForm.css';
import ElectricHeaterForm from './ElectricHeaterForm';
import AddRoomForm from './AddRoomForm';
import AddSensorForm from './AddSensorForm';

function DeviceDataForm({ electricHeaters, setElectricHeaters, interiorAirSensors, setInteriorAirSensors }) {
  const [localElectricHeaters, setLocalElectricHeaters] = useState(electricHeaters);
  const [localInteriorAirSensors, setLocalInteriorAirSensors] = useState(interiorAirSensors);
  const [rooms, setRooms] = useState([]);

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

  const addRoom = (room) => {
    const updatedRooms = [...rooms, room];
    setRooms(updatedRooms);
  };

  return (
    <div>
      <h3>Add Room</h3>
      <AddRoomForm addRoom={addRoom} />
      <h3>Added Rooms</h3>
      <ul>
        {rooms.map((room, index) => (
          <li key={index}>
            Room ID: {room.roomId}, Width: {room.roomWidth}m, Length: {room.roomLength}m, Max Temp: {(room.maxTemp - 273.15).toFixed(2)}°C, Min Temp: {(room.minTemp - 273.15).toFixed(2)}°C
          </li>
        ))}
      </ul>

      <h3>Add Sensor</h3>
      <AddSensorForm addInteriorAirSensor={addInteriorAirSensor} rooms={rooms} />
      <h3>Added Sensors</h3>
      <ul>
        {localInteriorAirSensors.map((sensor, index) => (
          <li key={index}>
            Sensor ID: {sensor.sensorId}, Room ID: {sensor.roomId}
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
