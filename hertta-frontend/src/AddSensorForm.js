import React, { useState } from 'react';

function AddSensorForm({ addInteriorAirSensor, rooms }) {
  const [sensorId, setSensorId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [sensorType, setSensorType] = useState('temperature'); // Currently only 'temperature'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sensorId && roomId) {
      addInteriorAirSensor({
        sensorId,
        roomId,
        sensorType,
        roomWidth: rooms.find(room => room.roomId === roomId)?.roomWidth || 0,
        roomLength: rooms.find(room => room.roomId === roomId)?.roomLength || 0,
      });
      setSensorId('');
      setRoomId('');
    }
  };

  return (
    <div className="device-form">
      <div className="input-group">
        <label>Sensor ID:</label>
        <input
          type="text"
          value={sensorId}
          onChange={(e) => setSensorId(e.target.value)}
          placeholder="Enter Sensor ID"
        />
      </div>
      <div className="input-group">
        <label>Room:</label>
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">Select a Room</option>
          {rooms.map((room, index) => (
            <option key={index} value={room.roomId}>
              {room.roomId}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label>Sensor Type:</label>
        <select value={sensorType} onChange={(e) => setSensorType(e.target.value)}>
          <option value="temperature">Temperature</option>
        </select>
      </div>
      <button type="submit" onClick={handleSubmit}>Add Sensor</button>
    </div>
  );
}

export default AddSensorForm;
