// mock-home-assistant/server.js
const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());

let devices = {
  'sensor1': { state: 'on' },
  'sensor2': { state: 'off' },
  'heater1': { state: 'on' },
  'heater2': { state: 'off' }
};

// Endpoint to get device state
app.get('/api/states/:entityId', (req, res) => {
  const entityId = req.params.entityId;
  if (devices[entityId]) {
    res.json({ entity_id: entityId, state: devices[entityId].state });
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// Endpoint to call service
app.post('/api/services/:domain/:service', (req, res) => {
  const { domain, service } = req.params;
  const { entity_id } = req.body;
  if (devices[entity_id]) {
    // Toggle device state for simplicity
    devices[entity_id].state = devices[entity_id].state === 'on' ? 'off' : 'on';
    res.json({ success: true, state: devices[entity_id].state });
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

app.listen(port, () => {
  console.log(`Mock Home Assistant server running at http://localhost:${port}`);
});
