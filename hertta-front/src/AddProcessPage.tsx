import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddProcessPage = () => {
  // Process fields
  const [name, setName] = useState('');
  const [conversion, setConversion] = useState('UNIT'); // Conversion: UNIT, TRANSPORT, MARKET
  const [isCfFix, setIsCfFix] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isRes, setIsRes] = useState(false);
  const [eff, setEff] = useState(0);
  const [loadMin, setLoadMin] = useState(0);
  const [loadMax, setLoadMax] = useState(0);
  const [startCost, setStartCost] = useState(0);
  const [minOnline, setMinOnline] = useState(0);
  const [maxOnline, setMaxOnline] = useState(0);
  const [minOffline, setMinOffline] = useState(0);
  const [maxOffline, setMaxOffline] = useState(0);
  const [initialState, setInitialState] = useState(false);
  const [isScenarioIndependent, setIsScenarioIndependent] = useState(false);

  // For simplicity, we assume one constant value for the process CF and one for effTs.
  const [cfConstant, setCfConstant] = useState(0);
  const [effTsConstant, setEffTsConstant] = useState(0);

  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object for creating a process.
    const mutation = {
      createProcess: [
        {
          process: {
            name,
            conversion,
            isCfFix,
            isOnline,
            isRes,
            eff,
            loadMin,
            loadMax,
            startCost,
            minOnline,
            maxOnline,
            minOffline,
            maxOffline,
            initialState,
            isScenarioIndependent,
            // Wrap the constant values in an array as required by ValueInput
            cf: [{ constant: cfConstant }],
            effTs: [{ constant: effTsConstant }],
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { process: ValueTypes['NewProcess'] },
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
      <h1>Add New Process</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Process Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Conversion:
          <select
            value={conversion}
            onChange={(e) => setConversion(e.target.value)}
          >
            <option value="UNIT">UNIT</option>
            <option value="TRANSPORT">TRANSPORT</option>
            <option value="MARKET">MARKET</option>
          </select>
        </label>
        <br />
        <label>
          isCfFix:
          <input
            type="checkbox"
            checked={isCfFix}
            onChange={(e) => setIsCfFix(e.target.checked)}
          />
        </label>
        <br />
        <label>
          isOnline:
          <input
            type="checkbox"
            checked={isOnline}
            onChange={(e) => setIsOnline(e.target.checked)}
          />
        </label>
        <br />
        <label>
          isRes:
          <input
            type="checkbox"
            checked={isRes}
            onChange={(e) => setIsRes(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Efficiency (eff):
          <input
            type="number"
            value={eff}
            onChange={(e) => setEff(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Load Min:
          <input
            type="number"
            value={loadMin}
            onChange={(e) => setLoadMin(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Load Max:
          <input
            type="number"
            value={loadMax}
            onChange={(e) => setLoadMax(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Start Cost:
          <input
            type="number"
            value={startCost}
            onChange={(e) => setStartCost(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Min Online:
          <input
            type="number"
            value={minOnline}
            onChange={(e) => setMinOnline(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Max Online:
          <input
            type="number"
            value={maxOnline}
            onChange={(e) => setMaxOnline(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Min Offline:
          <input
            type="number"
            value={minOffline}
            onChange={(e) => setMinOffline(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Max Offline:
          <input
            type="number"
            value={maxOffline}
            onChange={(e) => setMaxOffline(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Initial State:
          <input
            type="checkbox"
            checked={initialState}
            onChange={(e) => setInitialState(e.target.checked)}
          />
        </label>
        <br />
        <label>
          isScenarioIndependent:
          <input
            type="checkbox"
            checked={isScenarioIndependent}
            onChange={(e) => setIsScenarioIndependent(e.target.checked)}
          />
        </label>
        <br />
        <label>
          CF Constant:
          <input
            type="number"
            value={cfConstant}
            onChange={(e) => setCfConstant(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          effTs Constant:
          <input
            type="number"
            value={effTsConstant}
            onChange={(e) => setEffTsConstant(Number(e.target.value))}
          />
        </label>
        <br />
        <button type="submit">Add Process</button>
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

export default AddProcessPage;
