// InputDataSender.js

import React, { useState } from 'react';

function InputDataSender({ inputData }) {
  const [isSending, setIsSending] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleSendData = () => {
    setIsSending(true);
    setError(null);

    // Prepare the OptimizationData to send
    const optimizationData = {
      fetch_weather_data: true,
      fetch_elec_data: true,
      fetch_time_data: false,
      country: "FI",
      location: "Hervanta",
      timezone: null,
      elec_price_source: "Elering",
      model_data: inputData,
      time_data: null,
      weather_data: null,
      elec_price_data: null,
      control_results: null,
      input_data_batch: null,
    };

    fetch('http://127.0.0.1:3030/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(optimizationData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok, status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received optimization data:', data);
        setResponseData(data);
        setIsSending(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.toString());
        setIsSending(false);
      });
  };

  return (
    <div>
      <h2>Send Input Data</h2>
      <button onClick={handleSendData} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Data to Server'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {responseData && (
        <div>
          <h3>Received Optimization Data:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default InputDataSender;
