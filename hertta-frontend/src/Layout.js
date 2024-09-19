// src/Layout.js
import React from 'react';
import './Layout.css';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/data-table">Data Table</Link></li>
            <li><Link to="/device-cards">Device Cards</Link></li>
            {/* New Link for the Processes Graph */}
            <li><Link to="/processes-graph">Processes Graph</Link></li>
          </ul>
        </nav>
        {children}
      </div>
    </div>
  );
}

export default Layout;
