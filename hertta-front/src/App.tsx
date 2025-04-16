import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import UpdateInputDataSetupPage from './UpdateInputDataSetupPage'; // update input setup page
import AddNodePage from './AddNodePage'; // add node page
import ViewNodesPage from './ViewNodesPage'; // view nodes page
import SetNodeStatePage from './SetNodeStatePage'; // new update node state page
import AddProcessPage from './AddProcessPage';
import AddProcessGroupPage from './AddProcessGroupPage';
import AddTopologyPage from './AddTopologyPage';
import AddNodeHistoryPage from './AddNodeHistoryPage';
import AddNodeDelayPage from './AddNodeDelayPage';
import AddNodeDiffusionPage from './AddNodeDiffusionPage';
import AddMarketPage from './AddMarketPage';
import AddRiskPage from './AddRiskPage';
import AddScenarioPage from './AddScenarioPage';
import AddGenConstraintPage from './AddGenConstraintPage';
import OptimizationPage from './OptimizationPage';
import './App.css';

const Home = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/update-setup">Update Input Data Setup</Link>
          </li>
          <li>
            <Link to="/add-node">Add New Node</Link>
          </li>
          <li>
            <Link to="/view-nodes">View Nodes</Link>
          </li>
          <li>
            <Link to="/update-node-state">Update Node State</Link>
          </li>
          <li>
            <Link to="/add-process">Add Process</Link>
          </li>
          <li>
            <Link to="/add-process-group">Add Process Group</Link>
          </li>
          <li>
            <Link to="/add-topology">Add Topology</Link>
          </li>
          <li>
            <Link to="/add-nodehistory">Add Node History</Link>
          </li>
          <li>
            <Link to="/add-nodedelay">Add Node Delay</Link>
          </li>
          <li>
            <Link to="/add-nodediffusion">Add Node Diffusion</Link>
          </li>
          <li>
            <Link to="/add-market">Add Market</Link>
          </li>
          <li>
            <Link to="/add-risk">Add Risk</Link>
          </li>
          <li>
            <Link to="/add-scenario">Add Scenario</Link>
          </li>
          <li>
            <Link to="/add-genconstraint">Add GenConstraint</Link>
          </li>
          <li>
            <Link to="/optimization">Start Optimization</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/update-setup" element={<UpdateInputDataSetupPage />} />
        <Route path="/add-node" element={<AddNodePage />} />
        <Route path="/view-nodes" element={<ViewNodesPage />} />
        <Route path="/update-node-state" element={<SetNodeStatePage />} />
        <Route path="/add-process" element={<AddProcessPage />} />
        <Route path="/add-process-group" element={<AddProcessGroupPage />} />
        <Route path="/add-topology" element={<AddTopologyPage />} />
        <Route path="/add-nodehistory" element={<AddNodeHistoryPage />} />
        <Route path="/add-nodedelay" element={<AddNodeDelayPage />} />
        <Route path="/add-nodediffusion" element={<AddNodeDiffusionPage />} />
        <Route path="/add-market" element={<AddMarketPage />} />
        <Route path="/add-risk" element={<AddRiskPage />} />
        <Route path="/add-scenario" element={<AddScenarioPage />} />
        <Route path="/add-genconstraint" element={<AddGenConstraintPage />} />
        <Route path="/optimization" element={<OptimizationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
