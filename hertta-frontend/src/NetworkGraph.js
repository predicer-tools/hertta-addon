import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ yamlContent }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const data = JSON.parse(yamlContent);

    const nodes = [
      ...Object.keys(data.nodes).map(key => ({
        id: key,
        type: 'node',
        ...data.nodes[key]
      })),
      ...Object.keys(data.processes).map(key => ({
        id: key,
        type: 'process',
        ...data.processes[key]
      }))
    ];

    const links = [
      ...Object.values(data.node_diffusion).map(diff => ({
        source: diff.node1,
        target: diff.node2,
      })),
      ...Object.values(data.processes).flatMap(process =>
        process.topos.map(topology => ({
          source: topology.source,
          target: topology.sink,
        }))
      )
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = 800;
    const height = 600;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .stop();

    simulation.tick(300); // Run the simulation without rendering

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#999');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        if (selectedNode && selectedNode.id === d.id) {
          setSelectedNode(null);
        } else {
          setSelectedNode(d);
          setNodePosition({ x: d.x, y: d.y });
        }
      });

    node.append('circle')
      .attr('r', 30) // Adjust radius for bigger nodes
      .attr('fill', '#69b3a2');

    node.append('text')
      .attr('dx', -20)
      .attr('dy', 5)
      .text(d => d.id)
      .style('font-size', '12px')
      .style('fill', '#000');

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

  }, [yamlContent, selectedNode]);

  const handleCloseNodeInfo = () => {
    setSelectedNode(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width="800" height="600"></svg>
      {selectedNode && (
        <div
          className="node-info-box"
          style={{
            position: 'absolute',
            left: `${nodePosition.x}px`, // Center the box horizontally
            top: `${nodePosition.y}px`, // Center the box vertically
            background: 'white',
            border: '1px solid black',
            padding: '10px',
          }}
        >
          <h3>Node Information</h3>
          <p>ID: {selectedNode.id}</p>
          {selectedNode.type === 'node' && (
            <>
              <p>Type: State</p>
              {selectedNode.state && (
                <div>
                  <p>State Max: {selectedNode.state.state_max}</p>
                  <p>State Min: {selectedNode.state.state_min}</p>
                  <p>Initial State: {selectedNode.state.initial_state}</p>
                </div>
              )}
            </>
          )}
          {selectedNode.type === 'process' && (
            <p>Type: Process</p>
          )}
          {selectedNode.capacity && (
            <div>
              <p>Capacity: {selectedNode.capacity}</p>
            </div>
          )}
          <button onClick={handleCloseNodeInfo}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
