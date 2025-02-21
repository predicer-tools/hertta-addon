import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddScenarioPage = () => {
  // State for scenario fields
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);

  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object for creating a scenario.
    const mutation = {
      createScenario: [
        {
          name,
          weight,
        },
        {
          message: true,
        },
      ] as [
        { name: string; weight: number },
        ValueTypes['MaybeError']
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
      <h1>Add New Scenario</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Scenario Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Scenario Weight:
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <button type="submit">Add Scenario</button>
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

export default AddScenarioPage;
