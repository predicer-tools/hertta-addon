// src/VisualizationGraph.js
import React from 'react';
import './VisualizationGraph.css';

const VisualizationGraph = ({ rooms, processes }) => {
  // Create a mapping from rooms to heaters based on processes and topologies
  const roomHeaterMap = {};

  // Iterate over the processes to build the mapping
  Object.values(processes).forEach((process) => {
    if (process.topos && process.topos.length > 0) {
      process.topos.forEach((topo) => {
        if (topo.source === process.id && topo.sink) {
          // This is an output topology from the heater to a node (possibly a room)
          const roomId = topo.sink;
          if (!roomHeaterMap[roomId]) {
            roomHeaterMap[roomId] = [];
          }
          roomHeaterMap[roomId].push(process);
        }
      });
    }
  });

  return (
    <div className="visualization-graph">
      {rooms.map((room) => (
        <div className="room" key={room.roomId || room.name}>
          <h3>{room.roomId || room.name}</h3>
          <div className="devices">
            {roomHeaterMap[room.roomId]?.map((heater) => (
              <div className="device" key={heater.id}>
                <span role="img" aria-label="heater">🔥</span>
                <p>{heater.name || 'Electric Heater'}</p>
              </div>
            )) || <p>No devices</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisualizationGraph;
