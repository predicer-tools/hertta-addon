import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddTopologyPage = () => {
  // Topology fields
  const [capacity, setCapacity] = useState(0);
  const [vomCost, setVomCost] = useState(0);
  const [rampUp, setRampUp] = useState(0);
  const [rampDown, setRampDown] = useState(0);
  const [initialLoad, setInitialLoad] = useState(0);
  const [initialFlow, setInitialFlow] = useState(0);
  // For simplicity, we assume one constant value for capTs.
  const [capTsConstant, setCapTsConstant] = useState(0);

  // Additional fields for linking the topology
  const [sourceNodeName, setSourceNodeName] = useState('');
  const [processName, setProcessName] = useState('');
  const [sinkNodeName, setSinkNodeName] = useState('');

  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mutation = {
      createTopology: [
        {
          topology: {
            capacity,
            vomCost,
            rampUp,
            rampDown,
            initialLoad,
            initialFlow,
            capTs: [{ constant: capTsConstant }],
          },
          // Optional fields may be passed as null or omitted if empty.
          sourceNodeName: sourceNodeName || null,
          processName,
          sinkNodeName: sinkNodeName || null,
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        {
          topology: ValueTypes['NewTopology'];
          sourceNodeName?: string | null;
          processName: string;
          sinkNodeName?: string | null;
        },
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
      <h1>Add New Topology</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Capacity:
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          VOM Cost:
          <input
            type="number"
            value={vomCost}
            onChange={(e) => setVomCost(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Ramp Up:
          <input
            type="number"
            value={rampUp}
            onChange={(e) => setRampUp(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Ramp Down:
          <input
            type="number"
            value={rampDown}
            onChange={(e) => setRampDown(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Initial Load:
          <input
            type="number"
            value={initialLoad}
            onChange={(e) => setInitialLoad(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Initial Flow:
          <input
            type="number"
            value={initialFlow}
            onChange={(e) => setInitialFlow(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          CapTs Constant:
          <input
            type="number"
            value={capTsConstant}
            onChange={(e) => setCapTsConstant(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Source Node Name (optional):
          <input
            type="text"
            value={sourceNodeName}
            onChange={(e) => setSourceNodeName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Process Name:
          <input
            type="text"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Sink Node Name (optional):
          <input
            type="text"
            value={sinkNodeName}
            onChange={(e) => setSinkNodeName(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add Topology</button>
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

export default AddTopologyPage;
