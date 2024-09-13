import React from 'react';
import './DeviceControl.css'; // Make sure to create and import your CSS for styling

const DeviceControl = ({ deviceControls }) => {
  // Function to render the rows, filling in empty rows if there are fewer than 12 controls
  const renderRows = (controls) => {
    const rows = [];
    for (let i = 0; i < 12; i++) {
      rows.push(
        <tr key={i}>
          <td>{controls[i]?.timestamp || '—'}</td>
          <td>{controls[i]?.power || '—'}</td>
        </tr>
      );
    }
    return rows;
  };

  return (
    <div className="device-control-container">
      <h2>Laitteiden ohjaus (12h)</h2>
      {deviceControls.map(device => (
        <div key={device.deviceName} className="device-section">
          <h3>{device.deviceName}</h3>
          <table>
            <tbody>
              {renderRows(device.controls)}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default DeviceControl;
