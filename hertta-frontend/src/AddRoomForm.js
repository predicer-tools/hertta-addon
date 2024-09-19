import React, { useState } from 'react';

function AddRoomForm({ addRoom }) {
  const [roomId, setRoomId] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomLength, setRoomLength] = useState('');
  const [maxTemp, setMaxTemp] = useState(298.15); // Default value in Kelvin
  const [minTemp, setMinTemp] = useState(288.15); // Default value in Kelvin

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && roomWidth && roomLength && maxTemp && minTemp) {
      addRoom({
        roomId,
        roomWidth: parseFloat(roomWidth),
        roomLength: parseFloat(roomLength),
        maxTemp: parseFloat(maxTemp), // Add max temp to room
        minTemp: parseFloat(minTemp), // Add min temp to room
      });
      // Reset input fields
      setRoomId('');
      setRoomWidth('');
      setRoomLength('');
      setMaxTemp(298.15); // Reset to default value
      setMinTemp(288.15); // Reset to default value
    }
  };

  return (
    <div className="device-form">
      <div className="input-group">
        <label>Room ID:</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Room Width (m):</label>
        <input
          type="number"
          value={roomWidth}
          onChange={(e) => setRoomWidth(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Room Length (m):</label>
        <input
          type="number"
          value={roomLength}
          onChange={(e) => setRoomLength(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Max Temp (K):</label>
        <input
          type="number"
          value={maxTemp}
          onChange={(e) => setMaxTemp(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Min Temp (K):</label>
        <input
          type="number"
          value={minTemp}
          onChange={(e) => setMinTemp(e.target.value)}
        />
      </div>
      <button type="submit" onClick={handleSubmit}>Add Room</button>
    </div>
  );
}

export default AddRoomForm;
