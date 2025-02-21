import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddRiskPage = () => {
  // State for the risk fields
  const [parameter, setParameter] = useState('');
  const [value, setValue] = useState(0);

  // Local state to display the server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object for creating a new risk.
    const mutation = {
      createRisk: [
        {
          risk: {
            parameter,
            value,
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { risk: ValueTypes['NewRisk'] },
        ValueTypes['ValidationErrors']
      ],
    };

    try {
      const response = await Gql('mutation')(mutation);
      console.log('Mutation response:', response);
      setServerResponse(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Mutation error:', error);
      setServerResponse(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1>Add New Risk</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Risk Parameter:
          <input
            type="text"
            value={parameter}
            onChange={(e) => setParameter(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Risk Value:
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <button type="submit">Add Risk</button>
      </form>

      {serverResponse && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <h3>Server Response:</h3>
          <pre>{serverResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default AddRiskPage;
