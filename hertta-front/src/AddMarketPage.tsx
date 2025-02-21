import React, { useState } from 'react';
import { Gql, ValueTypes } from '../zeus';

const AddMarketPage = () => {
  // State variables for required fields of the NewMarket input.
  const [name, setName] = useState('');
  const [mType, setMType] = useState('ENERGY'); // ENERGY or RESERVE
  const [node, setNode] = useState('');
  const [processGroup, setProcessGroup] = useState('');
  // Optional fields
  const [direction, setDirection] = useState(''); // Options: UP, DOWN, UP_DOWN
  const [realisation, setRealisation] = useState<number | ''>('');
  const [reserveType, setReserveType] = useState('');
  
  // Boolean flags
  const [isBid, setIsBid] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  
  // Numeric fields
  const [minBid, setMinBid] = useState(0);
  const [maxBid, setMaxBid] = useState(0);
  const [fee, setFee] = useState(0);

  // For simplicity, we assume one constant value per forecast field.
  const [priceConstant, setPriceConstant] = useState(0);
  const [upPriceConstant, setUpPriceConstant] = useState(0);
  const [downPriceConstant, setDownPriceConstant] = useState(0);
  const [reserveActivationPriceConstant, setReserveActivationPriceConstant] = useState(0);

  // Local state to display server response
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build the mutation input object for creating a new market.
    const mutation = {
      createMarket: [
        {
          market: {
            name,
            mType,
            node,
            processGroup,
            direction: direction || null,
            realisation: realisation === '' ? null : Number(realisation),
            reserveType: reserveType || null,
            isBid,
            isLimited,
            minBid,
            maxBid,
            fee,
            // Wrap forecast values in an array (using constant values)
            price: [{ constant: priceConstant }],
            upPrice: [{ constant: upPriceConstant }],
            downPrice: [{ constant: downPriceConstant }],
            reserveActivationPrice: [{ constant: reserveActivationPriceConstant }],
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { market: ValueTypes['NewMarket'] },
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
      <h1>Add New Market</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Market Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Market Type:
          <select value={mType} onChange={(e) => setMType(e.target.value)}>
            <option value="ENERGY">ENERGY</option>
            <option value="RESERVE">RESERVE</option>
          </select>
        </label>
        <br />
        <label>
          Node:
          <input
            type="text"
            value={node}
            onChange={(e) => setNode(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Process Group:
          <input
            type="text"
            value={processGroup}
            onChange={(e) => setProcessGroup(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Direction (optional):
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="">None</option>
            <option value="UP">UP</option>
            <option value="DOWN">DOWN</option>
            <option value="UP_DOWN">UP_DOWN</option>
          </select>
        </label>
        <br />
        <label>
          Realisation (optional):
          <input
            type="number"
            value={realisation}
            onChange={(e) => setRealisation(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Reserve Type (optional):
          <input
            type="text"
            value={reserveType}
            onChange={(e) => setReserveType(e.target.value)}
          />
        </label>
        <br />
        <label>
          Is Bid:
          <input
            type="checkbox"
            checked={isBid}
            onChange={(e) => setIsBid(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Is Limited:
          <input
            type="checkbox"
            checked={isLimited}
            onChange={(e) => setIsLimited(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Min Bid:
          <input
            type="number"
            value={minBid}
            onChange={(e) => setMinBid(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Max Bid:
          <input
            type="number"
            value={maxBid}
            onChange={(e) => setMaxBid(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Fee:
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Price Constant:
          <input
            type="number"
            value={priceConstant}
            onChange={(e) => setPriceConstant(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Up Price Constant:
          <input
            type="number"
            value={upPriceConstant}
            onChange={(e) => setUpPriceConstant(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Down Price Constant:
          <input
            type="number"
            value={downPriceConstant}
            onChange={(e) => setDownPriceConstant(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Reserve Activation Price Constant:
          <input
            type="number"
            value={reserveActivationPriceConstant}
            onChange={(e) => setReserveActivationPriceConstant(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <button type="submit">Add Market</button>
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

export default AddMarketPage;
