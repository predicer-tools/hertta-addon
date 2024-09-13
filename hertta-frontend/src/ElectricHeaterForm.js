// src/ElectricHeaterForm.js

import React, { useState } from 'react';

function ElectricHeaterForm({ addElectricHeater, rooms }) {
  const [id, setId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    addElectricHeater({
      id,
      capacity: parseFloat(capacity),
      roomId,
    });

    setId('');
    setCapacity('');
    setRoomId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Heater ID:</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Capacity:</label>
        <input
          type="number"
          step="0.1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Room ID:</label>
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
          <option value="">Select a room</option>
          {rooms.map((room, index) => (
            <option key={index} value={room.roomId}>{room.roomId}</option>
          ))}
        </select>
      </div>
      <button type="submit">Add Electric Heater</button>
    </form>
  );
}

export default ElectricHeaterForm;
