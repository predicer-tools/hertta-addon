import React, { useEffect, useState } from 'react';
import { Gql } from '../zeus';

const ViewNodesPage = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchNodes = async () => {
      setLoading(true);
      try {
        const query = {
          model: {
            inputData: {
              nodes: {
                name: true,
                isCommodity: true,
                isMarket: true,
                isRes: true,
                // You can add other fields here as needed.
              },
            },
          },
        };
        const response = await Gql('query')(query);
        // Assuming the response structure is: { model: { inputData: { nodes: [...] } } }
        setNodes(response.model.inputData.nodes);
      } catch (err) {
        console.error(err);
        setError('Error fetching nodes');
      }
      setLoading(false);
    };

    fetchNodes();
  }, []);

  if (loading) return <div>Loading nodes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>List of Nodes</h1>
      {nodes.length === 0 ? (
        <div>No nodes found.</div>
      ) : (
        <ul>
          {nodes.map((node, index) => (
            <li key={index}>
              <strong>{node.name}</strong> &mdash; Commodity: {node.isCommodity ? 'Yes' : 'No'}, Market: {node.isMarket ? 'Yes' : 'No'}, Resource: {node.isRes ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewNodesPage;
