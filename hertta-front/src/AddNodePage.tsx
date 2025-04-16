import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

// Type definitions for item options.
type CostType = 'Constant' | 'FloatList';
type InflowType = 'Constant' | 'FloatList' | 'Forecast';

interface CostItem {
  id: number; // unique id (for keying in a list)
  type: CostType;
  constantValue?: number;
  // We store the float list as a comma-separated string temporarily.
  floatListInput?: string;
  floatListValues?: number[];
}

interface InflowItem {
  id: number;
  type: InflowType;
  constantValue?: number;
  floatListInput?: string;
  floatListValues?: number[];
  forecastName?: string;
}

let costIdCounter = 0;
let inflowIdCounter = 0;

const AddNodePage = () => {
  // Base fields for the node.
  const [name, setName] = useState('');
  const [isCommodity, setIsCommodity] = useState(false);
  const [isMarket, setIsMarket] = useState(false);
  const [isRes, setIsRes] = useState(false);

  // Manage list of cost items.
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  // Manage list of inflow items.
  const [inflowItems, setInflowItems] = useState<InflowItem[]>([]);

  // Local state to display server response.
  const [serverResponse, setServerResponse] = useState('');

  // --- COST FUNCTIONS ---
  const addCostItem = () => {
    const newItem: CostItem = { id: costIdCounter++, type: 'Constant', constantValue: 0 };
    setCostItems([...costItems, newItem]);
  };

  const updateCostItemType = (id: number, newType: CostType) => {
    setCostItems(costItems.map(item => item.id === id ? { ...item, type: newType } : item));
  };

  const updateCostItemValue = (id: number, value: number) => {
    setCostItems(costItems.map(item => item.id === id ? { ...item, constantValue: value } : item));
  };

  const updateCostItemFloatListInput = (id: number, input: string) => {
    setCostItems(costItems.map(item => item.id === id ? { ...item, floatListInput: input } : item));
  };

  const convertCostFloatList = (id: number) => {
    setCostItems(costItems.map(item => {
      if (item.id === id && item.floatListInput) {
        // Parse comma-separated numbers and update floatListValues.
        const values = item.floatListInput
          .split(',')
          .map((str) => Number(str.trim()))
          .filter((num) => !isNaN(num));
        return { ...item, floatListValues: values };
      }
      return item;
    }));
  };

  const removeCostItem = (id: number) => {
    setCostItems(costItems.filter(item => item.id !== id));
  };

  // --- INFLOW FUNCTIONS ---
  const addInflowItem = () => {
    const newItem: InflowItem = { id: inflowIdCounter++, type: 'Constant', constantValue: 0 };
    setInflowItems([...inflowItems, newItem]);
  };

  const updateInflowItemType = (id: number, newType: InflowType) => {
    setInflowItems(inflowItems.map(item => item.id === id ? { ...item, type: newType } : item));
  };

  const updateInflowItemValue = (id: number, value: number) => {
    setInflowItems(inflowItems.map(item => item.id === id ? { ...item, constantValue: value } : item));
  };

  const updateInflowItemFloatListInput = (id: number, input: string) => {
    setInflowItems(inflowItems.map(item => item.id === id ? { ...item, floatListInput: input } : item));
  };

  const convertInflowFloatList = (id: number) => {
    setInflowItems(inflowItems.map(item => {
      if (item.id === id && item.floatListInput) {
        const values = item.floatListInput
          .split(',')
          .map(str => Number(str.trim()))
          .filter(num => !isNaN(num));
        return { ...item, floatListValues: values };
      }
      return item;
    }));
  };

  const updateInflowForecastName = (id: number, name: string) => {
    setInflowItems(inflowItems.map(item => item.id === id ? { ...item, forecastName: name } : item));
  };

  const removeInflowItem = (id: number) => {
    setInflowItems(inflowItems.filter(item => item.id !== id));
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build mutation input for cost:
    // For each cost item, check the selected type and structure the object accordingly.
    const costInput = costItems.map(item => {
      if (item.type === 'Constant') {
        return { constant: item.constantValue || 0 };
      } else {
        // Ensure we have the converted floatListValues.
        return { series: item.floatListValues || [] };
      }
    });

    // Build mutation input for inflow.
    const inflowInput = inflowItems.map(item => {
      if (item.type === 'Constant') {
        return { constant: item.constantValue || 0 };
      } else if (item.type === 'FloatList') {
        return { series: item.floatListValues || [] };
      } else if (item.type === 'Forecast') {
        return { forecast: item.forecastName || '' };
      } else {
        return {}; // fallback if needed (should not occur)
      }
    });

    // Create mutation object.
    const mutation = {
      createNode: [
        {
          node: {
            name,
            isCommodity,
            isMarket,
            isRes,
            // Always include cost and inflow, even if empty.
            cost: costInput,
            inflow: inflowInput,
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
        {/* Node base fields */}
        <label>
          Node Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Is Commodity:
          <input
            type="checkbox"
            checked={isCommodity}
            onChange={e => setIsCommodity(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Is Market:
          <input
            type="checkbox"
            checked={isMarket}
            onChange={e => setIsMarket(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Is Resource:
          <input
            type="checkbox"
            checked={isRes}
            onChange={e => setIsRes(e.target.checked)}
          />
        </label>
        <br />

        {/* COST INPUT SECTION */}
        <fieldset style={{ marginTop: '1rem' }}>
          <legend>Cost Items</legend>
          <button type="button" onClick={addCostItem}>
            Add Cost Item
          </button>
          {costItems.length === 0 && <p>No cost items added.</p>}
          {costItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginTop: '0.5rem' }}>
              <label>
                Type:
                <select
                  value={item.type}
                  onChange={e => updateCostItemType(item.id, e.target.value as CostType)}
                >
                  <option value="Constant">Constant</option>
                  <option value="FloatList">FloatList</option>
                </select>
              </label>
              <br />
              {item.type === 'Constant' && (
                <label>
                  Constant Value:
                  <input
                    type="number"
                    value={item.constantValue}
                    onChange={e => updateCostItemValue(item.id, Number(e.target.value))}
                  />
                </label>
              )}
              {item.type === 'FloatList' && (
                <>
                  <label>
                    Float List (comma separated):
                    <input
                      type="text"
                      value={item.floatListInput || ''}
                      onChange={e => updateCostItemFloatListInput(item.id, e.target.value)}
                      placeholder="e.g. 1.2, 3.4, 5.6"
                    />
                  </label>
                  <button type="button" onClick={() => convertCostFloatList(item.id)}>
                    Set Float List
                  </button>
                </>
              )}
              <br />
              <button type="button" onClick={() => removeCostItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </fieldset>

        {/* INFLOW INPUT SECTION */}
        <fieldset style={{ marginTop: '1rem' }}>
          <legend>Inflow Items</legend>
          <button type="button" onClick={addInflowItem}>
            Add Inflow Item
          </button>
          {inflowItems.length === 0 && <p>No inflow items added.</p>}
          {inflowItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginTop: '0.5rem' }}>
              <label>
                Type:
                <select
                  value={item.type}
                  onChange={e => updateInflowItemType(item.id, e.target.value as InflowType)}
                >
                  <option value="Constant">Constant</option>
                  <option value="FloatList">FloatList</option>
                  <option value="Forecast">Forecast</option>
                </select>
              </label>
              <br />
              {item.type === 'Constant' && (
                <label>
                  Constant Value:
                  <input
                    type="number"
                    value={item.constantValue}
                    onChange={e => updateInflowItemValue(item.id, Number(e.target.value))}
                  />
                </label>
              )}
              {item.type === 'FloatList' && (
                <>
                  <label>
                    Float List (comma separated):
                    <input
                      type="text"
                      value={item.floatListInput || ''}
                      onChange={e => updateInflowItemFloatListInput(item.id, e.target.value)}
                      placeholder="e.g. 2.3, 4.5, 6.7"
                    />
                  </label>
                  <button type="button" onClick={() => convertInflowFloatList(item.id)}>
                    Set Float List
                  </button>
                </>
              )}
              {item.type === 'Forecast' && (
                <label>
                  Forecast Name:
                  <input
                    type="text"
                    value={item.forecastName || ''}
                    onChange={e => updateInflowForecastName(item.id, e.target.value)}
                    placeholder="e.g. myForecast"
                  />
                </label>
              )}
              <br />
              <button type="button" onClick={() => removeInflowItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </fieldset>
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
