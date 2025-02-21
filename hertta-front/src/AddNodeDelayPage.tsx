import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddNodeDelayPage = () => {
  // State for each input field of the NewNodeDelay mutation
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [delay, setDelay] = useState(0);
  const [minDelayFlow, setMinDelayFlow] = useState(0);
  const [maxDelayFlow, setMaxDelayFlow] = useState(0);

  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object for creating a node delay.
    const mutation = {
      createNodeDelay: [
        {
          delay: {
            fromNode,
            toNode,
            delay,
            minDelayFlow,
            maxDelayFlow,
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { delay: ValueTypes['NewNodeDelay'] },
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
      <h1>Add New Node Delay</h1>
      <form onSubmit={handleSubmit}>
        <label>
          From Node:
          <input
            type="text"
            value={fromNode}
            onChange={(e) => setFromNode(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          To Node:
          <input
            type="text"
            value={toNode}
            onChange={(e) => setToNode(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Delay:
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Min Delay Flow:
          <input
            type="number"
            value={minDelayFlow}
            onChange={(e) => setMinDelayFlow(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Max Delay Flow:
          <input
            type="number"
            value={maxDelayFlow}
            onChange={(e) => setMaxDelayFlow(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <button type="submit">Add Node Delay</button>
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

export default AddNodeDelayPage;
