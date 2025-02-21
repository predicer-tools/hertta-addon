import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddNodeHistoryPage = () => {
  const [nodeName, setNodeName] = useState('');
  
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = {
      createNodeHistory: [
        {
          nodeName, 
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { nodeName: string },
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
      <h1>Create Node History</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Node Name:
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Create Node History</button>
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

export default AddNodeHistoryPage;
