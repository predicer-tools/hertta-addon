import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddNodeDiffusionPage = () => {
  // State variables for NewNodeDiffusion fields
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  // For simplicity, we assume one constant value for the coefficient
  const [coefficient, setCoefficient] = useState(0);

  // Local state for displaying the server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object for creating a node diffusion.
    const mutation = {
      createNodeDiffusion: [
        {
          newDiffusion: {
            fromNode,
            toNode,
            // Wrap the coefficient value in an array as required by ValueInput
            coefficient: [{ constant: coefficient }],
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { newDiffusion: ValueTypes['NewNodeDiffusion'] },
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
      <h1>Add New Node Diffusion</h1>
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
          Coefficient (constant value):
          <input
            type="number"
            value={coefficient}
            onChange={(e) => setCoefficient(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <button type="submit">Add Node Diffusion</button>
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

export default AddNodeDiffusionPage;
