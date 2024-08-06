import React, { useState, useEffect } from 'react';
import authHeader from '../Functions/AuthHeader';

const Lions = () => {
  const [lions, setLions] = useState([]);
  const [clowns, setClowns] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState({});
  const [name, setName] = useState('');
  const [roarstrength, setRoarStrength] = useState('');
  const [clown, setClown] = useState('');

  useEffect(() => {
    fetchLions();
    fetchClowns();
  }, []);

  const fetchLions = async () => {
    const response = await fetch('http://localhost:8080/lions', {headers:{ ...authHeader()}});
    const data = await response.json();
    setLions(data);
  };

  const fetchClowns = async () => {
    const response = await fetch('http://localhost:8080/clowns', {headers:{ ...authHeader()}});
    const data = await response.json();
    setClowns(data);
  };  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLion = { name, roarstrength, clown: clown ? { id: clown } : null };

    await fetch('http://localhost:8080/lions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(newLion),
    });
    setName('');
    setRoarStrength('');
    setClown('');
    fetchLions();
  };

  const handleTrainerChange = (lionId, trainerId) => {
    const updatedLions = lions.map(lion => 
      lion.id === lionId ? { ...lion, clown: { id: trainerId } } : lion
    );
    setLions(updatedLions);
    setSelectedTrainer(prevState => ({
      ...prevState,
      [lionId]: trainerId
    }));
  };

  const handleDeleteLion = (lionId) => {
    fetch(`http://localhost:8080/lions/${lionId}`, {
      method: 'DELETE',
      headers:{ ...authHeader()}
    })
    .then(response => {
      if (response.ok) {
        setLions(prevLions => prevLions.filter(lion => lion.id !== lionId));
      } else {
        console.error('Failed to delete lion');
      }
    })
    .catch(error => console.error('Error:', error));
  };
  

  const updateTrainer = async (lionId) => {
    const trainerId = selectedTrainer[lionId];
    if (!trainerId) return;

    await fetch(`http://localhost:8080/lions/${lionId}?trainerId=${trainerId}`, {
      method: 'PUT',
      headers:{ ...authHeader()}
    });
    fetchLions();

    setSelectedTrainer((prev) => {
      const updatedSelectedTrainer = { ...prev };
      delete updatedSelectedTrainer[lionId];
      return updatedSelectedTrainer;
    });
  };

  const userRole = localStorage.getItem("userRole");


  return (
    <div className="lions-container">
      <div className="table-container">
        <h2>Lions</h2>
        <table>
          <thead>
            <tr key="lionheader">
              <th>Name</th>
              <th>Roar Strength</th>
              <th>Clown Trainer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lions.map((lion) => (
              <tr key={lion.id}>
                <td>{lion.name}</td>
                <td>{lion.roarstrength}</td>
                <td>{lion.clownName ? lion.clownName : 'No Trainer'}</td>
                <td>
                <select
                  value={selectedTrainer[lion.id] || ''}
                  onChange={(e) => handleTrainerChange(lion.id, e.target.value)}
                >
                  <option value="">Select Trainer</option>
                  {clowns.map(clown => (
                    <option key={clown.id} value={clown.id}>{clown.name}</option>
                  ))}
                </select>
                  <button style={{ marginLeft: '10px' }} onClick={() => updateTrainer(lion.id)}>Update Trainer</button>
                
                  <button style={{ marginLeft: '10px' }} onClick={() => handleDeleteLion(lion.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(userRole === "ADMIN" || userRole === "ME") && (
      <div className="form-container">
        <h2>Add Lion</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Roar Strength:</label>
            <input
              type="number"
              value={roarstrength}
              onChange={(e) => setRoarStrength(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Clown Trainer:</label>
            <select
              value={clown}
              onChange={(e) => setClown(e.target.value)}
            >
              <option value="">No Trainer</option>
              {clowns.map(clown => (
                <option key={clown.id} value={clown.id}>{clown.name}</option>
              ))}
            </select>
          </div>
          <button type="submit">Add Lion</button>
        </form>
      </div>
      )}
    </div>
  );
};

export default Lions;
