import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddNodePage = () => {
  // Local state for each field in NewNode input
  const [name, setName] = useState('');
  const [isCommodity, setIsCommodity] = useState(false);
  const [isMarket, setIsMarket] = useState(false);
  const [isRes, setIsRes] = useState(false);
  // For simplicity, we assume cost is entered as a single constant value.
  const [costConstant, setCostConstant] = useState(0);
  const [inflow, setInflow] = useState<number | ''>('');
  
  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object.
    // We wrap the cost as an array with one ValueInput object (only using constant).
    const mutation = {
      createNode: [
        {
          node: {
            name,
            isCommodity,
            isMarket,
            isRes,
            cost: [
              { constant: costConstant }
            ],
            // Send inflow only if a value is provided.
            ...(inflow !== '' ? { inflow: Number(inflow) } : {}),
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { node: ValueTypes['NewNode'] },
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
      <h1>Add New Node</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Node Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Is Commodity:
          <input
            type="checkbox"
            checked={isCommodity}
            onChange={(e) => setIsCommodity(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Is Market:
          <input
            type="checkbox"
            checked={isMarket}
            onChange={(e) => setIsMarket(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Is Resource:
          <input
            type="checkbox"
            checked={isRes}
            onChange={(e) => setIsRes(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Cost (constant):
          <input
            type="number"
            value={costConstant}
            onChange={(e) => setCostConstant(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
        Inflow (optional):
        <input
            type="number"
            value={inflow}
            onChange={(e) =>
            setInflow(e.target.value === '' ? '' : Number(e.target.value))
            }
        />
        </label>

        <br />
        <button type="submit">Add Node</button>
      </form>

      {/* Display server response */}
      {serverResponse && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <h3>Server Response:</h3>
          <pre>{serverResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default AddNodePage;
