import React, { useState } from 'react';
import { Gql, AliasType } from '../zeus';

const AddProcessGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the mutation input.
    // Note: We wrap it as an object with a "createProcessGroup" property.
    const mutation = {
      createProcessGroup: [
        { name: groupName },
        { message: true }
      ]
    } as unknown as { 
      createProcessGroup: [
        { name: string },
        AliasType<{ message?: boolean }>
      ]
    };

    try {
      const response = await Gql('mutation')(mutation);
      setServerResponse(JSON.stringify(response, null, 2));
    } catch (error) {
      setServerResponse(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1>Add Process Group</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Process Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Process Group</button>
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

export default AddProcessGroupPage;
