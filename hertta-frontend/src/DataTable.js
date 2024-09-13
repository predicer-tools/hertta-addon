import React from 'react';
import './DataTable.css';

function DataTable({ electricHeaters, interiorAirSensors, deleteHeater, deleteSensor }) {
  return (
    <div>
      <h2>Data Table</h2>
      <h3>Interior Air Sensors</h3>
      <table>
        <thead>
          <tr>
            <th>Sensor ID</th>
            <th>Room ID</th>
            <th>Room Width (m)</th>
            <th>Room Length (m)</th>
            <th>Max Temp (°C)</th>
            <th>Min Temp (°C)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {interiorAirSensors.map((sensor, index) => (
            <tr key={index}>
              <td>{sensor.sensorId}</td>
              <td>{sensor.roomId}</td>
              <td>{sensor.roomWidth}</td>
              <td>{sensor.roomLength}</td>
              <td>{(sensor.maxTemp - 273.15).toFixed(2)}</td>
              <td>{(sensor.minTemp - 273.15).toFixed(2)}</td>
              <td>
                <button onClick={() => deleteSensor(sensor.sensorId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Electric Heaters</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Capacity</th>
            <th>Room ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {electricHeaters.map((heater, index) => (
            <tr key={index}>
              <td>{heater.id}</td>
              <td>{heater.capacity}</td>
              <td>{heater.roomId}</td>
              <td>
                <button onClick={() => deleteHeater(heater.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
