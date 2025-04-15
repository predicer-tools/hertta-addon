import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddGenConstraintPage = () => {
  // Local state for generic constraint fields
  const [name, setName] = useState('');
  const [gcType, setGcType] = useState('LESS_THAN'); // default option
  const [isSetpoint, setIsSetpoint] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [constantValue, setConstantValue] = useState(0);

  // Local state for server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the mutation for creating a generic constraint.
    // Note: For simplicity we wrap the constant value as an array with one object.
    const mutation = {
      createGenConstraint: [
        {
          constraint: {
            name,
            gcType,
            isSetpoint,
            penalty,
            // Here we pass a single constant value; adjust as needed if multiple values are required.
            constant: [{ constant: constantValue }],
          },
        },
        {
          // We expect a list of validation errors in the response if any.
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { constraint: ValueTypes['NewGenConstraint'] },
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
      <h1>Add New Generic Constraint</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Constraint Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Constraint Type:
          <select
            value={gcType}
            onChange={(e) => setGcType(e.target.value)}
          >
            <option value="LESS_THAN">LESS_THAN</option>
            <option value="EQUAL">EQUAL</option>
            <option value="GREATER_THAN">GREATER_THAN</option>
          </select>
        </label>
        <br />

        <label>
          Is Setpoint:
          <input
            type="checkbox"
            checked={isSetpoint}
            onChange={(e) => setIsSetpoint(e.target.checked)}
          />
        </label>
        <br />

        <label>
          Penalty:
          <input
            type="number"
            value={penalty}
            onChange={(e) => setPenalty(Number(e.target.value))}
            required
          />
        </label>
        <br />

        <label>
          Constant Value:
          <input
            type="number"
            value={constantValue}
            onChange={(e) => setConstantValue(Number(e.target.value))}
            required
          />
        </label>
        <br />

        <button type="submit">Add Generic Constraint</button>
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

export default AddGenConstraintPage;
