import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import UpdateInputDataSetupPage from './UpdateInputDataSetupPage'; // update input setup page
import AddNodePage from './AddNodePage'; // add node page
import ViewNodesPage from './ViewNodesPage'; // view nodes page
import UpdateNodeStatePage from './UpdateNodeStatePage'; // new update node state page
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
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/update-setup" element={<UpdateInputDataSetupPage />} />
        <Route path="/add-node" element={<AddNodePage />} />
        <Route path="/view-nodes" element={<ViewNodesPage />} />
        <Route path="/update-node-state" element={<UpdateNodeStatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
