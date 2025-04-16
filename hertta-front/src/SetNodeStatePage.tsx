import React, { useState, useEffect } from 'react';
import { Gql, ValueTypes } from '../zeus';

const SetNodeStatePage = () => {
  // Local state for nodes list and selected node name
  const [nodes, setNodes] = useState<{ name: string }[]>([]);
  const [selectedNode, setSelectedNode] = useState('');

  // Local state for state update fields
  const [inMax, setInMax] = useState(0);
  const [outMax, setOutMax] = useState(0);
  const [stateLossProportional, setStateLossProportional] = useState(0);
  const [stateMax, setStateMax] = useState(0);
  const [stateMin, setStateMin] = useState(0);
  const [initialState, setInitialState] = useState(0);
  const [isScenarioIndependent, setIsScenarioIndependent] = useState(false);
  const [isTemp, setIsTemp] = useState(false);
  const [tEConversion, setTEConversion] = useState(0);
  const [residualValue, setResidualValue] = useState(0);

  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  // Fetch nodes from the server on mount
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        // Query for nodes in the model (adjust this query if needed)
        const query = {
          model: {
            inputData: {
              nodes: {
                name: true,
              },
            },
          },
        };
        const response = await Gql('query')(query);
        const fetchedNodes = response.model.inputData.nodes;
        setNodes(fetchedNodes);
        if (fetchedNodes.length > 0) {
          setSelectedNode(fetchedNodes[0].name);
        }
      } catch (error) {
        console.error('Error fetching nodes:', error);
      }
    };
    fetchNodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object.
    // We ensure that all values are numbers (int/float) and not strings.
    const mutation = {
      setNodeState: [
        {
          state: {
            inMax,
            outMax,
            stateLossProportional,
            stateMax,
            stateMin,
            initialState,
            isScenarioIndependent,
            isTemp,
            tEConversion,
            residualValue,
          },
          nodeName: selectedNode,
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as unknown as [
        { state: ValueTypes['StateInput']; nodeName: string },
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
      <h1>Set Node State</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Node:
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
          >
            {nodes.map((node) => (
              <option key={node.name} value={node.name}>
                {node.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          inMax:
          <input
            type="number"
            value={inMax}
            onChange={(e) => setInMax(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          outMax:
          <input
            type="number"
            value={outMax}
            onChange={(e) => setOutMax(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          stateLossProportional:
          <input
            type="number"
            value={stateLossProportional}
            onChange={(e) => setStateLossProportional(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          stateMax:
          <input
            type="number"
            value={stateMax}
            onChange={(e) => setStateMax(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          stateMin:
          <input
            type="number"
            value={stateMin}
            onChange={(e) => setStateMin(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          initialState:
          <input
            type="number"
            value={initialState}
            onChange={(e) => setInitialState(Number(e.target.value))}
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
          isTemp:
          <input
            type="checkbox"
            checked={isTemp}
            onChange={(e) => setIsTemp(e.target.checked)}
          />
        </label>
        <br />
        <label>
          tEConversion:
          <input
            type="number"
            value={tEConversion}
            onChange={(e) => setTEConversion(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          residualValue:
          <input
            type="number"
            value={residualValue}
            onChange={(e) => setResidualValue(Number(e.target.value))}
          />
        </label>
        <br />
        <button type="submit">Set Node State</button>
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

export default SetNodeStatePage;
