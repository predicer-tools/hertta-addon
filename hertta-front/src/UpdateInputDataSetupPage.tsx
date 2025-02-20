import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const UpdateInputDataSetupPage = () => {
  // State for each field in your InputDataSetupUpdate
  const [containsReserves, setContainsReserves] = useState(false);
  const [containsOnline, setContainsOnline] = useState(false);
  const [containsStates, setContainsStates] = useState(false);
  const [containsPiecewiseEff, setContainsPiecewiseEff] = useState(false);
  const [containsRisk, setContainsRisk] = useState(false);
  const [containsDiffusion, setContainsDiffusion] = useState(false);
  const [containsDelay, setContainsDelay] = useState(false);
  const [containsMarkets, setContainsMarkets] = useState(false);
  const [reserveRealization, setReserveRealization] = useState(false);
  const [useMarketBids, setUseMarketBids] = useState(false);
  const [commonTimesteps, setCommonTimesteps] = useState(0);
  const [commonScenarioName, setCommonScenarioName] = useState('');
  const [useNodeDummyVariables, setUseNodeDummyVariables] = useState(false);
  const [useRampDummyVariables, setUseRampDummyVariables] = useState(false);
  const [nodeDummyVariableCost, setNodeDummyVariableCost] = useState(0);
  const [rampDummyVariableCost, setRampDummyVariableCost] = useState(0);

  // This state will hold the server's response (or any relevant message)
  const [serverMessage, setServerMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Build the mutation input object
    const mutation = {
      updateInputDataSetup: [
        {
          setupUpdate: {
            containsReserves,
            containsOnline,
            containsStates,
            containsPiecewiseEff,
            containsRisk,
            containsDiffusion,
            containsDelay,
            containsMarkets,
            reserveRealization,
            useMarketBids,
            commonTimesteps,
            commonScenarioName,
            useNodeDummyVariables,
            useRampDummyVariables,
            nodeDummyVariableCost,
            rampDummyVariableCost,
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { setupUpdate: ValueTypes['InputDataSetupUpdate'] },
        ValueTypes['ValidationErrors']
      ],
    };

    try {
      const response = await Gql('mutation')(mutation);
      console.log('Mutation response:', response);
      // Convert the response to a readable string and store in state
      setServerMessage(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Mutation error:', error);
      setServerMessage(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1>Update Input Data Setup</h1>
      <form onSubmit={handleSubmit}>
        <label>
          containsReserves:
          <input
            type="checkbox"
            checked={containsReserves}
            onChange={(e) => setContainsReserves(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsOnline:
          <input
            type="checkbox"
            checked={containsOnline}
            onChange={(e) => setContainsOnline(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsStates:
          <input
            type="checkbox"
            checked={containsStates}
            onChange={(e) => setContainsStates(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsPiecewiseEff:
          <input
            type="checkbox"
            checked={containsPiecewiseEff}
            onChange={(e) => setContainsPiecewiseEff(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsRisk:
          <input
            type="checkbox"
            checked={containsRisk}
            onChange={(e) => setContainsRisk(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsDiffusion:
          <input
            type="checkbox"
            checked={containsDiffusion}
            onChange={(e) => setContainsDiffusion(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsDelay:
          <input
            type="checkbox"
            checked={containsDelay}
            onChange={(e) => setContainsDelay(e.target.checked)}
          />
        </label>
        <br />
        <label>
          containsMarkets:
          <input
            type="checkbox"
            checked={containsMarkets}
            onChange={(e) => setContainsMarkets(e.target.checked)}
          />
        </label>
        <br />
        <label>
          reserveRealization:
          <input
            type="checkbox"
            checked={reserveRealization}
            onChange={(e) => setReserveRealization(e.target.checked)}
          />
        </label>
        <br />
        <label>
          useMarketBids:
          <input
            type="checkbox"
            checked={useMarketBids}
            onChange={(e) => setUseMarketBids(e.target.checked)}
          />
        </label>
        <br />
        <label>
          commonTimesteps:
          <input
            type="number"
            value={commonTimesteps}
            onChange={(e) => setCommonTimesteps(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          commonScenarioName:
          <input
            type="text"
            value={commonScenarioName}
            onChange={(e) => setCommonScenarioName(e.target.value)}
          />
        </label>
        <br />
        <label>
          useNodeDummyVariables:
          <input
            type="checkbox"
            checked={useNodeDummyVariables}
            onChange={(e) => setUseNodeDummyVariables(e.target.checked)}
          />
        </label>
        <br />
        <label>
          useRampDummyVariables:
          <input
            type="checkbox"
            checked={useRampDummyVariables}
            onChange={(e) => setUseRampDummyVariables(e.target.checked)}
          />
        </label>
        <br />
        <label>
          nodeDummyVariableCost:
          <input
            type="number"
            value={nodeDummyVariableCost}
            onChange={(e) => setNodeDummyVariableCost(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          rampDummyVariableCost:
          <input
            type="number"
            value={rampDummyVariableCost}
            onChange={(e) => setRampDummyVariableCost(Number(e.target.value))}
          />
        </label>
        <br />
        <button type="submit">Update Setup</button>
      </form>

      {/* Display the server response here */}
      {serverMessage && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <h3>Server Response:</h3>
          <pre>{serverMessage}</pre>
        </div>
      )}
    </div>
  );
};

export default UpdateInputDataSetupPage;
