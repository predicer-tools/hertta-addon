// src/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li><Link to="/">User Input</Link></li>
        <li><Link to="/data-table">Data Table</Link></li>
        <li><Link to="/device-cards">Device Cards</Link></li>
        {/* New link for Processes Graph added */}
        <li><Link to="/processes-graph">Processes Graph</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
