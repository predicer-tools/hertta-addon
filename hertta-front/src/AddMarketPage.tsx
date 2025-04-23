import React, { useState } from "react";
import { Gql, ValueTypes, MarketType } from "../zeus";

/**
 * A reusable input that lets the user decide whether the underlying GraphQL
 * value should be a constant, a numeric series, or derived from a forecast.
 */
const PriceInput: React.FC<{
  label: string;
  state: PriceFieldState;
  onChange: (s: PriceFieldState) => void;
}> = ({ label, state, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">{label} type</label>

      <select
        className="border rounded-lg p-2 w-full mb-2"
        value={state.inputType}
        onChange={(e) =>
          onChange({ ...state, inputType: e.target.value as PriceInputType })
        }
      >
        <option value="CONSTANT">Constant</option>
        <option value="SERIES">Series</option>
        <option value="FORECAST">Forecast</option>
      </select>

      {state.inputType === "CONSTANT" && (
        <input
          type="number"
          className="border rounded-lg p-2 w-full"
          value={state.constant}
          onChange={(e) =>
            onChange({ ...state, constant: Number(e.target.value) })
          }
        />
      )}

      {state.inputType === "SERIES" && (
        <textarea
          className="border rounded-lg p-2 w-full"
          placeholder="Comma‑separated numbers, e.g. 10,12,13.5"
          value={state.series}
          onChange={(e) => onChange({ ...state, series: e.target.value })}
        />
      )}

      {state.inputType === "FORECAST" && (
        <input
          type="text"
          className="border rounded-lg p-2 w-full"
          placeholder="Forecast name"
          value={state.forecast}
          onChange={(e) =>
            onChange({ ...state, forecast: e.target.value.trim() })
          }
        />
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Types & helpers
// ────────────────────────────────────────────────────────────────────────────────

type PriceInputType = "CONSTANT" | "SERIES" | "FORECAST";

interface PriceFieldState {
  inputType: PriceInputType;
  constant: number;
  series: string; // Raw comma‑separated string from the textarea
  forecast: string;
}

const EMPTY_PRICE_FIELD: PriceFieldState = {
  inputType: "CONSTANT",
  constant: 0,
  series: "",
  forecast: "",
};

/**
 * Convert the UI state into the ForecastValueInput array expected by the API.
 */
const buildForecastValue = (
  field: PriceFieldState
): ValueTypes["ForecastValueInput"][] => {
  switch (field.inputType) {
    case "CONSTANT":
      return [{ constant: field.constant }];

    case "SERIES":
      const numbers = field.series
        .split(/[,\s]+/)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));
      return [{ series: numbers }];

    case "FORECAST":
      return [{ forecast: field.forecast }];

    /* istanbul ignore next */
    default:
      return [];
  }
};

// ────────────────────────────────────────────────────────────────────────────────
// Main page component
// ────────────────────────────────────────────────────────────────────────────────

const AddMarketPage: React.FC = () => {
  // Basic market metadata
  const [name, setName] = useState("");
  const [mType, setMType] = useState<MarketType>(MarketType.ENERGY);
  const [node, setNode] = useState("");
  const [processGroup, setProcessGroup] = useState("");

  // Optional metadata
  const [direction, setDirection] = useState<ValueTypes["MarketDirection"] | "">("");
  const [realisation, setRealisation] = useState<string>("");
  const [reserveType, setReserveType] = useState("");

  // Flags & numeric constraints
  const [isBid, setIsBid] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [minBid, setMinBid] = useState(0);
  const [maxBid, setMaxBid] = useState(0);
  const [fee, setFee] = useState(0);

  // Price‑related fields – now with type selection
  const [priceField, setPriceField] = useState<PriceFieldState>({ ...EMPTY_PRICE_FIELD });
  const [upPriceField, setUpPriceField] = useState<PriceFieldState>({ ...EMPTY_PRICE_FIELD });
  const [downPriceField, setDownPriceField] = useState<PriceFieldState>({ ...EMPTY_PRICE_FIELD });

  // Reserve activation price still follows ValueInput, constant only for now
  const [reserveActivationPrice, setReserveActivationPrice] = useState(0);

  // Server response
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  // ──────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mutation = {
      createMarket: [
        {
          market: {
            name,
            mType,
            node,
            processGroup,
            direction: direction || null,
            realisation:
            realisation.trim() === ""
              ? []
              : Number(realisation),
            reserveType: reserveType || null,
            isBid,
            isLimited,
            minBid,
            maxBid,
            fee,
            price: buildForecastValue(priceField),
            upPrice: buildForecastValue(upPriceField),
            downPrice: buildForecastValue(downPriceField),
            reserveActivationPrice: [{ constant: reserveActivationPrice }],
          },
        },
        {
          errors: {
            field: true,
            message: true,
          },
        },
      ] as [
        { market: ValueTypes["NewMarket"] },
        ValueTypes["ValidationErrors"]
      ],
    };

    try {
      const response = await Gql("mutation")(mutation);
      setServerResponse(JSON.stringify(response, null, 2));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Mutation error", error);
      setServerResponse(String(error));
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Add new market</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Market name</label>
          <input
            className="border rounded-lg p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Market type</label>
            <select
              className="border rounded-lg p-2 w-full"
              value={mType}
              onChange={(e) => setMType(e.target.value as MarketType)}
            >
              <option value={MarketType.ENERGY}>ENERGY</option>
              <option value={MarketType.RESERVE}>RESERVE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Node</label>
            <input
              className="border rounded-lg p-2 w-full"
              value={node}
              onChange={(e) => setNode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Process group</label>
            <input
              className="border rounded-lg p-2 w-full"
              value={processGroup}
              onChange={(e) => setProcessGroup(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Optional meta */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Direction (optional)</label>
            <select
              className="border rounded-lg p-2 w-full"
              value={direction}
              onChange={(e) =>
                setDirection(
                  (e.target.value as ValueTypes["MarketDirection"]) || ""
                )
              }
            >
              <option value="">— none —</option>
              <option value="UP">UP</option>
              <option value="DOWN">DOWN</option>
              <option value="UP_DOWN">UP_DOWN</option>
              <option value="RES_UP">RES_UP</option>
              <option value="RES_DOWN">RES_DOWN</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Realisation (optional)</label>
            <input
              type="number"
              className="border rounded-lg p-2 w-full"
              value={realisation}
              onChange={(e) => setRealisation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reserve type (optional)</label>
            <input
              className="border rounded-lg p-2 w-full"
              value={reserveType}
              onChange={(e) => setReserveType(e.target.value)}
            />
          </div>
        </div>

        {/* Flags & numeric constraints */}
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBid}
              onChange={(e) => setIsBid(e.target.checked)}
            />
            <span>Is bid</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLimited}
              onChange={(e) => setIsLimited(e.target.checked)}
            />
            <span>Is limited</span>
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Min bid</label>
            <input
              type="number"
              className="border rounded-lg p-2 w-full"
              value={minBid}
              onChange={(e) => setMinBid(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max bid</label>
            <input
              type="number"
              className="border rounded-lg p-2 w-full"
              value={maxBid}
              onChange={(e) => setMaxBid(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fee</label>
            <input
              type="number"
              className="border rounded-lg p-2 w-full"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* New flexible price inputs */}
        <PriceInput label="Price" state={priceField} onChange={setPriceField} />
        <PriceInput
          label="Up‑price"
          state={upPriceField}
          onChange={setUpPriceField}
        />
        <PriceInput
          label="Down‑price"
          state={downPriceField}
          onChange={setDownPriceField}
        />

        {/* Reserve activation price – still constant for simplicity */}
        <div>
          <label className="block text-sm font-medium mb-1">Reserve activation price (constant)</label>
          <input
            type="number"
            className="border rounded-lg p-2 w-full"
            value={reserveActivationPrice}
            onChange={(e) => setReserveActivationPrice(Number(e.target.value))}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-6 py-2 shadow-md hover:bg-blue-700 transition"
        >
          Add market
        </button>
      </form>

      {serverResponse && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Server response</h2>
          <pre className="bg-gray-100 p-4 rounded-xl overflow-auto text-sm max-h-96">
            {serverResponse}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AddMarketPage;
